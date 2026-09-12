from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Patient
from services.notification_service import consume_notifications, queue_notification


router = APIRouter(prefix="/api", tags=["Patient Notifications"])


class RemarkNotificationRequest(BaseModel):
    message: str = Field(..., min_length=1)
    doctor_name: str = Field(..., min_length=1)


class PrescriptionNotificationRequest(BaseModel):
    doctor_name: str = Field(..., min_length=1)
    pdf_url: Optional[str] = None
    message: Optional[str] = None
    prescription: Optional[Dict[str, Any]] = None


async def validate_patient(patient_id: str, db: AsyncSession) -> None:
    result = await db.execute(select(Patient.id).where(Patient.id == patient_id))
    if result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Patient not found.")


@router.post("/patient/remarks/{patient_id}")
async def queue_patient_remark(
    patient_id: str,
    payload: RemarkNotificationRequest,
    db: AsyncSession = Depends(get_db),
):
    await validate_patient(patient_id, db)
    notification = queue_notification(
        patient_id=patient_id,
        notification_type="remark",
        title="Doctor sent you a note",
        message=payload.message,
        doctor_name=payload.doctor_name,
    )
    return {
        "success": True,
        "message": "Notification queued",
        "notification_id": notification["id"],
    }


@router.post("/patient/prescription/{patient_id}")
async def queue_patient_prescription(
    patient_id: str,
    payload: PrescriptionNotificationRequest,
    db: AsyncSession = Depends(get_db),
):
    await validate_patient(patient_id, db)
    notification = queue_notification(
        patient_id=patient_id,
        notification_type="prescription",
        title="Your prescription is ready",
        message=payload.message or f"{payload.doctor_name} has uploaded your prescription.",
        doctor_name=payload.doctor_name,
        pdf_url=payload.pdf_url,
    )
    return {
        "success": True,
        "message": "Notification queued",
        "notification_id": notification["id"],
    }


@router.get("/patient/notifications/{patient_id}")
async def poll_patient_notifications(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
):
    await validate_patient(patient_id, db)
    print(f"[NOTIFICATION] Poll request: {patient_id}")
    notifications = consume_notifications(patient_id)
    if not notifications:
        print(f"[NOTIFICATION] No pending notifications for {patient_id}")
    return {"success": True, "notifications": notifications}