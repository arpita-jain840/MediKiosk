from fastapi import APIRouter, UploadFile, File, Form, Depends, Header, HTTPException
from schemas.ingest_schema import TextIngestRequest, TextIngestResponse
from services.ai_service import (
    transcribe_audio,
    process_user_text,
    process_medical_image
)
from typing import Optional

router = APIRouter(prefix="/ingest", tags=["Ingest"])

async def get_current_user(authorization: str = Header(default="Bearer dummy-token-123")) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token header")
    return f"user_{authorization.split(' ')[1]}"

#PIPE 1: Text Ingest
@router.post("/text", response_model=TextIngestResponse)
async def ingest_text(
    payload: TextIngestRequest,
    current_user: str = Depends(get_current_user)
):
    reply_text = await process_user_text(
        user_id=current_user,
        text=payload.text,
        session_id=payload.session_id
    )

    return TextIngestResponse(
        status="success",
        session_id=payload.session_id,
        reply=reply_text
    )

#PIPE 2: Voice Ingest
@router.post("/voice", response_model=TextIngestResponse)
async def ingest_voice(
    file: UploadFile = File(..., description="Audio file to be transcribed"),
    session_id: Optional[str] = Form(None, description="Optional session ID for context"),
    current_user: str = Depends(get_current_user)
):
    #voice to text
    transcription = await transcribe_audio(file)

    repy_text = await process_user_text(
        user_id = current_user,
        text=transcription,
        session_id=session_id
    )

    return TextIngestResponse(
        status="success",
        session_id=session_id,
        reply=f"Transcription: '{transcription}' | Reply: {repy_text}"
        )
# PIPE 3: Image Ingest
@router.post("/image", response_model=TextIngestResponse)
async def ingest_image(
    file: UploadFile = File(..., description="Medical image/document"),
    session_id: Optional[str] = Form(None),
    current_user: str = Depends(get_current_user)
):
    # Image ko Gemini Vision se process karna
    reply_text = await process_medical_image(file)

    return TextIngestResponse(
        status="success",
        session_id=session_id,
        reply=reply_text
    )
