import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Boolean, DateTime, Date, ForeignKey, JSON
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship
from database import Base, engine

# Helper for universal UUID & JSON that works seamlessly in both PostgreSQL and SQLite
is_postgres = engine.dialect.name == "postgresql"
UUIDType = PG_UUID(as_uuid=True) if is_postgres else String(36)
JSONType = JSONB if is_postgres else JSON

class User(Base):
    __tablename__ = "users"

    id = Column(UUIDType, primary_key=True, default=lambda: str(uuid.uuid4()) if not is_postgres else uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True) # Optional for kiosk QR auto-auth
    role = Column(String(20), nullable=False, default="patient") # "doctor", "patient", "admin"
    full_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient_profile = relationship("Patient", back_populates="user", uselist=False, cascade="all, delete-orphan")
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(UUIDType, primary_key=True, default=lambda: str(uuid.uuid4()) if not is_postgres else uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    abha_id = Column(String(50), unique=True, index=True, nullable=True)
    dob = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)
    blood_group = Column(String(5), nullable=True)
    allergies = Column(JSONType, default=list) # e.g. ["Penicillin", "Dust"]
    emergency_contact = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="patient_profile")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")
    documents = relationship("PatientDocument", back_populates="patient", cascade="all, delete-orphan")
    clinical_profiles = relationship("PatientClinicalProfile", back_populates="patient", cascade="all, delete-orphan")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(UUIDType, primary_key=True, default=lambda: str(uuid.uuid4()) if not is_postgres else uuid.uuid4)
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    specialization = Column(String(100), nullable=False)
    license_number = Column(String(50), unique=True, nullable=False)
    hospital_name = Column(String(150), nullable=True)
    room_number = Column(String(20), nullable=True)

    user = relationship("User", back_populates="doctor_profile")
    appointments = relationship("Appointment", back_populates="doctor")


class Appointment(Base):
    """Layer 1: Appointments, Queue & Scheduling"""
    __tablename__ = "appointments"

    id = Column(UUIDType, primary_key=True, default=lambda: str(uuid.uuid4()) if not is_postgres else uuid.uuid4)
    patient_id = Column(UUIDType, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(UUIDType, ForeignKey("doctors.id", ondelete="SET NULL"), nullable=True)
    scheduled_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    token_number = Column(Integer, nullable=True)
    status = Column(String(20), default="waiting") # "scheduled", "waiting", "in_consultation", "completed", "cancelled"
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    clinical_profile = relationship("PatientClinicalProfile", back_populates="appointment", uselist=False)


class PatientDocument(Base):
    """Layer 2: Digital Documents, Prescriptions, Parche & Reports"""
    __tablename__ = "patient_documents"

    id = Column(UUIDType, primary_key=True, default=lambda: str(uuid.uuid4()) if not is_postgres else uuid.uuid4)
    patient_id = Column(UUIDType, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(50), nullable=False) # "prescription", "lab_report", "xray", "audio_dictation"
    file_url = Column(Text, nullable=False)
    file_name = Column(String(255), nullable=False)
    mime_type = Column(String(50), nullable=True)
    file_size = Column(Integer, nullable=True)
    raw_extracted_text = Column(Text, nullable=True) # OCR / Speech-to-text transcript
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="documents")


class PatientClinicalProfile(Base):
    """Layer 3: AI Refined Clinical Profile (JSONB) for 1-Page Fast Render"""
    __tablename__ = "patient_clinical_profiles"

    id = Column(UUIDType, primary_key=True, default=lambda: str(uuid.uuid4()) if not is_postgres else uuid.uuid4)
    patient_id = Column(UUIDType, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    appointment_id = Column(UUIDType, ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True)
    
    triage_priority = Column(String(20), default="Routine") # "Low", "Routine", "Specialist", "Emergency"
    chief_complaint = Column(Text, nullable=True)
    vitals = Column(JSONType, default=dict) # {"bp": "120/80", "pulse": 74, "spo2": 99, "temp": "98.4F", "weight": "58kg"}
    ai_summary = Column(Text, nullable=True) # 2-sentence clinical brief for Doctor Cockpit
    clinical_entities = Column(JSONType, default=dict) # {"medications": [...], "symptoms": [...], "allergies": [...], "differential": [...]}
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="clinical_profiles")
    appointment = relationship("Appointment", back_populates="clinical_profile")
