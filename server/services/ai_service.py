import os
from fastapi import UploadFile, HTTPException
from groq import Groq
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None
gemini_api_key = os.getenv("GEMINI_API_KEY")
gemini_client = genai.Client(api_key=gemini_api_key) if gemini_api_key else None


async def transcribe_audio(audio_file: UploadFile) -> str:
    try:
        audio_bytes = await audio_file.read()
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")

        fille_payload = (audio_file.filename or "recording.webm", audio_bytes)

        if not client:
            raise HTTPException(status_code=500, detail="Audio transcription service is not available.")

        transcription = client.audio.transcriptions.create(
            file=fille_payload,
            model="whisper-large-v3",
            response_format="json",
            temperature=0.0,
        )

        recognized_text = transcription.text.strip()
        return recognized_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during audio transcription: {str(e)}")

async def process_user_text(user_id: str, text: str, session_id: str | None = None) -> str:
    clean_text = text.strip()
    processed_reply = f"'Template':Processed text for user {user_id}: {clean_text}"
    return processed_reply

# for imaege wala part 

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