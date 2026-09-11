from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services import ai_service

router = APIRouter(prefix="/api/bhashini", tags=["Bhashini Indic AI"])

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "en"
    target_lang: str = "hi"

class TranslateResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str

class TTSRequest(BaseModel):
    text: str
    lang: str = "hi"
    gender: str = "female"

class TTSResponse(BaseModel):
    audio_base64: Optional[str]
    mime: str = "audio/wav"

SUPPORTED_LANGUAGES = [
    {"code": "en", "name": "English", "native": "English"},
    {"code": "hi", "name": "Hindi", "native": "हिन्दी"},
    {"code": "bn", "name": "Bengali", "native": "বাংলা"},
    {"code": "ta", "name": "Tamil", "native": "தமிழ்"},
    {"code": "te", "name": "Telugu", "native": "తెలుగు"},
    {"code": "mr", "name": "Marathi", "native": "मराठी"},
    {"code": "gu", "name": "Gujarati", "native": "ગુજરાતી"},
    {"code": "kn", "name": "Kannada", "native": "ಕನ್ನಡ"},
    {"code": "ml", "name": "Malayalam", "native": "മലയാളം"},
    {"code": "pa", "name": "Punjabi", "native": "ਪੰਜਾਬੀ"},
    {"code": "or", "name": "Odia", "native": "ଓଡ଼ିଆ"},
]

@router.get("/languages")
async def get_supported_languages():
    """Returns all 11 Indic languages supported by Bhashini AI"""
    return SUPPORTED_LANGUAGES

@router.post("/translate", response_model=TranslateResponse)
async def translate_text(payload: TranslateRequest):
    """Translates text across languages using Bhashini NMT"""
    result = await ai_service.translate_with_bhashini(
        text=payload.text,
        source_lang=payload.source_lang,
        target_lang=payload.target_lang
    )
    return TranslateResponse(
        translated_text=result,
        source_lang=payload.source_lang,
        target_lang=payload.target_lang
    )

@router.post("/tts", response_model=TTSResponse)
async def text_to_speech(payload: TTSRequest):
    """Synthesizes speech audio for low-literacy accessibility via Bhashini TTS"""
    audio_b64 = await ai_service.tts_with_bhashini(
        text=payload.text,
        lang=payload.lang,
        gender=payload.gender
    )
    return TTSResponse(audio_base64=audio_b64, mime="audio/wav")
