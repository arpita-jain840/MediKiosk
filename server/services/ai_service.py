import os
import base64
import httpx
from fastapi import UploadFile, HTTPException
from groq import Groq
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

STT_PROVIDER = os.getenv("STT_PROVIDER", "whisper").lower()

#Groq Setup
api_key = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=api_key) if api_key else None

#Gemini Setup
gemini_api_key = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=gemini_api_key) if gemini_api_key else None

#Bhashini Setup
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID")
BHASHINI_API_KEY = os.getenv("BHASHINI_API_KEY")
BHASHINI_PIPELINE_ID = os.getenv("BHASHINI_PIPELINE_ID")
BHASHINI_BASE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"

MAX_FILE_SIZE_MB = 10

#Text pipeline
async def process_user_text(user_id: str, text: str, session_id: str | None = None) -> str:
    clean_text = text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Input text is empty or invalid.")
    
    processed_reply = f"'Template':Processed text for user {user_id}: {clean_text}"
    return processed_reply


async def transcribe_with_whisper(audio_bytes: bytes, filename: str) -> str:
    """Fast Hindi/English STT using Groq Whisper"""
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq Audio transcription service is not configured.")

    file_payload = (filename or "recording.webm", audio_bytes)

    transcription = groq_client.audio.transcriptions.create(
        file=file_payload,
        model="whisper-large-v3",
        response_format="json",
        temperature=0.0,
    )
    return transcription.text.strip()


async def transcribe_with_bhashini(audio_bytes: bytes, source_lang: str = "hi") -> str:
    """Indic Regional ASR via Bhashini"""
    if not (BHASHINI_USER_ID and BHASHINI_API_KEY):
        raise HTTPException(status_code=503, detail="Bhashini credentials not found. Check .env")

    base64_audio = base64.b64encode(audio_bytes).decode("utf-8")

    headers = {
        "User-ID": BHASHINI_USER_ID,
        "Ulca-Api-Key": BHASHINI_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "pipelineTasks": [
            {
                "taskType": "asr",
                "config": {
                    "language": {"sourceLanguage": source_lang}
                }
            }
        ],
        "inputData": {
            "audio": [{"audioContent": base64_audio}]
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(BHASHINI_BASE_URL, headers=headers, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Bhashini error: {response.text}")

        data = response.json()
        return data["pipelineResponse"][0]["output"][0]["source"].strip()


async def process_voice_intake(audio_file: UploadFile, preferred_lang: str = "hi") -> str:
    """Unified Voice Gateway with automatic fallback"""
    audio_bytes = await audio_file.read()
    
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")

    # Size check (10MB limit)
    if (len(audio_bytes) / (1024 * 1024)) > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail=f"Audio file exceeds {MAX_FILE_SIZE_MB}MB limit.")

    if STT_PROVIDER == "bhashini":
        try:
            return await transcribe_with_bhashini(audio_bytes, source_lang=preferred_lang)
        except Exception as e:
            # Fallback to Whisper if Bhashini is down or unauthorized
            print(f"[Warning] Bhashini failed: {e}. Falling back to Whisper...")
            return await transcribe_with_whisper(audio_bytes, audio_file.filename or "recording.webm")
    else:
        return await transcribe_with_whisper(audio_bytes, audio_file.filename or "recording.webm")
# for image wala part 

async def process_medical_image(image_file: UploadFile) -> str:
    try:
        image_bytes = await image_file.read()

        if len(image_bytes) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image file is empty."
            )

        if not image_file.content_type or not image_file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a valid image file."
            )

        if not gemini_client:
            raise HTTPException(
                status_code=500,
                detail="Gemini Vision service is not available."
            )

        prompt = """
        Analyze this medical image/document carefully.

        1. Identify the type of document/image if possible.
        2. Read only text that is clearly visible.
        3. If it is a prescription or medical report, summarize the visible information.
        4. If handwriting, medicine names, dosage, dates, or other text is unclear,
           clearly say that it is unclear.
        5. Do not guess or invent any information.
        6. Do not provide a definitive diagnosis.
        7. Mention that important medical information should be reviewed
           by a qualified healthcare professional.
        """

        response = gemini_client.models.generate_content(
            model="gemini-3.8-flash",
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=image_file.content_type
                ),
                prompt
            ]
        )

        return response.text or "Gemini returned no response."

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during medical image processing: {str(e)}"
        )