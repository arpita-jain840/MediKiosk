import os
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database import get_db
from models import User, Patient, Doctor, Appointment, PatientClinicalProfile, PatientDocument
from services import ai_service

router = APIRouter(prefix="/api", tags=["Healthcare Database Core"])

# ---------------------------------------------------------------------------
# 1. Doctor Cockpit Endpoint (1-Page Fast Render joining Layer 1, 2, 3)
# ---------------------------------------------------------------------------
@router.get("/doctor/patients")
async def get_doctor_patient_cockpit(db: AsyncSession = Depends(get_db)):
    """
    Returns full clinical cockpit data for all active queue patients:
    - User details (Name, Age, Gender)
    - Layer 1: Appointment status & Token number
    - Layer 2: Documents (count/urls)
    - Layer 3: AI Refined JSONB Vitals, AI Summary, and Triage Priority
    """
    stmt = (
        select(Patient)
        .options(
            selectinload(Patient.user),
            selectinload(Patient.appointments),
            selectinload(Patient.clinical_profiles),
            selectinload(Patient.documents),
        )
    )
    result = await db.execute(stmt)
    patients = result.scalars().all()

    cockpit_records = []
    for p in patients:
        u = p.user
        latest_appt = p.appointments[-1] if p.appointments else None
        latest_profile = p.clinical_profiles[-1] if p.clinical_profiles else None

        age = 2026 - p.dob.year if p.dob else 30
        cockpit_records.append({
            "id": str(p.id),
            "name": u.full_name if u else "Unknown",
            "email": u.email if u else "",
            "phone": u.phone if u else "",
            "age": age,
            "gender": p.gender or "Not Specified",
            "bloodGroup": p.blood_group or "Unknown",
            "abha": p.abha_id or "Not Linked",
            "token": latest_appt.token_number if latest_appt else None,
            "status": latest_appt.status if latest_appt else "waiting",
            "triagePriority": latest_profile.triage_priority if latest_profile else "Routine",
            "complaint": latest_profile.chief_complaint if latest_profile else "",
            "vitals": latest_profile.vitals if latest_profile else {},
            "aiSummary": latest_profile.ai_summary if latest_profile else "",
            "clinicalEntities": latest_profile.clinical_entities if latest_profile else {},
            "documentsCount": len(p.documents),
            "allergies": p.allergies or [],
        })

    # Sort by token number
    cockpit_records.sort(key=lambda x: (x["token"] is None, x["token"]))
    return cockpit_records


# ---------------------------------------------------------------------------
# 2. Layer 1: Book Appointment
# ---------------------------------------------------------------------------
@router.post("/appointments/book")
async def book_appointment(
    patient_id: str,
    doctor_id: Optional[str] = None,
    chief_complaint: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    # Verify patient exists
    p_result = await db.execute(select(Patient).where(Patient.id == patient_id))
    patient = p_result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    # Generate token
    token_res = await db.execute(select(Appointment))
    token_count = len(token_res.scalars().all()) + 1

    appt = Appointment(
        patient_id=patient.id,
        doctor_id=doctor_id,
        token_number=token_count,
        status="waiting",
    )
    db.add(appt)
    await db.flush()

    if chief_complaint:
        profile = PatientClinicalProfile(
            patient_id=patient.id,
            appointment_id=appt.id,
            chief_complaint=chief_complaint,
            triage_priority="Routine",
            ai_summary=f"Patient booked with: {chief_complaint}"
        )
        db.add(profile)

    await db.commit()
    return {"message": "Appointment booked successfully", "token": token_count, "appointmentId": str(appt.id)}


# ---------------------------------------------------------------------------
# 3. Layer 2: Upload Parche / Document & Run AI OCR Ingestion
# ---------------------------------------------------------------------------
@router.post("/patient/upload-document")
async def upload_patient_document(
    patient_id: str = Form(...),
    document_type: str = Form("prescription"),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    # Save file to local uploads directory (or S3/Cloud Storage in production)
    os.makedirs("uploads", exist_ok=True)
    saved_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join("uploads", saved_filename)
    
    file_bytes = await file.read()
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Process image with Gemini Vision if image
    extracted_text = ""
    if file.content_type and file.content_type.startswith("image/"):
        await file.seek(0)
        try:
            extracted_text = await ai_service.process_medical_image(file)
        except Exception as e:
            extracted_text = f"[AI Extraction Error: {str(e)}]"

    # Layer 2 Record in Database
    doc = PatientDocument(
        patient_id=patient_id,
        document_type=document_type,
        file_url=f"/uploads/{saved_filename}",
        file_name=file.filename or saved_filename,
        mime_type=file.content_type,
        file_size=len(file_bytes),
        raw_extracted_text=extracted_text
    )
    db.add(doc)

    # Layer 3 Update: Update patient clinical profile with the extracted insights
    if extracted_text:
        profile_res = await db.execute(
            select(PatientClinicalProfile)
            .where(PatientClinicalProfile.patient_id == patient_id)
            .order_by(PatientClinicalProfile.created_at.desc())
        )
        profile = profile_res.scalars().first()
        if profile:
            profile.ai_summary = f"{profile.ai_summary or ''}\nDocument Ingested: {extracted_text[:300]}..."
        else:
            profile = PatientClinicalProfile(
                patient_id=patient_id,
                chief_complaint="Document Uploaded",
                ai_summary=f"Extracted from {file.filename}: {extracted_text[:400]}",
                triage_priority="Routine"
            )
            db.add(profile)

    await db.commit()
    return {
        "message": "Document uploaded and ingested into Layer 2 & Layer 3",
        "documentId": str(doc.id),
        "extractedSummary": extracted_text[:300] if extracted_text else "Pending review"
    }
