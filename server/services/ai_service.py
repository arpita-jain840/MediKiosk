import os
from fastapi import UploadFile, HTTPException
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None


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