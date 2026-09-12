import asyncio
from datetime import date

from sqlalchemy import select, text

from database import AsyncSessionLocal, Base, engine
from models import Appointment, Doctor, Patient, User


PATIENTS_SEED = [
    {"id": "dd282916-ac7a-4ca8-a6c0-e63ffc62066f", "name": "Emma Watson", "email": "emma.watson@example.com", "age": 28, "gender": "Female", "blood": "O+", "abha": "14-9824-3321-0012", "allergies": ["Penicillin", "Peanuts"], "token": 1, "status": "waiting"},
    {"id": "89f13786-8f6b-4063-bbfa-9beec534a303", "name": "Sarah Hosten", "email": "sarah.hosten@example.com", "age": 34, "gender": "Female", "blood": "A+", "abha": "14-4412-8823-0101", "allergies": ["Sulfa drugs"], "token": 2, "status": "in_consultation"},
    {"id": "a5493a2e-120b-452f-b68a-3f0ec2c6589b", "name": "Dakota Smith", "email": "dakota.smith@example.com", "age": 52, "gender": "Male", "blood": "B+", "abha": "14-8723-5561-0102", "allergies": ["Aspirin"], "token": 3, "status": "waiting"},
    {"id": "06fd6100-3150-42b7-bb47-63b4a2d6f421", "name": "John Smith", "email": "john.smith@example.com", "age": 46, "gender": "Male", "blood": "O-", "abha": "14-1920-9942-0103", "allergies": [], "token": 4, "status": "waiting"},
    {"id": "7047ac9d-9586-42fb-8728-acb9b52a10da", "name": "Priya Sharma", "email": "priya.sharma@example.com", "age": 34, "gender": "Female", "blood": "B+", "abha": "14-2938-4471-0093", "allergies": ["Penicillin", "Dust"], "token": 5, "status": "waiting"},
    {"id": "34808a5f-e712-4fbc-8e22-501c4b4e1527", "name": "Rajesh Kumar", "email": "rajesh.kumar@example.com", "age": 59, "gender": "Male", "blood": "AB+", "abha": "14-5582-7719-0104", "allergies": ["Iodinated contrast"], "token": 6, "status": "waiting"},
    {"id": "0579aca3-b4e7-4f7a-a3ff-dfd6f53ade48", "name": "Amina Begum", "email": "amina.begum@example.com", "age": 41, "gender": "Female", "blood": "O+", "abha": "14-7712-4439-0105", "allergies": ["NSAIDs (gastric pain)"], "token": 7, "status": "waiting"},
    {"id": "78dfff66-0a9c-4638-86dc-70eeb3aa28b1", "name": "David Chen", "email": "david.chen@example.com", "age": 23, "gender": "Male", "blood": "A-", "abha": "14-3382-9901-0106", "allergies": [], "token": 8, "status": "completed"},
    {"id": "603bc261-c74a-4f88-b35f-236c01b61e39", "name": "Fatima Noor", "email": "fatima.noor@example.com", "age": 67, "gender": "Female", "blood": "B-", "abha": "14-9901-2244-0107", "allergies": ["Codeine"], "token": 9, "status": "waiting"},
    {"id": "84759d82-b1bf-48d7-9cb8-ee41518d7837", "name": "Vikram Malhotra", "email": "vikram.malhotra@example.com", "age": 38, "gender": "Male", "blood": "O+", "abha": "14-1182-6632-0108", "allergies": [], "token": 10, "status": "waiting"},
]


async def reset_and_seed_db():
    print("[Database] Resetting local prototype database...")
    async with engine.begin() as conn:
        drop_suffix = " CASCADE" if engine.dialect.name == "postgresql" else ""
        for table in ("patient_documents", "patient_clinical_profiles", "clinical_blueprints", "raw_records", "appointments", "doctors", "patients", "users"):
            await conn.execute(text(f"DROP TABLE IF EXISTS {table}{drop_suffix};"))
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        doctor_user = User(
            email="admindoc",
            password_hash="admindoc",
            full_name="Dr. Admin Doc",
            role="doctor",
            phone="+91 98765 43210",
        )
        session.add(doctor_user)
        await session.flush()

        doctor = Doctor(
            user_id=doctor_user.id,
            specialization="Cardiologist & General Medicine",
            license_number="DOC-ADMIN-001",
            hospital_name="City Care Hospital - AIIA OPD",
            room_number="Room 4B",
        )
        session.add(doctor)
        await session.flush()

        for index, seed in enumerate(PATIENTS_SEED, start=1):
            user = User(
                email=seed["email"],
                password_hash=f"patient{index}123",
                full_name=seed["name"],
                role="patient",
                phone="+91 91234 56789",
            )
            session.add(user)
            await session.flush()

            patient = Patient(
                id=seed["id"],
                user_id=user.id,
                abha_id=seed["abha"],
                dob=date(2026 - seed["age"], 1, 1),
                gender=seed["gender"],
                blood_group=seed["blood"],
                allergies=seed["allergies"],
            )
            session.add(patient)
            await session.flush()
            session.add(Appointment(
                patient_id=patient.id,
                doctor_id=doctor.id,
                token_number=seed["token"],
                status=seed["status"],
            ))

        await session.commit()
        print("[Database] Seeded 1 doctor and 10 supplied patients with stable UUIDs.")


async def init_db_and_seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        patient_ids = (await session.execute(select(Patient.id))).scalars().all()
        supplied_ids = {seed["id"] for seed in PATIENTS_SEED}
        if supplied_ids.issubset({str(patient_id) for patient_id in patient_ids}):
            return

    await reset_and_seed_db()


if __name__ == "__main__":
    asyncio.run(reset_and_seed_db())
