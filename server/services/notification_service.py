import threading
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional


patient_notifications: Dict[str, List[Dict[str, Any]]] = {}
_notification_lock = threading.Lock()


def queue_notification(
    patient_id: str,
    notification_type: str,
    title: str,
    message: str,
    doctor_name: str,
    pdf_url: Optional[str] = None,
) -> Dict[str, Any]:
    notification: Dict[str, Any] = {
        "id": str(uuid.uuid4()),
        "type": notification_type,
        "title": title,
        "message": message,
        "doctor_name": doctor_name,
        "created_at": datetime.utcnow().isoformat(),
        "read": False,
    }
    if pdf_url:
        notification["pdf_url"] = pdf_url

    with _notification_lock:
        patient_notifications.setdefault(patient_id, []).append(notification)

    print(f"[NOTIFICATION] Queued for patient: {patient_id}")
    print(f"[NOTIFICATION] Type: {notification_type}")
    return notification


def consume_notifications(patient_id: str) -> List[Dict[str, Any]]:
    with _notification_lock:
        pending = patient_notifications.pop(patient_id, [])

    for notification in pending:
        print(f"[NOTIFICATION] Delivered: {notification['id']}")
    return pending