import json
from datetime import datetime, date
from sqlalchemy import select
from database import engine, Base, AsyncSessionLocal
from models import User, Patient, Doctor, Appointment, PatientClinicalProfile, PatientDocument

INITIAL_PATIENTS = [
    {
        "name": "Emma Watson",
        "email": "emma.watson@example.com",
        "age": 28,
        "gender": "Female",
        "blood_group": "O+",
        "abha": "14-9824-3321-0012",
        "vitals": {"bp": "118/76 mmHg", "pulse": "74 bpm", "spO2": "99%", "temp": "98.4 °F", "weight": "58 kg"},
        "complaint": "Seasonal allergies, nasal congestion & mild tension headache",
        "allergies": ["Penicillin", "Peanuts"],
        "medications": ["Cetirizine 10mg", "Vitamin D3"],
        "history": "Mild asthma diagnosed in 2021. No prior surgeries.",
        "status": "waiting",
        "token": 1,
        "priority": "Routine"
    },
    {
        "name": "Sarah Hosten",
        "email": "sarah.hosten@example.com",
        "age": 34,
        "gender": "Female",
        "blood_group": "A+",
        "abha": "14-4412-8823-0101",
        "vitals": {"bp": "124/82 mmHg", "pulse": "80 bpm", "spO2": "97%", "temp": "99.1 °F", "weight": "64 kg"},
        "complaint": "Persistent dry bronchitis cough for 5 days",
        "allergies": ["Sulfa drugs"],
        "medications": ["Albuterol Inhaler"],
        "history": "Frequent seasonal upper respiratory infections.",
        "status": "in_consultation",
        "token": 2,
        "priority": "Specialist"
    },
    {
        "name": "Dakota Smith",
        "email": "dakota.smith@example.com",
        "age": 52,
        "gender": "Male",
        "blood_group": "B+",
        "abha": "14-8723-5561-0102",
        "vitals": {"bp": "138/88 mmHg", "pulse": "76 bpm", "spO2": "98%", "temp": "98.6 °F", "weight": "78 kg"},
        "complaint": "Post-stroke neurological rehabilitation follow-up",
        "allergies": ["Aspirin"],
        "medications": ["Atorvastatin 20mg", "Clopidogrel 75mg"],
        "history": "Ischemic stroke 6 months ago; physical therapy ongoing.",
        "status": "waiting",
        "token": 3,
        "priority": "Specialist"
    },
    {
        "name": "John Smith",
        "email": "john.smith@example.com",
        "age": 46,
        "gender": "Male",
        "blood_group": "O-",
        "abha": "14-1920-9942-0103",
        "vitals": {"bp": "130/84 mmHg", "pulse": "72 bpm", "spO2": "98%", "temp": "98.8 °F", "weight": "82 kg"},
        "complaint": "Liver function panel review & abdominal ultrasound follow-up",
        "allergies": [],
        "medications": ["Spironolactone 50mg", "Multivitamins"],
        "history": "Non-alcoholic fatty liver disease (NAFLD) stage 2.",
        "status": "waiting",
        "token": 4,
        "priority": "Routine"
    },
    {
        "name": "Priya Sharma",
        "email": "priya.sharma@example.com",
        "age": 34,
        "gender": "Female",
        "blood_group": "B+",
        "abha": "14-2938-4471-0093",
        "vitals": {"bp": "128/82 mmHg", "pulse": "88 bpm", "spO2": "98%", "temp": "98.6 °F", "weight": "62 kg"},
        "complaint": "Chest tightness and mild breathlessness when climbing stairs for 3 hours",
        "allergies": ["Penicillin", "Dust"],
        "medications": ["Metformin 500mg"],
        "history": "Type 2 diabetes mellitus diagnosed 4 years ago.",
        "status": "waiting",
        "token": 5,
        "priority": "Specialist"
    },
    {
        "name": "Rajesh Kumar",
        "email": "rajesh.kumar@example.com",
        "age": 59,
        "gender": "Male",
        "blood_group": "AB+",
        "abha": "14-5582-7719-0104",
        "vitals": {"bp": "150/94 mmHg", "pulse": "82 bpm", "spO2": "96%", "temp": "98.7 °F", "weight": "84 kg"},
        "complaint": "Hypertensive follow-up with recurring morning dizziness",
        "allergies": ["Iodinated contrast"],
        "medications": ["Amlodipine 5mg", "Telmisartan 40mg"],
        "history": "Essential hypertension for 8 years.",
        "status": "waiting",
        "token": 6,
        "priority": "Routine"
    },
    {
        "name": "Amina Begum",
        "email": "amina.begum@example.com",
        "age": 41,
        "gender": "Female",
        "blood_group": "O+",
        "abha": "14-7712-4439-0105",
        "vitals": {"bp": "114/72 mmHg", "pulse": "70 bpm", "spO2": "99%", "temp": "98.2 °F", "weight": "55 kg"},
        "complaint": "Severe acute migraine with visual aura & nausea",
        "allergies": ["NSAIDs (gastric pain)"],
        "medications": ["Sumatriptan 50mg PRN"],
        "history": "Chronic episodic migraine since age 25.",
        "status": "waiting",
        "token": 7,
        "priority": "Specialist"
    },
    {
        "name": "David Chen",
        "email": "david.chen@example.com",
        "age": 23,
        "gender": "Male",
        "blood_group": "A-",
        "abha": "14-3382-9901-0106",
        "vitals": {"bp": "120/78 mmHg", "pulse": "65 bpm", "spO2": "99%", "temp": "98.4 °F", "weight": "70 kg"},
        "complaint": "Right knee swelling and twisting injury during football match",
        "allergies": [],
        "medications": ["Ibuprofen 400mg"],
        "history": "No prior orthopedic injuries or surgeries.",
        "status": "completed",
        "token": 8,
        "priority": "Low"
    },
    {
        "name": "Fatima Noor",
        "email": "fatima.noor@example.com",
        "age": 67,
        "gender": "Female",
        "blood_group": "B-",
        "abha": "14-9901-2244-0107",
        "vitals": {"bp": "136/84 mmHg", "pulse": "75 bpm", "spO2": "95%", "temp": "98.6 °F", "weight": "68 kg"},
        "complaint": "COPD maintenance visit, mild exertion dyspnea with seasonal climate change",
        "allergies": ["Codeine"],
        "medications": ["Tiotropium Respimat", "Formoterol"],
        "history": "COPD Stage 2, diagnosed in 2018.",
        "status": "waiting",
        "token": 9,
        "priority": "Specialist"
    },
    {
        "name": "Vikram Malhotra",
        "email": "vikram.malhotra@example.com",
        "age": 38,
        "gender": "Male",
        "blood_group": "O+",
        "abha": "14-1182-6632-0108",
        "vitals": {"bp": "122/80 mmHg", "pulse": "78 bpm", "spO2": "99%", "temp": "98.6 °F", "weight": "75 kg"},
        "complaint": "Annual preventive executive health checkup and lipid profile review",
        "allergies": [],
        "medications": [],
        "history": "None. Family history of coronary artery disease.",
        "status": "waiting",
        "token": 10,
        "priority": "Low"
    }
]

async def init_db_and_seed():
    """Initializes tables and seeds the 10 patients if the database is empty."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if users already seeded
        result = await session.execute(select(User).limit(1))
        existing_user = result.scalars().first()
        if existing_user:
            print("[Database] Tables already populated. Skipping seed.")
            return

        print("[Database] Seeding default doctor and 10 patients...")

        # 1. Create Default Doctor
        doctor_user = User(
            email="dr.smith@medikiosk.com",
            full_name="Dr. John Smith",
            role="doctor",
            phone="+91 98765 43210"
        )
        session.add(doctor_user)
        await session.flush()

        doctor = Doctor(
            user_id=doctor_user.id,
            specialization="Cardiologist & General Medicine",
            license_number="MCI-2018-99412",
            hospital_name="City Care Hospital",
            room_number="Room 4B"
        )
        session.add(doctor)
        await session.flush()

        # 2. Create 10 Patients with Layer 1 Appointments and Layer 3 Clinical Profiles
        for pdata in INITIAL_PATIENTS:
            p_user = User(
                email=pdata["email"],
                full_name=pdata["name"],
                role="patient",
                phone="+91 91234 56789"
            )
            session.add(p_user)
            await session.flush()

            patient = Patient(
                user_id=p_user.id,
                abha_id=pdata["abha"],
                gender=pdata["gender"],
                blood_group=pdata["blood_group"],
                allergies=pdata["allergies"],
                dob=date(2026 - pdata["age"], 1, 1)
            )
            session.add(patient)
            await session.flush()

            # Layer 1: Appointment
            appointment = Appointment(
                patient_id=patient.id,
                doctor_id=doctor.id,
                scheduled_at=datetime.utcnow(),
                token_number=pdata["token"],
                status=pdata["status"]
            )
            session.add(appointment)
            await session.flush()

            # Layer 2: Seed Scanned Parche / Documents
            sample_doc = PatientDocument(
                patient_id=patient.id,
                document_type="prescription" if pdata["token"] % 2 == 1 else "lab_report",
                file_url="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
                file_name=f"Prior_OPD_Record_{pdata['token']}.pdf",
                mime_type="application/pdf",
                file_size=245000,
                raw_extracted_text=f"Physician Note: Patient {pdata['name']}. Rx: {', '.join(pdata['medications']) if pdata['medications'] else 'Lifestyle management'}. History: {pdata['history']}."
            )
            session.add(sample_doc)
            await session.flush()

            # Layer 3: AI Refined Clinical Blueprint (JSONB)
            is_cardiac = "chest" in pdata["complaint"].lower()
            red_flags = []
            if is_cardiac:
                red_flags.append("Possible acute coronary/cardiovascular distress — left arm radiation & sweating flagged.")
            elif "stroke" in pdata["complaint"].lower():
                red_flags.append("Recent cerebrovascular event — monitor neurological status & BP.")

            hpi_data = {
                "onset": "3 hours ago" if is_cardiac else "5 days ago",
                "duration": "Acute episodic",
                "character": "Compressive tightness" if is_cardiac else "Dull intermittent ache",
                "radiation": "Left arm and shoulder" if is_cardiac else "Local",
                "triggers": "Exertion / climbing stairs",
                "relieving": "Rest"
            }

            ayush_data = {
                "prakriti": "Vata-Pitta" if pdata["gender"] == "Female" else "Pitta-Kapha",
                "agni": "Mandagni (slow digestion)" if pdata["age"] > 50 else "Vishamagni (variable)",
                "koshtha": "Madhyama (normal bowel pattern)",
                "ahara_vihara": "High stress, sedentary urban OPD lifestyle, irregular meal timings"
            }

            timeline_data = [
                {
                    "date": "2026-09-02",
                    "type": "prescription",
                    "title": "Hospital OPD Prescription",
                    "summary": f"Prescribed: {', '.join(pdata['medications']) if pdata['medications'] else 'Observation'}"
                },
                {
                    "date": "2026-08-18",
                    "type": "lab_report",
                    "title": "Routine Investigation",
                    "summary": f"Vitals check: BP {pdata['vitals']['bp']}, Pulse {pdata['vitals']['pulse']}."
                }
            ]

            clinical_profile = PatientClinicalProfile(
                patient_id=patient.id,
                appointment_id=appointment.id,
                triage_priority=pdata["priority"],
                chief_complaint=pdata["complaint"],
                vitals=pdata["vitals"],
                ai_summary=f"Patient {pdata['name']} ({pdata['age']}y {pdata['gender']}) presents with {pdata['complaint'].lower()}. Vitals: BP {pdata['vitals']['bp']}, SpO2 {pdata['vitals']['spO2']}. Relevant history: {pdata['history']}",
                clinical_entities={
                    "medications": pdata["medications"],
                    "allergies": pdata["allergies"],
                    "history": pdata["history"],
                    "symptoms": [pdata["complaint"]]
                },
                hpi=hpi_data,
                red_flags=red_flags,
                ayush_pariksha=ayush_data,
                timeline=timeline_data
            )
            session.add(clinical_profile)

        await session.commit()
        print("[Database] Successfully initialized and seeded 10 patient records across all 3 layers!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db_and_seed())
