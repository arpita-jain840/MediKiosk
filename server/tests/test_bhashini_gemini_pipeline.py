import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from database import AsyncSessionLocal
from sqlalchemy import select
from models import User, Patient

@pytest.mark.asyncio
async def test_bhashini_groq_conversation():
    """Validates that Kiosk conversation uses Groq + Bhashini translation without hitting Gemini chat quotas"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Hindi query to assistant
        res = await client.post(
            "/api/assistant/chat",
            json={
                "query": "डॉ. जॉन स्मिथ का कमरा कहां है?",
                "lang": "hi",
                "history": []
            }
        )
        assert res.status_code == 200
        data = res.json()
        assert "reply" in data
        assert len(data["reply"]) > 0
        # Model should reflect Groq + Bhashini NMT pipeline or MediKiosk Guide
        assert "Bhashini" in data.get("model", "") or "Groq" in data.get("model", "")

@pytest.mark.asyncio
async def test_gemini_medical_page_analysis_and_db_sync():
    """Validates that Gemini is dedicated to deep medical page analysis and saves structured data to the database"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Get sample patient
        async with AsyncSessionLocal() as session:
            q = await session.execute(select(Patient).join(User).where(User.email == "user1"))
            patient = q.scalars().first()
            assert patient is not None
            patient_id = str(patient.id)

        # 2. Trigger Gemini Medical Page Data Analysis
        res = await client.post(f"/api/patient/{patient_id}/analyze-medical-page")
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert data["databaseSynced"] is True
        assert "analysis" in data
        analysis = data["analysis"]
        assert "health_trajectory" in analysis
        assert "active_medications" in analysis
        assert "abnormal_biomarkers" in analysis
        assert "ayush_lifestyle_plan" in analysis
        assert "doctor_discussion_points" in analysis

        # 3. Retrieve pre-computed analysis instantly from database (<50ms)
        get_res = await client.get(f"/api/patient/{patient_id}/medical-analysis")
        assert get_res.status_code == 200
        get_data = get_res.json()
        assert get_data["hasAnalysis"] is True
        assert get_data["analysis"] is not None
        assert len(get_data["analysis"]["active_medications"]) > 0
