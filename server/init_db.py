import asyncio
from datetime import date
from sqlalchemy import text
from database import engine, Base, AsyncSessionLocal
from models import (
    User, Patient, Doctor, Appointment,
    RawRecord, ClinicalBlueprint
)

USERS_SEED = [
    {
        "username": "user1",
        "password": "user1123",
        "full_name": "Priya Sharma",
        "email": "user1",
        "phone": "+91 91234 56781",
        "abha": "14-2938-4471-0093",
        "dob": date(1992, 5, 14),
        "gender": "Female",
        "blood_group": "B+",
        "allergies": ["Penicillin", "Dust"],
    },
    {
        "username": "user2",
        "password": "user2123",
        "full_name": "Emma Watson",
        "email": "user2",
        "phone": "+91 91234 56782",
        "abha": "14-9824-3321-0012",
        "dob": date(1998, 4, 15),
        "gender": "Female",
        "blood_group": "O+",
        "allergies": ["Penicillin", "Peanuts"],
    },
    {
        "username": "user3",
        "password": "user3123",
        "full_name": "Rajesh Kumar",
        "email": "user3",
        "phone": "+91 91234 56783",
        "abha": "14-5582-7719-0104",
        "dob": date(1967, 8, 22),
        "gender": "Male",
        "blood_group": "AB+",
        "allergies": ["Iodinated contrast"],
    },
    {
        "username": "user4",
        "password": "user4123",
        "full_name": "Sarah Hosten",
        "email": "user4",
        "phone": "+91 91234 56784",
        "abha": "14-4412-8823-0101",
        "dob": date(1992, 11, 30),
        "gender": "Female",
        "blood_group": "A+",
        "allergies": ["Sulfa drugs"],
    },
    {
        "username": "user5",
        "password": "user5123",
        "full_name": "Vikram Malhotra",
        "email": "user5",
        "phone": "+91 91234 56785",
        "abha": "14-1182-6632-0108",
        "dob": date(1988, 3, 10),
        "gender": "Male",
        "blood_group": "O+",
        "allergies": [],
    },
]

async def reset_and_seed_db():
    """
    Resets database schema to clean state:
    - 1 Doctor account: admindoc / admindoc
    - 5 User accounts: user1..user5 with passwords user1123..user5123
    - 0 Appointments (to be added via UI)
    - 0 Raw Records (to be uploaded via UI)
    - 0 Clinical Blueprints (to be synthesized via UI)
    """
    print("[Database] Dropping legacy & existing tables...")
    async with engine.begin() as conn:
        # Drop legacy tables if present
        await conn.execute(text("DROP TABLE IF EXISTS patient_documents CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS patient_clinical_profiles CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS clinical_blueprints CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS raw_records CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS appointments CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS doctors CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS patients CASCADE;"))
        await conn.execute(text("DROP TABLE IF EXISTS users CASCADE;"))
        
        # Create all current tables fresh
        await conn.run_sync(Base.metadata.create_all)
        print("[Database] Fresh tables created: users, patients, doctors, appointments, raw_records, clinical_blueprints")

    async with AsyncSessionLocal() as session:
        # 1. Seed Doctor (admindoc / admindoc)
        print("[Database] Seeding 1 Doctor: admindoc / admindoc ...")
        doctor_user = User(
            email="admindoc",
            password_hash="admindoc",
            full_name="Dr. Admin Doc",
            role="doctor",
            phone="+91 98765 43210"
        )
        session.add(doctor_user)
        await session.flush()

        doctor_profile = Doctor(
            user_id=doctor_user.id,
            specialization="Cardiologist & General Medicine",
            license_number="DOC-ADMIN-001",
            hospital_name="City Care Hospital · AIIA OPD",
            room_number="Room 4B"
        )
        session.add(doctor_profile)
        await session.flush()

        # 2. Seed 5 Patients (user1..user5)
        print("[Database] Seeding 5 Patient accounts (user1..user5) with passwords user1123..user5123 ...")
        for u in USERS_SEED:
            patient_user = User(
                email=u["email"],
                password_hash=u["password"],
                full_name=u["full_name"],
                role="patient",
                phone=u["phone"]
            )
            session.add(patient_user)
            await session.flush()

            patient_profile = Patient(
                user_id=patient_user.id,
                abha_id=u["abha"],
                dob=u["dob"],
                gender=u["gender"],
                blood_group=u["blood_group"],
                allergies=u["allergies"]
            )
            session.add(patient_profile)
            await session.flush()

        # Note: 0 appointments, 0 raw_records, 0 clinical_blueprints seeded as requested!
        await session.commit()
        print("[Database] Setup complete! 1 doctor and 5 patients seeded. 0 appointments (clean state for UI).")

async def init_db_and_seed():
    """Safe startup hook: creates tables if not present and seeds only if users table is empty."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        from sqlalchemy import select
        res = await session.execute(select(User).limit(1))
        if res.scalars().first():
            return
    await reset_and_seed_db()

if __name__ == "__main__":
    asyncio.run(reset_and_seed_db())

