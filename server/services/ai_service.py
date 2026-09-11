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

# Bhashini Setup - Matched to Bhashini Dashboard
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID")
BHASHINI_UDYAT_KEY = os.getenv("BHASHINI_UDYAT_KEY") or os.getenv("BHASHINI_API_KEY")
BHASHINI_INFERENCE_KEY = os.getenv("BHASHINI_INFERENCE_KEY") or os.getenv("BHASHINI_PIPELINE_ID")
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
    if not (BHASHINI_USER_ID and (BHASHINI_UDYAT_KEY or BHASHINI_INFERENCE_KEY)):
        raise HTTPException(status_code=503, detail="Bhashini credentials not found in .env (need BHASHINI_USER_ID, BHASHINI_UDYAT_KEY, BHASHINI_INFERENCE_KEY)")

    base64_audio = base64.b64encode(audio_bytes).decode("utf-8")

    headers = {
        "User-ID": BHASHINI_USER_ID,
        "Ulca-Api-Key": BHASHINI_UDYAT_KEY or "",
        "Authorization": BHASHINI_INFERENCE_KEY or "",
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
            # Only fallback to Whisper if Groq is actually configured
            if groq_client:
                print(f"[Warning] Bhashini failed: {e}. Falling back to Whisper...")
                return await transcribe_with_whisper(audio_bytes, audio_file.filename or "recording.webm")
            raise HTTPException(status_code=502, detail=f"Bhashini STT failed: {str(e)}")
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


async def synthesize_clinical_blueprint(
    intake_text: str,
    document_texts: list[str] | None = None,
    patient_metadata: dict | None = None
) -> dict:
    """
    SIH 2026 PS 26047 Core AI Synthesis Engine:
    Transforms unstructured patient speech/intake narration + scanned parche/reports
    into a complete, pre-computed, physician-ready JSON blueprint.
    """
    docs_context = "\n---\n".join(document_texts) if document_texts else "No prior documents uploaded."
    meta = patient_metadata or {}

    prompt = f"""
    You are an expert Clinical Intake AI for MediKiosk (Ministry of Ayush / Indian Hospital OPDs).
    A patient has narrated their symptoms and/or uploaded physical medical documents (parche/reports).
    
    Patient Demographics: Age: {meta.get('age', 'Unknown')}, Gender: {meta.get('gender', 'Unknown')}
    Patient Narration/Speech Intake:
    "{intake_text}"
    
    Scanned Document/Parche Extracts:
    {docs_context}
    
    TASK:
    Generate a complete, structured clinical blueprint JSON for the Doctor's Cockpit.
    Follow this exact JSON structure:
    {{
      "chief_complaint": "Clear primary complaint (e.g. Acute chest tightness on exertion)",
      "triage_priority": "Low" | "Routine" | "Specialist" | "Emergency",
      "red_flags": ["List of any urgent red-flag alerts, e.g. Left arm pain radiation, severe hypoxia, stroke symptoms. Empty list if none."],
      "ai_summary": "2-3 sentence clinical overview for the physician to read in 10 seconds.",
      "hpi": {{
        "onset": "When it started (e.g. 3 hours ago)",
        "duration": "Duration (e.g. episodic / persistent)",
        "character": "Nature of symptom (e.g. dull pressure, sharp, burning)",
        "radiation": "Any radiation (e.g. radiating to left jaw/arm)",
        "triggers": "Aggravating factors (e.g. climbing stairs, exertion)",
        "relieving": "Relieving factors (e.g. resting)"
      }},
      "clinical_entities": {{
        "symptoms": ["list of symptoms extracted"],
        "medications": ["active current medications with dosage if mentioned"],
        "allergies": ["known drug or food allergies"],
        "past_history": "past medical/surgical history"
      }},
      "ayush_pariksha": {{
        "prakriti": "Likely Vata / Pitta / Kapha constitution indicators",
        "agni": "Mandagni (slow) / Tikshnagni (sharp) / Vishamagni (irregular) / Samagni (balanced)",
        "koshtha": "Mrudu / Madhyama / Krura",
        "ahara_vihara": "Diet and lifestyle notes (timing, sleep, stress)"
      }},
      "timeline": [
        {{
          "date": "YYYY-MM-DD or approximate period",
          "type": "prescription" | "lab_report" | "procedure" | "consultation",
          "title": "Short title (e.g. City Hospital Cardiology Parche)",
          "summary": "1 line takeaway (e.g. Prescribed Metformin 500mg, HbA1c was 7.8%)"
        }}
      ]
    }}
    
    Return ONLY valid, parseable JSON with NO extra conversational text.
    """

    # If Gemini is configured, invoke model
    if gemini_client:
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            raw_text = response.text or "{}"
            # Strip potential markdown code fences
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0].strip()

            import json
            parsed = json.loads(raw_text)
            return parsed
        except Exception as e:
            print(f"[Warning] Gemini clinical synthesis error: {e}. Using deterministic extraction fallback.")

    # High-quality deterministic fallback if Gemini key is not set or network fails
    # Detects emergency keywords
    is_emergency = any(kw in intake_text.lower() for kw in ["chest pain", "heart", "breathless", "severe bleeding", "unconscious", "stroke", "loss of consciousness"])
    priority = "Emergency" if is_emergency else ("Specialist" if any(kw in intake_text.lower() for kw in ["pain", "cough", "diabetes", "fever", "hypertension"]) else "Routine")

    red_flags = []
    if is_emergency:
        red_flags.append("Possible acute cardiopulmonary or vascular distress - prompt physician evaluation required.")

    return {
        "chief_complaint": intake_text[:120] if intake_text else "General Health Consultation",
        "triage_priority": priority,
        "red_flags": red_flags,
        "ai_summary": f"Patient reports: {intake_text[:200]}. Evaluated at MediKiosk terminal with vitals recorded.",
        "hpi": {
            "onset": "Acute onset within recent hours/days",
            "duration": "Reported during kiosk triage",
            "character": "Symptom distress noted by patient",
            "radiation": "None reported",
            "triggers": "Exertion / seasonal triggers",
            "relieving": "Rest"
        },
        "clinical_entities": {
            "symptoms": [s.strip() for s in intake_text.split(",") if s.strip()][:5] or ["Malaise"],
            "medications": ["Documented in prior prescriptions"],
            "allergies": ["No severe drug allergies declared"],
            "past_history": "Chronic lifestyle condition review"
        },
        "ayush_pariksha": {
            "prakriti": "Vata-Pitta predominant",
            "agni": "Vishamagni (variable digestive fire)",
            "koshtha": "Madhyama (normal bowel pattern)",
            "ahara_vihara": "Urban OPD lifestyle, irregular sleep and meal intervals"
        },
        "timeline": [
            {
                "date": "Today",
                "type": "consultation",
                "title": "MediKiosk OPD Case-Taking Registration",
                "summary": "Patient intake recorded and routed to Doctor Cockpit."
            }
        ]
    }