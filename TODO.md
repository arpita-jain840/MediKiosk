# MediKiosk — System Progress & Roadmap (TODO)

> **Core Objective:** Eliminate the 2–5 minute OPD clinical history bottleneck in Indian hospitals by capturing patient history (voice/photo) at a digital kiosk, synthesizing a 1-page **Clinical Blueprint** via Gemini 2.5 Flash, and loading it on the Doctor's screen in **<50ms**.

---

## 🏛️ The 4 Core Architectural Tasks

```
[Patient Ingestion]          [AI Blueprint Engine]         [Doctor Cockpit]            [Patient Portal]
Mic / Camera (Raw Data)  --> Gemini 2.5 Flash (Synthesize) --> 1-Page Summary (<50ms) --> Token, Room & Voice Guide
      │                               │                           │                               │
      ▼                               ▼                           │                               │
Table: raw_records           Table: clinical_blueprints                               | │                                      │
(Neon PostgreSQL)            (Neon PostgreSQL JSONB)                     ▼                           ▼
                                                         Doctor reviews & signs      Patient views live token
```

---

## ✅ What We Did (Completed Deliverables)

### 1. User Ingestion (Patient Side)
- [x] **Dual Voice Gateway:** Implemented both Groq Whisper (`whisper-large-v3`) and Bhashini Indic ASR for multilingual speech-to-text intake in [`server/services/ai_service.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/services/ai_service.py).
- [x] **Document & Parche Ingestion:** Built upload endpoint `POST /api/patient/upload-document` in [`server/routers/clinical_routes.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/routers/clinical_routes.py) allowing patients to upload physical paper prescriptions, discharge slips, and lab reports.
- [x] **Multimodal Medical OCR:** Integrated Gemini Vision model to extract legible clinical text from messy handwritten prescriptions and lab reports.
- [x] **Raw Records Database Layer (`raw_records`):** Mapped and configured the `raw_records` table in [`server/models.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/models.py) (aliased with `PatientDocument` / `RawRecord`) ensuring unadulterated preservation of uploaded files, OCR transcripts, and timestamps.
- [x] **Touch & Voice UI:** Built [`client/src/user/screens/IntakeScreen.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/user/screens/IntakeScreen.tsx) with audio playback (Bhashini TTS) and guided conversation.

### 2. AI Analysis & Blueprint Engine (The Brain)
- [x] **Gemini 2.5 Flash Synthesis:** Created `synthesize_clinical_blueprint(...)` in [`server/services/ai_service.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/services/ai_service.py) that accepts patient narration + scanned documents + demographics to output a standardized JSON blueprint.
- [x] **Standardized JSON Schema:**
  - `chief_complaint` (Primary reason for visit)
  - `triage_priority` (`Routine` | `Specialist` | `Emergency`)
  - `red_flags` (Critical clinical alerts, e.g., radiating chest tightness, hypoxia)
  - `hpi` (onset, duration, character, radiation, triggers, relieving)
  - `clinical_entities` (active medications, allergies, symptoms, past history)
  - `ayush_pariksha` (*Prakriti*, *Agni*, *Koshtha*, *Ahara-Vihara* lifestyle factors for AYUSH / AIIA OPDs)
  - `timeline` (Chronological sequence of past encounters & lab results)
- [x] **One-Time AI Committal Endpoint:** Created `POST /api/clinical/generate-blueprint` in [`server/routers/clinical_routes.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/routers/clinical_routes.py) to synthesize once and persist into the database.
- [x] **Clinical Blueprint Database Layer (`clinical_blueprints`):** Mapped and configured `clinical_blueprints` table in [`server/models.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/models.py) (aliased with `PatientClinicalProfile` / `ClinicalBlueprint`) storing pre-computed JSONB for lightning-fast reads.

### 3. Doctor Consultation Screen (Desktop View)
- [x] **Sub-50ms Fast Fetch Endpoint:** Created `GET /api/doctor/patient/{patient_id}/blueprint` to retrieve the pre-computed blueprint directly from the database without any LLM re-computation latency.
- [x] **1-Page Clinical Cockpit UI:** Built [`client/src/doctor/pages/PatientDetail.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/doctor/pages/PatientDetail.tsx):
  - Prominent Red-Flag Emergency Banner.
  - Vitals strip (BP, Pulse, SpO2, Temp, Weight).
  - Chief Complaint & HPI Breakdown.
  - Active Medications & Scanned Documents Drawer.
  - AYUSH Pariksha diagnostic tab.
- [x] **1-Click Review & Sign:** Integrated `POST /api/doctor/patient/{patient_id}/note` allowing doctors to add clinical notes, confirm Rx, and mark consultations as completed.
- [x] **Doctor Queue Dashboard:** Developed [`client/src/doctor/pages/Dashboard.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/doctor/pages/Dashboard.tsx) and [`Appointments.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/doctor/pages/Appointments.tsx) for triage queue management.

### 4. Patient Portal (Mobile View)
- [x] **Health Assessment & Token Screen:** Built [`client/src/user/screens/ResultScreen.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/user/screens/ResultScreen.tsx) displaying:
  - Live OPD Token badge (e.g., `Token #5`).
  - Allocated OPD Room & Doctor (e.g., `Room 4B · Dr. John Smith`).
  - Patient-friendly health summary and triage urgency level.
- [x] **Continuous Hands-Free Multilingual Voice Assistant:** Implemented [`client/src/user/screens/AIAssistantScreen.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/user/screens/AIAssistantScreen.tsx) and [`server/routers/clinical_routes.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/routers/clinical_routes.py):
  - **Conversational Continuous Talk Mode:** Keeps listening hands-free after each turn without turning off.
  - **Auto-Speech Playback (TTS):** Automatically speaks the AI reply aloud using speech synthesis and Bhashini TTS.
  - **Automatic Mic Re-Arming:** When speech finishes speaking, the microphone automatically opens back up for seamless back-and-forth talking.
  - **Model Transparency:** Powered by **Google Gemini 3.6 Flash** (`POST /api/assistant/chat`) with Groq (`Qwen 3.6 27B`) and local hospital guide engine fallbacks.
- [x] **Bhashini NMT Translation:** Added translation across 11 Indic languages in [`server/routers/bhashini_routes.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/routers/bhashini_routes.py).

---

### 5. Live Synchronization & Advanced Handshake (Newly Completed)
- [x] **Live Token & Room WebSocket Broadcast:** Built [`server/routers/websocket_routes.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/routers/websocket_routes.py) with `/ws/queue` and integrated into [`server/routers/clinical_routes.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/routers/clinical_routes.py) so advancing the queue (`POST /api/doctor/queue/advance`) pushes live real-time notifications to waiting patients.
- [x] **QR Code Handshake Integration:**
  - Patient App: Renders interactive, scannable QR Code on [`client/src/user/screens/ResultScreen.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/user/screens/ResultScreen.tsx) with consultation payload.
  - Doctor Desktop: Added `Scan Patient QR` button and camera/manual scanner modal [`client/src/doctor/components/QRScanModal.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/doctor/components/QRScanModal.tsx) on [`Navbar.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/doctor/components/Navbar.tsx) that loads the patient blueprint in <50ms.
- [x] **ABDM FHIR R4 Bundle Generator (M2 / M3):** Built [`server/services/fhir_service.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/services/fhir_service.py) exporting official HL7 FHIR R4 document bundles (`GET /api/patient/{id}/fhir`) with download buttons on both Doctor Cockpit and Patient slip.
- [x] **Pluggable Cloud Storage Service:** Created [`server/services/storage_service.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/services/storage_service.py) abstracting file uploads for local disk and S3/R2/GCS cloud buckets.
- [x] **DPDP Act 2023 Ephemeral Kiosk Session Guard:** Created [`client/src/user/components/KioskSessionGuard.tsx`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/client/src/user/components/KioskSessionGuard.tsx) providing automated countdown & teardown after inactivity to protect health privacy on public hardware.
- [x] **Automated End-to-End Test Suite:** Created [`server/tests/test_e2e_pipeline.py`](file:///c:/Users/tusha/Desktop/MediKiosk/MediKiosk/server/tests/test_e2e_pipeline.py) validating the complete journey (login $\rightarrow$ book appointment $\rightarrow$ raw records upload $\rightarrow$ blueprint synthesis $\rightarrow$ <50ms doctor load $\rightarrow$ FHIR export $\rightarrow$ WebSocket broadcast) with all tests passing!

---

## 📌 Remaining Production Milestones

### Sandbox & Physical Hardware
- [ ] **Live ABDM Sandbox API Keys:** Connecting real Aadhaar/Mobile OTP with the official NHA ABDM Sandbox environment.
- [ ] **Hospital Hardware Kiosk Shell:** Packaging the frontend into an Electron or Chromium kiosk wrapper with touch lock mode.


---

## 🗄️ Database Schema Reference (Neon PostgreSQL)

| Table Name | Model Class | Purpose |
| :--- | :--- | :--- |
| **`users`** | `User` | Doctor & Patient authentication and profile credentials |
| **`patients`** | `Patient` | Demographic information, ABHA ID, blood group, emergency contact |
| **`doctors`** | `Doctor` | Doctor credentials, room number, hospital name, specialization |
| **`appointments`** | `Appointment` | Queue management, token numbers, status (`waiting`, `in_consultation`, `completed`) |
| **`raw_records`** | `RawRecord` (`PatientDocument`) | Untampered patient uploads, paper prescriptions, lab reports, raw OCR transcripts |
| **`clinical_blueprints`** | `ClinicalBlueprint` (`PatientClinicalProfile`) | Pre-computed JSONB clinical blueprint for <50ms Doctor Cockpit load |

---

## 🔑 Active Database Accounts & Clean State

*All appointments, raw records, and blueprints are currently **0** rows. They will be generated interactively via the UI.*

| Role | Username / Email | Password | Full Name / Details |
| :--- | :--- | :--- | :--- |
| **Doctor** | `admindoc` | `admindoc` | Dr. Admin Doc (Cardiology & Gen Med, Room 4B) |
| **Patient 1** | `user1` | `user1123` | Priya Sharma (ABHA: `14-2938-4471-0093`, B+) |
| **Patient 2** | `user2` | `user2123` | Emma Watson (ABHA: `14-9824-3321-0012`, O+) |
| **Patient 3** | `user3` | `user3123` | Rajesh Kumar (ABHA: `14-5582-7719-0104`, AB+) |
| **Patient 4** | `user4` | `user4123` | Sarah Hosten (ABHA: `14-4412-8823-0101`, A+) |
| **Patient 5** | `user5` | `user5123` | Vikram Malhotra (ABHA: `14-1182-6632-0108`, O+) |
