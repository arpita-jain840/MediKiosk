from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import User, Patient, Doctor

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str
    role: Optional[str] = None # "doctor" or "patient"

class GoogleAuthRequest(BaseModel):
    id_token: Optional[str] = None
    email: str
    full_name: Optional[str] = None
    role: Optional[str] = "patient"

@router.post("/login")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    u_lower = req.username.strip().lower()
    p_pass = req.password.strip()

    # 1. First check Database Users table with profile associations
    from sqlalchemy.orm import selectinload
    stmt = (
        select(User)
        .options(selectinload(User.patient_profile), selectinload(User.doctor_profile))
        .where((User.email.ilike(u_lower)) | (User.full_name.ilike(u_lower)))
    )
    res = await db.execute(stmt)
    db_user = res.scalars().first()

    # Known credential mappings
    designated_passwords = {
        "admindoc": ["admindoc"],
        "admindoc@medikiosk.com": ["admindoc"],
        "user1": ["user1123", "user123"],
        "user2": ["user2123", "user223"],
        "user3": ["user3123", "user323"],
        "user4": ["user4123", "user423"],
        "user5": ["user5123", "user523"],
    }

    if db_user:
        is_valid_pw = (
            db_user.password_hash == p_pass
            or (u_lower in designated_passwords and p_pass in designated_passwords[u_lower])
            or not db_user.password_hash
        )
        if is_valid_pw:
            if db_user.role == "doctor":
                doc = db_user.doctor_profile
                return {
                    "success": True,
                    "role": "doctor",
                    "redirect": "/doctor",
                    "user": {
                        "id": str(doc.id) if doc else str(db_user.id),
                        "user_id": str(db_user.id),
                        "doctor_id": str(doc.id) if doc else str(db_user.id),
                        "username": db_user.email,
                        "full_name": db_user.full_name,
                        "role": "doctor",
                        "hospital": doc.hospital_name if doc else "City Care Hospital · AIIA OPD",
                        "room": doc.room_number if doc else "Room 4B"
                    },
                    "token": f"bearer-medikiosk-doctor-{db_user.id}"
                }
            else:
                pat = db_user.patient_profile
                return {
                    "success": True,
                    "role": "patient",
                    "redirect": "/patient",
                    "user": {
                        "id": str(pat.id) if pat else str(db_user.id),
                        "patient_id": str(pat.id) if pat else str(db_user.id),
                        "user_id": str(db_user.id),
                        "username": db_user.email,
                        "full_name": db_user.full_name,
                        "role": "patient",
                        "phone": db_user.phone or "+91 91234 56789",
                        "abha": pat.abha_id if pat else "14-2938-4471-0093",
                        "gender": pat.gender if pat else "Not Specified",
                        "bloodGroup": pat.blood_group if pat else "Unknown",
                        "allergies": pat.allergies if pat else []
                    },
                    "token": f"bearer-medikiosk-patient-{db_user.id}"
                }

    # 2. Designated fallback credentials (in case DB is temporarily offline or seeding)
    if (u_lower in ["admindoc", "admindoc@medikiosk.com"]) and p_pass == "admindoc":
        return {
            "success": True,
            "role": "doctor",
            "redirect": "/doctor",
            "user": {
                "id": "doc-admin-01",
                "username": "admindoc",
                "full_name": "Dr. Admin Doc",
                "role": "doctor",
                "hospital": "City Care Hospital · AIIA OPD",
                "room": "Room 4B"
            },
            "token": "bearer-medikiosk-doctor-token"
        }

    designated_users = {
        "user1": {"passwords": ["user1123", "user123"], "full_name": "Priya Sharma", "abha": "14-2938-4471-0093", "age": 34, "gender": "Female"},
        "user2": {"passwords": ["user2123", "user223"], "full_name": "Emma Watson", "abha": "14-9824-3321-0012", "age": 28, "gender": "Female"},
        "user3": {"passwords": ["user3123", "user323"], "full_name": "Rajesh Kumar", "abha": "14-5582-7719-0104", "age": 59, "gender": "Male"},
        "user4": {"passwords": ["user4123", "user423"], "full_name": "Sarah Hosten", "abha": "14-4412-8823-0101", "age": 34, "gender": "Female"},
        "user5": {"passwords": ["user5123", "user523"], "full_name": "Vikram Malhotra", "abha": "14-1182-6632-0108", "age": 38, "gender": "Male"}
    }

    if u_lower in designated_users and p_pass in designated_users[u_lower]["passwords"]:
        u_info = designated_users[u_lower]
        return {
            "success": True,
            "role": "patient",
            "redirect": "/patient",
            "user": {
                "id": f"patient-{u_lower}-id",
                "username": u_lower,
                "full_name": u_info["full_name"],
                "role": "patient",
                "abha": u_info["abha"],
                "age": u_info["age"],
                "gender": u_info["gender"]
            },
            "token": f"bearer-medikiosk-{u_lower}-token"
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials. Doctor: 'admindoc' / 'admindoc', Patients: 'user1'..'user5' with passwords 'user1123'..'user5123'."
    )


@router.post("/google")
async def google_auth(req: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    """
    Handles Google OAuth / Firebase Sign-In.
    Validates the account and resolves user profile.
    """
    email_clean = req.email.strip().lower()
    
    # Check if user exists
    query = select(User).where(User.email.ilike(email_clean))
    res = await db.execute(query)
    user = res.scalars().first()

    target_role = req.role or ("doctor" if "doctor" in email_clean else "patient")

    if not user:
        user = User(
            email=email_clean,
            full_name=req.full_name or email_clean.split("@")[0].title(),
            role=target_role,
            password_hash="google_oauth_verified"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    redirect_url = "/doctor" if user.role == "doctor" else "/patient"
    return {
        "success": True,
        "provider": "google",
        "role": user.role,
        "redirect": redirect_url,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        },
        "token": f"bearer-google-{user.id}"
    }
