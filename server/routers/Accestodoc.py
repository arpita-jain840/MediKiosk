from collections import defaultdict, deque

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()
doctor_patient_queue = defaultdict(deque)
submitted_patient_by_doctor: dict[str, str] = {}


class SubmitPatientRequest(BaseModel):
    patient_id: str
    doctor_id: str

@router.post("/submit")
async def submit_patient(data: SubmitPatientRequest):
    doctor_patient_queue[data.doctor_id].append(data.patient_id)
    print(f"Patient {data.patient_id} added to queue for doctor {data.doctor_id}")
    return {
        "success": True,
        "message": "Patient sent to doctor",
        "patient_id": data.patient_id,
        "doctor_id": data.doctor_id,
    }


@router.post("/patient/submit")
async def notify_doctor_of_submission(data: SubmitPatientRequest):
    submitted_patient_by_doctor[data.doctor_id] = data.patient_id
    return {
        "success": True,
        "patient_id": data.patient_id,
        "doctor_id": data.doctor_id,
    }


@router.get("/doctor/{doctor_id}/patient")
async def get_submitted_patient(doctor_id: str):
    patient_id = submitted_patient_by_doctor.pop(doctor_id, None)
    return {
        "success": True,
        "patient_id": patient_id,
    }
    
@router.get("/doctor/{doctor_id}/patients")
async def get_doctor_patients(doctor_id: str):
    queue = doctor_patient_queue[doctor_id]
    patient_id = queue.popleft() if queue else None

    if patient_id:
        print(f"Patient {patient_id} removed from queue for doctor {doctor_id}")

    return {
        "success": True,
        "patient_id": patient_id,
    }

