import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
import io
import time
from httpx import AsyncClient, ASGITransport
from main import app

from database import AsyncSessionLocal
from sqlalchemy import select
from models import User, Patient, Doctor, Appointment, RawRecord, ClinicalBlueprint

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/")
        assert res.status_code == 200
        assert "MediKiosk" in res.json()["message"]

@pytest.mark.asyncio
async def test_auth_login_accounts():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Test doctor login
        doc_res = await client.post("/api/auth/login", json={"username": "admindoc", "password": "admindoc"})
        assert doc_res.status_code == 200
        doc_json = doc_res.json()
        assert doc_json["role"] == "doctor"
        assert doc_json["user"]["username"] == "admindoc"

        # Test patient user1 login
        p1_res = await client.post("/api/auth/login", json={"username": "user1", "password": "user1123"})
        assert p1_res.status_code == 200
        p1_json = p1_res.json()
        assert p1_json["role"] == "patient"
        assert p1_json["user"]["full_name"] == "Priya Sharma"

@pytest.mark.asyncio
async def test_full_intake_to_doctor_e2e():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Fetch user1 patient ID from DB
        async with AsyncSessionLocal() as session:
            res = await session.execute(select(Patient).join(User).where(User.email == "user1"))
            patient = res.scalars().first()
            assert patient is not None
            patient_id = str(patient.id)

        # 2. Book an appointment
        book_res = await client.post(f"/api/appointments/book?patient_id={patient_id}&chief_complaint=Chest%20tightness%20on%20exertion")
        assert book_res.status_code == 200
        book_json = book_res.json()
        assert "token" in book_json
        token = book_json["token"]

        # 3. Upload a document into raw_records
        sample_file = io.BytesIO(b"Dummy Prescription Content: Metformin 500mg OD. BP: 130/85")
        files = {"file": ("test_prescription.txt", sample_file, "text/plain")}
        data = {"patient_id": patient_id, "document_type": "prescription"}
        upload_res = await client.post("/api/patient/upload-document", data=data, files=files)
        assert upload_res.status_code == 200
        assert "documentId" in upload_res.json()

        # 4. Generate Clinical Blueprint (Gemini / Synthesis Engine)
        synth_res = await client.post(
            f"/api/clinical/generate-blueprint?patient_id={patient_id}&intake_narration=Acute%20chest%20discomfort%20for%203%20hours"
        )
        assert synth_res.status_code == 200
        synth_json = synth_res.json()
        assert "blueprint" in synth_json
        assert synth_json["blueprint"]["chief_complaint"] is not None

        # 5. Doctor loads Blueprint (<50ms fast render check)
        start_time = time.perf_counter()
        doc_view_res = await client.get(f"/api/doctor/patient/{patient_id}/blueprint")
        duration_ms = (time.perf_counter() - start_time) * 1000

        assert doc_view_res.status_code == 200
        doc_view_json = doc_view_res.json()
        assert doc_view_json["patient"]["id"] == patient_id
        assert doc_view_json["blueprint"]["chiefComplaint"] is not None
        assert "documents" in doc_view_json
        print(f"\n[Performance Benchmark] Doctor Blueprint loaded in {duration_ms:.2f}ms from database")

        # 6. Export ABDM FHIR R4 Bundle
        fhir_res = await client.get(f"/api/patient/{patient_id}/fhir")
        assert fhir_res.status_code == 200
        fhir_bundle = fhir_res.json()
        assert fhir_bundle["resourceType"] == "Bundle"
        assert fhir_bundle["type"] == "document"
        assert len(fhir_bundle["entry"]) >= 4

        # 7. Doctor advances queue
        advance_res = await client.post("/api/doctor/queue/advance", data={"room_number": "Room 4B"})
        assert advance_res.status_code == 200


@pytest.mark.asyncio
async def test_database_only_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Test Doctors Directory from Database
        doc_res = await client.get("/api/doctors")
        assert doc_res.status_code == 200
        doctors = doc_res.json()
        assert len(doctors) >= 1
        assert any("Sharma" in d["name"] or "Cardiologist" in d["spec"] for d in doctors)

        # 2. Test Patient Records from Database
        doc_patients_res = await client.get("/api/doctor/patients")
        assert doc_patients_res.status_code == 200
        patients = doc_patients_res.json()
        assert len(patients) >= 1
        first_patient_id = patients[0]["id"]

        records_res = await client.get(f"/api/patient/{first_patient_id}/records")
        assert records_res.status_code == 200
        records = records_res.json()
        assert isinstance(records, list)

        # 3. Test Appointments from Database
        appts_res = await client.get("/api/appointments")
        assert appts_res.status_code == 200
        appts = appts_res.json()
        assert isinstance(appts, list)
        assert len(appts) >= 1
        assert "patientName" in appts[0]
        assert "token" in appts[0]
