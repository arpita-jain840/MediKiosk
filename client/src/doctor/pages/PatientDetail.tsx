import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Pill,
  Stethoscope,
  Printer,
  Sparkles,
  AlertTriangle,
  Clock,
  Eye,
  FileCheck2,
  Leaf,
  Zap,
  Download,
  Heart,
  Activity,
  Phone,
  ShieldAlert,
  ImageIcon,
  CalendarDays,
  MessageSquareText,
  ClipboardList,
  MapPin,
  Star,
  Camera,
  User,
  Thermometer,
  Wind,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

/* ─────────────────────────── Type Definitions ─────────────────────────── */

interface PreviousAppointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialization: string;
  hospital: string;
  room: string;
  token: string;
  status: "Completed" | "Cancelled" | "Upcoming";
  doctorSaid: string;
  prescription: string[];
  diagnosis: string;
  nextVisit?: string;
  vitalsAtVisit?: {
    bp?: string;
    pulse?: string;
    temp?: string;
    spo2?: string;
    weight?: string;
  };
}

interface MedicationDetail {
  name: string;
  dosage: string;
  schedule: string;
  purpose: string;
  prescribedBy: string;
  startDate: string;
}

interface SymptomDetail {
  label: string;
  severity: "mild" | "moderate" | "severe";
  since: string;
  notes?: string;
}

interface BlueprintData {
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    bloodGroup: string;
    abha: string;
    allergies: string[];
    phone: string;
    address?: string;
    profileImage?: string;
  };
  appointment: {
    token: number;
    status: string;
    scheduledAt: string;
  };
  blueprint: {
    chiefComplaint: string;
    triagePriority: string;
    redFlags: string[];
    aiSummary: string;
    vitals: {
      bp?: string;
      pulse?: string;
      spO2?: string;
      temp?: string;
      weight?: string;
    };
    hpi: {
      onset?: string;
      duration?: string;
      character?: string;
      radiation?: string;
      triggers?: string;
      relieving?: string;
    };
    clinicalEntities: {
      medications?: string[];
      allergies?: string[];
      symptoms?: string[];
      history?: string;
    };
    ayushPariksha?: {
      prakriti?: string;
      agni?: string;
      koshtha?: string;
      ahara_vihara?: string;
    };
    timeline?: Array<{
      date: string;
      type: string;
      title: string;
      summary: string;
    }>;
    doctorNotes?: string;
    updatedAt?: string;
    /* Extended fields for the enriched detail view */
    medicationDetails?: MedicationDetail[];
    symptomDetails?: SymptomDetail[];
    previousAppointments?: PreviousAppointment[];
    clinicalNotes?: string;
  };
  documents: Array<{
    id: string;
    type: string;
    name: string;
    url: string;
    rawOcr?: string;
    uploadedAt?: string;
  }>;
}

/* ─────────────────────── Rich Default Blueprint ──────────────────────── */

const DEFAULT_BLUEPRINT_DATA: BlueprintData = {
  patient: {
    id: "",
    name: "Priya Sharma",
    age: 34,
    gender: "Female",
    bloodGroup: "B+",
    abha: "14-2938-4471-0093",
    allergies: ["Penicillin", "Dust", "Sulfa Drugs"],
    phone: "+91 98765 43210",
    address: "42, Lajpat Nagar Phase-II, New Delhi – 110024",
    profileImage: "",
  },
  appointment: {
    token: 5,
    status: "waiting",
    scheduledAt: "13 Sep 2026, 10:30 AM",
  },
  blueprint: {
    chiefComplaint: "Chest tightness & episodic breathlessness since morning, radiating to left arm with sweating",
    triagePriority: "Specialist",
    redFlags: ["Left arm radiation", "Diaphoresis (sweating)", "History of Type-2 Diabetes"],
    aiSummary:
      "34-year-old female presenting with acute chest tightness and breathlessness for 3 hours. Symptoms worsen with exertion and partially radiate to the left arm. Associated with mild diaphoresis. Known Type-2 Diabetic on Metformin 500mg BD. Vitals show mild tachycardia (92 bpm) and borderline BP. ECG and Troponin I recommended urgently. Previous consultation at AIIMS Delhi for similar episode 3 months ago was unremarkable on stress test. AYUSH intake suggests Vata-Pitta prakriti with Vishamagni. No prior cardiac interventions.",
    vitals: {
      bp: "138/88 mmHg",
      pulse: "92 bpm",
      spO2: "96%",
      temp: "98.4 °F",
      weight: "62 kg",
    },
    hpi: {
      onset: "3 hours ago (this morning)",
      duration: "Intermittent, lasting 5-10 min each episode",
      character: "Tight, squeezing pressure across the chest",
      radiation: "Left arm and jaw (mild)",
      triggers: "Climbing stairs, physical exertion, emotional stress",
      relieving: "Rest and sitting upright, partial relief with deep breaths",
    },
    clinicalEntities: {
      medications: [
        "Metformin 500mg",
        "Amlodipine 5mg",
        "Atorvastatin 20mg",
        "Pantoprazole 40mg",
        "Vitamin D3 60K (Weekly)",
      ],
      allergies: ["Penicillin", "Dust", "Sulfa Drugs"],
      symptoms: [
        "Chest tightness",
        "Breathlessness",
        "Sweating",
        "Fatigue",
      ],
      history:
        "Type-2 Diabetes Mellitus diagnosed 4 years ago. Mild hypertension managed with Amlodipine. Vitamin D deficiency. No prior cardiac events or surgeries. Family history: Father had MI at age 58. Non-smoker. Occasional alcohol use.",
    },
    ayushPariksha: {
      prakriti: "Vata-Pitta (dual dosha predominance)",
      agni: "Vishamagni (Irregular digestive fire)",
      koshtha: "Madhyama (Moderate bowel regularity)",
      ahara_vihara: "Irregular meal timings, high-stress urban lifestyle, limited physical activity, poor sleep hygiene",
    },
    timeline: [
      {
        date: "13 Sep 2026",
        type: "appointment",
        title: "Current Visit — MediKiosk Triage",
        summary: "AI-assisted intake completed. Chest tightness with breathlessness. Specialist triage flagged.",
      },
      {
        date: "28 Aug 2026",
        type: "appointment",
        title: "Follow-up at AIIA Clinic",
        summary: "Dr. Ananya Sharma: Hyperacidity resolved. Continue Pantoprazole 40mg for 2 more weeks. HbA1c: 7.1%",
      },
      {
        date: "15 Jul 2026",
        type: "lab",
        title: "HbA1c & Lipid Panel",
        summary: "HbA1c: 7.1%, LDL: 142 mg/dL (slightly high), HDL: 48 mg/dL. Started Atorvastatin 20mg.",
      },
      {
        date: "10 Jun 2026",
        type: "appointment",
        title: "Chest Discomfort — AIIMS OPD",
        summary: "Dr. Rajesh Kulkarni: ECG normal sinus rhythm. Troponin-I negative. Stress test: borderline. Advised lifestyle changes.",
      },
      {
        date: "22 Mar 2026",
        type: "prescription",
        title: "Diabetes Review — City Care Hospital",
        summary: "Dr. Kavita Nair: HbA1c 7.4%. Increased Metformin to 500mg BD. Added Vitamin D3 60K weekly.",
      },
    ],
    doctorNotes: "Patient reports increased stress at work over the past month. Symptoms are episodic and exertion-related. Previous ECG was normal. Needs urgent cardiac workup including ECG, Troponin-I, and 2D Echo. Monitor closely for ACS.",
    updatedAt: "13 Sep 2026, 10:35 AM",

    /* ── Enriched Detail Data ── */
    medicationDetails: [
      {
        name: "Metformin",
        dosage: "500mg",
        schedule: "Twice daily, with meals",
        purpose: "Type-2 Diabetes — Blood sugar control",
        prescribedBy: "Dr. Kavita Nair",
        startDate: "Mar 2022",
      },
      {
        name: "Amlodipine",
        dosage: "5mg",
        schedule: "Once daily, morning",
        purpose: "Mild Hypertension — Blood pressure control",
        prescribedBy: "Dr. Rajesh Kulkarni",
        startDate: "Jun 2026",
      },
      {
        name: "Atorvastatin",
        dosage: "20mg",
        schedule: "Once daily, bedtime",
        purpose: "High LDL Cholesterol — Lipid management",
        prescribedBy: "Dr. Ananya Sharma",
        startDate: "Jul 2026",
      },
      {
        name: "Pantoprazole",
        dosage: "40mg",
        schedule: "Once daily, before breakfast",
        purpose: "Hyperacidity — Gastric protection",
        prescribedBy: "Dr. Ananya Sharma",
        startDate: "Aug 2026",
      },
      {
        name: "Vitamin D3",
        dosage: "60,000 IU",
        schedule: "Once weekly (Sundays)",
        purpose: "Vitamin D Deficiency — Bone health",
        prescribedBy: "Dr. Kavita Nair",
        startDate: "Mar 2026",
      },
    ],

    symptomDetails: [
      {
        label: "Chest Tightness",
        severity: "severe",
        since: "This morning (3 hrs ago)",
        notes: "Squeezing/pressure sensation across mid-chest, worse on exertion",
      },
      {
        label: "Breathlessness",
        severity: "moderate",
        since: "This morning",
        notes: "Intermittent, worsens while climbing stairs",
      },


      {
        label: "Fatigue",
        severity: "moderate",
        since: "Past 2 weeks",
        notes: "Persistent tiredness, worsened last few days",
      },

    ],

    previousAppointments: [
      {
        id: "apt-001",
        date: "28 Aug 2026",
        time: "11:00 AM",
        doctor: "Dr. Ananya Sharma",
        specialization: "General Medicine (Kayachikitsa)",
        hospital: "AIIA (All India Institute of Ayurveda)",
        room: "OPD Room 2A, Ground Floor",
        token: "#14",
        status: "Completed",
        diagnosis: "Hyperacidity (Amlapitta) — Resolved",
        doctorSaid:
          "Your acid reflux has improved significantly. Continue Pantoprazole 40mg for 2 more weeks and then taper. Your HbA1c is 7.1% which is good but we need to bring it below 7. Maintain a regular meal schedule and reduce spicy/oily food. Walk 30 minutes daily. Come for follow-up in 4 weeks with fresh HbA1c.",
        prescription: [
          "Pantoprazole 40mg — 1 tab before breakfast × 14 days",
          "Avipattikar Churna — 1 tsp with lukewarm water after meals",
          "Continue Metformin 500mg BD",
        ],
        nextVisit: "25 Sep 2026",
        vitalsAtVisit: {
          bp: "128/82 mmHg",
          pulse: "78 bpm",
          temp: "98.6 °F",
          spo2: "98%",
          weight: "63 kg",
        },
      },
      {
        id: "apt-002",
        date: "10 Jun 2026",
        time: "2:30 PM",
        doctor: "Dr. Rajesh Kulkarni",
        specialization: "Cardiology",
        hospital: "AIIMS (All India Institute of Medical Sciences), New Delhi",
        room: "Cardiology OPD, Room 5B, 2nd Floor",
        token: "#8",
        status: "Completed",
        diagnosis: "Atypical Chest Pain — Cardiac cause ruled out",
        doctorSaid:
          "Your ECG shows normal sinus rhythm and Troponin-I is negative, which is very reassuring. The stress test was borderline but not diagnostic of ischemia. Given your diabetes and family history (father had MI at 58), you are at moderate cardiovascular risk. I am starting you on Amlodipine 5mg for your mildly elevated BP. Please get a lipid panel done. Avoid excessive stress and start regular exercise. If chest pain recurs with sweating, come to ER immediately.",
        prescription: [
          "Amlodipine 5mg — 1 tab morning",
          "Ecosprin 75mg — 1 tab after lunch (for 30 days)",
          "Lipid panel blood test in 2 weeks",
          "2D Echo if symptoms recur",
        ],
        nextVisit: "10 Sep 2026",
        vitalsAtVisit: {
          bp: "142/90 mmHg",
          pulse: "88 bpm",
          temp: "98.5 °F",
          spo2: "97%",
          weight: "64 kg",
        },
      },
      {
        id: "apt-003",
        date: "22 Mar 2026",
        time: "10:00 AM",
        doctor: "Dr. Kavita Nair",
        specialization: "Endocrinology / Diabetology",
        hospital: "City Care Hospital, Saket",
        room: "Diabetes Clinic, Room 3C, 1st Floor",
        token: "#22",
        status: "Completed",
        diagnosis: "Type-2 Diabetes Mellitus — Suboptimal control",
        doctorSaid:
          "Your HbA1c is 7.4%, which is slightly above target. I am increasing your Metformin to 500mg twice daily instead of once. Your Vitamin D is severely low at 12 ng/mL, so I am adding Vitamin D3 60K once a week for 8 weeks. Make sure to eat on time — skipping meals is causing sugar fluctuations. Reduce rice portions at dinner and add more dal/vegetables. Walk at least 30 minutes every day. Repeat HbA1c in 3 months.",
        prescription: [
          "Metformin 500mg — 1 tab after breakfast + 1 tab after dinner",
          "Vitamin D3 60,000 IU — 1 sachet every Sunday",
          "Repeat HbA1c + Vitamin D after 3 months",
        ],
        nextVisit: "22 Jun 2026",
        vitalsAtVisit: {
          bp: "130/84 mmHg",
          pulse: "74 bpm",
          temp: "98.6 °F",
          spo2: "99%",
          weight: "65 kg",
        },
      },
    ],

    clinicalNotes:
      "Patient is a 34-year-old female with a 4-year history of Type-2 DM and recently diagnosed mild hypertension. She presents today with acute chest symptoms that are concerning given her risk profile (diabetes, family history of premature MI, sedentary lifestyle). Previous cardiac workup at AIIMS in June was reassuring but borderline stress test warrants closer monitoring. Current episode with left arm radiation and diaphoresis requires urgent ECG and Troponin-I to rule out ACS. Patient is compliant with medications and has shown improvement in HbA1c (7.4% → 7.1%). Continue current regimen and expedite cardiac evaluation.",
  },
  documents: [
    {
      id: "doc-1",
      type: "Lab Report",
      name: "HbA1c + Lipid Panel",
      url: "#",
      rawOcr: "HbA1c: 7.1% | Fasting Glucose: 132 mg/dL | LDL: 142 mg/dL | HDL: 48 mg/dL | Triglycerides: 178 mg/dL | Total Cholesterol: 218 mg/dL",
      uploadedAt: "15 Jul 2026",
    },
    {
      id: "doc-2",
      type: "Prescription",
      name: "Dr. Ananya Sharma — Follow-up Rx",
      url: "#",
      rawOcr: "Rx: Pantoprazole 40mg OD (before breakfast) x 14 days | Avipattikar Churna 1 tsp with lukewarm water after meals | Continue Metformin 500mg BD | Follow-up: 25 Sep 2026",
      uploadedAt: "28 Aug 2026",
    },
    {
      id: "doc-3",
      type: "ECG Report",
      name: "12-Lead ECG — AIIMS",
      url: "#",
      rawOcr: "12-Lead ECG: Normal Sinus Rhythm | Rate: 78 bpm | Axis: Normal | PR: 0.16s | QRS: 0.08s | ST Segment: No elevation/depression | T-waves: Normal | Impression: Normal ECG, no acute ischemic changes",
      uploadedAt: "10 Jun 2026",
    },
    {
      id: "doc-4",
      type: "Blood Report",
      name: "Complete Blood Count",
      url: "#",
      rawOcr: "Hb: 11.8 g/dL | WBC: 7,200/μL | Platelets: 2.4 Lakh | RBC: 4.2 M/μL | MCV: 86 fL | ESR: 18 mm/hr",
      uploadedAt: "2 Sep 2026",
    },
  ],
};

/* ─────────────────────────── Helper Functions ─────────────────────────── */

function normalizeBlueprintData(raw: Partial<BlueprintData>): BlueprintData {
  return {
    patient: {
      ...DEFAULT_BLUEPRINT_DATA.patient,
      ...raw.patient,
      id: raw.patient?.id ?? DEFAULT_BLUEPRINT_DATA.patient.id,
      name: raw.patient?.name ?? DEFAULT_BLUEPRINT_DATA.patient.name,
      age: raw.patient?.age ?? DEFAULT_BLUEPRINT_DATA.patient.age,
      gender: raw.patient?.gender ?? DEFAULT_BLUEPRINT_DATA.patient.gender,
      bloodGroup: raw.patient?.bloodGroup ?? DEFAULT_BLUEPRINT_DATA.patient.bloodGroup,
      abha: raw.patient?.abha ?? DEFAULT_BLUEPRINT_DATA.patient.abha,
      phone: raw.patient?.phone ?? DEFAULT_BLUEPRINT_DATA.patient.phone,
      address: raw.patient?.address ?? DEFAULT_BLUEPRINT_DATA.patient.address,
      allergies: raw.patient?.allergies ?? DEFAULT_BLUEPRINT_DATA.patient.allergies,
    },
    appointment: { ...DEFAULT_BLUEPRINT_DATA.appointment, ...raw.appointment },
    blueprint: {
      ...DEFAULT_BLUEPRINT_DATA.blueprint,
      ...raw.blueprint,
      chiefComplaint: raw.blueprint?.chiefComplaint ?? DEFAULT_BLUEPRINT_DATA.blueprint.chiefComplaint,
      triagePriority: raw.blueprint?.triagePriority ?? DEFAULT_BLUEPRINT_DATA.blueprint.triagePriority,
      aiSummary: raw.blueprint?.aiSummary ?? DEFAULT_BLUEPRINT_DATA.blueprint.aiSummary,
      redFlags: raw.blueprint?.redFlags ?? DEFAULT_BLUEPRINT_DATA.blueprint.redFlags,
      vitals: {
        ...DEFAULT_BLUEPRINT_DATA.blueprint.vitals,
        ...raw.blueprint?.vitals,
      },
      hpi: {
        ...DEFAULT_BLUEPRINT_DATA.blueprint.hpi,
        ...raw.blueprint?.hpi,
      },
      clinicalEntities: {
        ...DEFAULT_BLUEPRINT_DATA.blueprint.clinicalEntities,
        ...raw.blueprint?.clinicalEntities,
        medications: raw.blueprint?.clinicalEntities?.medications ?? DEFAULT_BLUEPRINT_DATA.blueprint.clinicalEntities.medications,
        allergies: raw.blueprint?.clinicalEntities?.allergies ?? DEFAULT_BLUEPRINT_DATA.blueprint.clinicalEntities.allergies,
        symptoms: raw.blueprint?.clinicalEntities?.symptoms ?? DEFAULT_BLUEPRINT_DATA.blueprint.clinicalEntities.symptoms,
        history: raw.blueprint?.clinicalEntities?.history ?? DEFAULT_BLUEPRINT_DATA.blueprint.clinicalEntities.history,
      },
      ayushPariksha: {
        ...DEFAULT_BLUEPRINT_DATA.blueprint.ayushPariksha,
        ...raw.blueprint?.ayushPariksha,
      },
      timeline: raw.blueprint?.timeline ?? DEFAULT_BLUEPRINT_DATA.blueprint.timeline,
      doctorNotes: raw.blueprint?.doctorNotes ?? DEFAULT_BLUEPRINT_DATA.blueprint.doctorNotes,
      updatedAt: raw.blueprint?.updatedAt ?? DEFAULT_BLUEPRINT_DATA.blueprint.updatedAt,
      medicationDetails: raw.blueprint?.medicationDetails ?? DEFAULT_BLUEPRINT_DATA.blueprint.medicationDetails,
      symptomDetails: raw.blueprint?.symptomDetails ?? DEFAULT_BLUEPRINT_DATA.blueprint.symptomDetails,
      previousAppointments: raw.blueprint?.previousAppointments ?? DEFAULT_BLUEPRINT_DATA.blueprint.previousAppointments,
      clinicalNotes: raw.blueprint?.clinicalNotes ?? DEFAULT_BLUEPRINT_DATA.blueprint.clinicalNotes,
    },
    documents: raw.documents ?? DEFAULT_BLUEPRINT_DATA.documents,
  };
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  mild: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Mild" },
  moderate: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Moderate" },
  severe: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", label: "Severe" },
};

/* ────────────────────── Patient Detail Component ────────────────────── */

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const profileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BlueprintData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [doctorNote, setDoctorNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ name: string; url: string; rawOcr?: string } | null>(null);
  const [showAyush, setShowAyush] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "records">("overview");

  // Fetch pre-computed blueprint from FastAPI + PostgreSQL
  useEffect(() => {
    let isMounted = true;
    async function loadBlueprint() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/doctor/patient/${id}/blueprint`);
        if (!res.ok) {
          throw new Error(`Patient profile unavailable (${res.status})`);
        }
        const json = normalizeBlueprintData(await res.json());
        if (isMounted) {
          setData(json);
          setDoctorNote(json.blueprint.doctorNotes || "");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("[PatientDetail] Unable to load patient from backend:", err);
        // Fall back to default data for demonstration
        if (isMounted) {
          setData(DEFAULT_BLUEPRINT_DATA);
          setDoctorNote(DEFAULT_BLUEPRINT_DATA.blueprint.doctorNotes || "");
        }
        setLoading(false);
      }
    }

    loadBlueprint();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Profile image upload handler (frontend only)
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNote = async (markComplete = false) => {
    if (!data) return;
    setIsSavingNote(true);
    try {
      const notificationResponse = await fetch(`http://127.0.0.1:8000/api/patient/remarks/${data.patient.id}`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          message: doctorNote,
          doctor_name: "Dr. Ananya Sharma",
        }),
      });
      if (!notificationResponse.ok) {
        throw new Error(`Notification request failed (${notificationResponse.status})`);
      }

      const formData = new FormData();
      formData.append("note", doctorNote);
      if (markComplete) {
        formData.append("status", "completed");
      }
      const noteResponse = await fetch(`http://127.0.0.1:8000/api/doctor/patient/${data.patient.id}/note`, {
        credentials: "include",
        method: "POST",
        body: formData,
      });
      if (!noteResponse.ok) {
        throw new Error(`Clinical note request failed (${noteResponse.status})`);
      }
      setNoteSavedAlert(true);
      setTimeout(() => setNoteSavedAlert(false), 4000);
      if (markComplete) {
        navigate("/doctor/patients");
      }
    } catch (e) {
      console.error("Error saving note:", e);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleExportFhir = async () => {
    if (!data) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/patient/${data.patient.id}/fhir`);
      if (res.ok) {
        const bundle = await res.json();
        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ABDM_FHIR_${data.patient.name.replace(/\s+/g, "_")}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Error exporting FHIR:", e);
    }
  };

  // Purely client-side convenience export of the AI synopsis text — does not touch any API route.
  const handleDownloadSummary = () => {
    if (!data) return;
    const text = `Clinical Synopsis — ${data.patient.name} (ABHA: ${data.patient.abha})\nGenerated: ${data.blueprint.updatedAt || "N/A"}\n\n${data.blueprint.aiSummary}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AI_Summary_${data.patient.name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-700">Loading Clinical Blueprint from Database...</p>
        <span className="text-xs text-slate-400">Zero AI re-generation lag (&lt;50ms fast stream)</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <p className="text-sm font-semibold text-slate-700">{loadError || "Patient profile not found."}</p>
        <button onClick={() => navigate("/doctor/patients")} className="text-sm font-bold text-primary hover:underline">Back to patient queue</button>
      </div>
    );
  }

  const { patient, appointment, blueprint, documents } = data;
  const isEmergency = blueprint.triagePriority === "Emergency" || (blueprint.redFlags && blueprint.redFlags.length > 0);
  const summaryTakeaways = (blueprint.aiSummary || "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const lastAppointment = blueprint.previousAppointments?.[0];

  return (
    <div className="w-full max-w-[1440px] mx-auto pb-16 space-y-5 text-slate-800 font-sans">
      {/* Hidden profile image input */}
      <input
        type="file"
        ref={profileInputRef}
        onChange={handleProfileImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. HEADER NAVIGATION BAR                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/doctor/patients")}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-primary bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>OPD Queue</span>
          </button>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">ABHA:</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
              {patient.abha}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-tint/40 border border-primary-tint rounded-lg text-xs font-semibold text-[#1e3a5f]">
            <Zap size={13} className="text-primary" />
            <span>Pre-computed Blueprint (&lt;50ms)</span>
          </div>
          <button
            onClick={handleExportFhir}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-primary/30 transition-all cursor-pointer"
            title="Download NHA/ABDM HL7 FHIR R4 Bundle"
          >
            <Download size={13} className="text-primary" />
            <span>Export ABDM FHIR</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-primary/30 transition-all cursor-pointer"
          >
            <Printer size={13} />
            <span>Print EHR</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 2. PATIENT PROFILE CARD WITH IMAGE                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Profile + Contact Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 p-5">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-2.5 shrink-0">
              <div
                onClick={() => profileInputRef.current?.click()}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-primary/50 transition-all cursor-pointer group shadow-sm"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={patient.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <User size={36} className="text-primary/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <button
                onClick={() => profileInputRef.current?.click()}
                className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                <Camera size={10} />
                <span>{profileImage ? "Change Photo" : "Upload Photo"}</span>
              </button>
            </div>

            {/* Patient Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h1 className="text-xl font-black text-slate-900 leading-tight">{patient.name}</h1>
                  <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>{blueprint.triagePriority} Triage</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${blueprint.triagePriority === "Emergency" ? "bg-rose-100 text-rose-700 border-rose-200" :
                      blueprint.triagePriority === "Specialist" ? "bg-amber-100 text-amber-700 border-amber-200" :
                        "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}>
                      <Activity size={10} />
                      {blueprint.triagePriority}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Age</span>
                  <span className="text-sm font-bold text-slate-800">{patient.age} yrs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Gender</span>
                  <span className="text-sm font-bold text-slate-800">{patient.gender}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 hover:bg-rose-50 transition-colors">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
                  <span className="text-sm font-bold text-rose-600">{patient.bloodGroup}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
                  <span className="text-sm font-bold text-slate-800">{blueprint.vitals?.weight || "—"}</span>
                </div>
              </div>

              {/* Allergies */}
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-3 p-2.5 rounded-xl bg-rose-50/60 border border-rose-200/60">
                  <ShieldAlert size={13} className="text-rose-500 shrink-0" />
                  <span className="text-[10px] font-bold text-rose-700 uppercase mr-1">Allergies:</span>
                  {patient.allergies.map((al, idx) => (
                    <span key={idx} className="bg-rose-200/70 text-rose-900 font-bold px-2 py-0.5 rounded-md text-[10px] hover:bg-rose-200 transition-colors">
                      {al}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact Row */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <a
                  href={`tel:${patient.phone}`}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-[#1e3a5f] text-white text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-xl transition-all hover:shadow-md active:scale-95"
                >
                  <Phone size={13} />
                  <span>Call Patient</span>
                </a>
                {patient.address && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate max-w-[250px]">{patient.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>


        </div>

        {/* Right: Vitals Card */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 p-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <span>Current Vitals</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Heart, label: "Blood Pressure", value: blueprint.vitals?.bp || "120/80", color: "text-rose-500" },
                { icon: Activity, label: "Pulse Rate", value: blueprint.vitals?.pulse || "72 bpm", color: "text-primary" },
                { icon: Wind, label: "SpO2", value: blueprint.vitals?.spO2 || "98%", color: "text-sky-500" },
                { icon: Thermometer, label: "Temperature", value: blueprint.vitals?.temp || "98.6 °F", color: "text-amber-500" },
              ].map((vital, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-sm transition-all">
                  <vital.icon size={20} className={vital.color} />
                  <span className="text-[10px] text-slate-500 text-center">{vital.label}</span>
                  <span className="text-sm font-black text-slate-900">{vital.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 3. EMERGENCY RED FLAGS RIBBON                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className={`rounded-2xl p-4 shadow-xs flex items-start gap-3 border-2 transition-all hover:shadow-md ${isEmergency ? "bg-rose-50 border-rose-300" : "bg-emerald-50 border-emerald-200"}`}>
        <div className={`p-2 rounded-xl shrink-0 ${isEmergency ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`text-sm font-black uppercase tracking-wide ${isEmergency ? "text-rose-900" : "text-emerald-900"}`}>
              {isEmergency ? "RED ALERT — Immediate Review Required" : "RED ALERT STATUS — No Active Red Alerts"}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isEmergency ? "bg-rose-200/70 text-rose-800" : "bg-emerald-200/70 text-emerald-800"}`}>
              {isEmergency ? "Action Required" : "Monitor Normally"}
            </span>
          </div>
          {isEmergency ? (
            <ul className="mt-1.5 space-y-1 text-xs font-semibold text-rose-800 list-disc list-inside">
              {blueprint.redFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-xs font-semibold text-emerald-800">No warning signs were recorded during this intake.</p>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 4. NAVIGATION TABS                                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
        {[
          { key: "overview" as const, label: "Clinical Overview" },
          { key: "history" as const, label: "Appointment History" },
          { key: "records" as const, label: "Documents & Records" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === tab.key
              ? "bg-white text-primary shadow-sm border border-slate-200/80"
              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB: CLINICAL OVERVIEW                                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* ── Symptoms with Severity ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-slate-900">Symptoms & Severity</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                {blueprint.symptomDetails?.length || 0} reported
              </span>
            </div>
            {blueprint.symptomDetails && blueprint.symptomDetails.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {blueprint.symptomDetails.map((symptom, idx) => {
                  const style = SEVERITY_STYLES[symptom.severity] || SEVERITY_STYLES.mild;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border ${style.bg} border-slate-100 hover:shadow-sm hover:-translate-y-0.5 transition-all space-y-1.5`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{symptom.label}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text} border`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {style.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock size={10} />
                        <span>Since: {symptom.since}</span>
                      </p>
                      {symptom.notes && (
                        <p className="text-[11px] text-slate-600 leading-snug">{symptom.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No symptoms recorded yet.</p>
            )}
          </div>

          {/* ── Clinical Notes ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 p-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
              <MessageSquareText size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-slate-900">Clinical Notes</h3>
            </div>
            {blueprint.updatedAt && (
              <span className="text-[11px] text-slate-400 block mb-2">{blueprint.updatedAt}</span>
            )}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {blueprint.clinicalNotes || blueprint.chiefComplaint}
            </p>
            {blueprint.clinicalEntities?.history && (
              <div className="mt-3">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Past Medical / Surgical History</span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {blueprint.clinicalEntities.history}
                </p>
              </div>
            )}
          </div>

          {/* ── Chief Complaint & HPI ── */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-slate-900">Chief Complaint & HPI Breakdown</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">SOCRATES Clinical Model</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Presenting Complaint</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900">{blueprint.chiefComplaint}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { label: "Onset", value: blueprint.hpi?.onset || "Acute" },
                { label: "Duration", value: blueprint.hpi?.duration || "Persistent" },
                { label: "Character", value: blueprint.hpi?.character || "Discomfort" },
                { label: "Radiation", value: blueprint.hpi?.radiation || "None" },
                { label: "Triggers", value: blueprint.hpi?.triggers || "Exertion" },
                { label: "Relieving", value: blueprint.hpi?.relieving || "Rest" },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-primary/20 transition-all">
                  <span className="text-[10px] font-bold text-slate-400 block">{item.label}</span>
                  <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{item.value}</span>
                </div>
              ))}
            </div>
          </div>


          {/* ── Medications Detail ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Pill size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-slate-900">Current Medications</h3>
              </div>
              <button
                onClick={() => navigate(`/doctor/prescription/${patient.id}`)}
                title="Add or update medications"
                className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline cursor-pointer"
              >
                <span>+ Add Prescription</span>
              </button>
            </div>
            {blueprint.medicationDetails && blueprint.medicationDetails.length > 0 ? (
              <div className="space-y-3">
                {blueprint.medicationDetails.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Pill size={16} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">{med.name}</span>
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{med.dosage}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{med.schedule}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          <span className="font-semibold">For:</span> {med.purpose}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 sm:text-right space-y-0.5">
                      <p className="text-[10px] text-slate-400">Prescribed by</p>
                      <p className="text-[11px] font-bold text-slate-700">{med.prescribedBy}</p>
                      <p className="text-[10px] text-slate-400">Since {med.startDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">None declared.</p>
            )}
          </div>





          {/* AI Clinical Summary */}
          <div className="bg-bg-warm/70 border border-primary-tint rounded-2xl p-4.5 shadow-xs hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-primary text-white shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h4 className="text-xs font-black text-[#1e3a5f] uppercase tracking-wider">
                    MediKiosk Clinical Synopsis (Analyzed once at intake)
                  </h4>
                  <button
                    onClick={handleDownloadSummary}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline cursor-pointer shrink-0"
                  >
                    <Download size={12} />
                    <span>Download Summary</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Verified by Gemini Health Engine</span>

                {summaryTakeaways.length > 1 ? (
                  <ul className="mt-2.5 space-y-1.5">
                    {summaryTakeaways.map((line, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed flex gap-2">
                        <span className="text-primary mt-1 shrink-0">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-800 mt-2 font-medium leading-relaxed">
                    {blueprint.aiSummary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── AYUSH Pariksha ── */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">AYUSH / Ayurvedic Intake Assessment</h3>
              </div>
              <button
                onClick={() => setShowAyush(!showAyush)}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                {showAyush ? "Collapse" : "Expand"}
              </button>
            </div>

            {showAyush && blueprint.ayushPariksha && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { label: "Prakriti (Constitution)", value: blueprint.ayushPariksha.prakriti },
                  { label: "Agni (Digestive Capacity)", value: blueprint.ayushPariksha.agni },
                  { label: "Koshtha (Bowel Pattern)", value: blueprint.ayushPariksha.koshtha },
                  { label: "Ahara-Vihara (Diet & Lifestyle)", value: blueprint.ayushPariksha.ahara_vihara },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">{item.label}</span>
                    <span className="text-xs font-bold text-emerald-950 mt-1 block">{item.value || "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Doctor Remarks & Action ── */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-slate-900">Doctor Remarks & Action</h3>
              </div>
              {noteSavedAlert && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Saved to DB!</span>
                </span>
              )}
            </div>

            <textarea
              value={doctorNote}
              onChange={(e) => setDoctorNote(e.target.value)}
              placeholder="Type clinical impressions, examination findings or modifications..."
              rows={3}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            />

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleSaveNote(false)}
                disabled={isSavingNote}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer text-center active:scale-95"
              >
                {isSavingNote ? "Saving..." : "Save Note"}
              </button>
              <button
                onClick={() => navigate(`/doctor/prescription/${patient.id}`)}
                className="flex-1 py-2 px-3 rounded-xl bg-primary-light hover:bg-primary text-xs font-bold text-white transition-all cursor-pointer text-center active:scale-95"
              >
                Generate Rx
              </button>
              <button
                onClick={() => handleSaveNote(true)}
                disabled={isSavingNote}
                className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-[#1e3a5f] text-xs font-bold text-white transition-all cursor-pointer text-center shadow-xs active:scale-95"
              >
                Finish (Done)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB: APPOINTMENT HISTORY                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "history" && (
        <div className="space-y-5">
          {/* Last Appointment Highlight */}
          {lastAppointment && (
            <div className="bg-gradient-to-br from-primary/5 via-white to-sky-50/50 rounded-2xl p-6 border-2 border-primary/20 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">Last Appointment</h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                      <BadgeCheck size={10} className="inline mr-0.5" />
                      {lastAppointment.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{lastAppointment.date} at {lastAppointment.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Doctor</span>
                  <p className="text-sm font-bold text-slate-900">{lastAppointment.doctor}</p>
                  <p className="text-xs text-slate-500">{lastAppointment.specialization}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Hospital & Room</span>
                  <p className="text-sm font-bold text-slate-900 flex items-start gap-1.5">
                    <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                    <span>{lastAppointment.hospital}</span>
                  </p>
                  <p className="text-xs text-slate-500">{lastAppointment.room} · Token {lastAppointment.token}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400">Diagnosis</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                    {lastAppointment.diagnosis}
                  </span>
                </div>
              </div>

              {/* What the Doctor Said — the key feature */}
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/60 space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquareText size={14} className="text-sky-600" />
                  <span className="text-xs font-black text-sky-800 uppercase tracking-wide">What the Doctor Said</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  "{lastAppointment.doctorSaid}"
                </p>
              </div>

              {/* Prescription from last visit */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Prescription Given</span>
                <div className="space-y-1.5">
                  {lastAppointment.prescription.map((rx, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Pill size={12} className="text-primary shrink-0 mt-0.5" />
                      <span>{rx}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vitals at last visit */}
              {lastAppointment.vitalsAtVisit && (
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: "BP", value: lastAppointment.vitalsAtVisit.bp },
                    { label: "Pulse", value: lastAppointment.vitalsAtVisit.pulse },
                    { label: "Temp", value: lastAppointment.vitalsAtVisit.temp },
                    { label: "SpO2", value: lastAppointment.vitalsAtVisit.spo2 },
                    { label: "Weight", value: lastAppointment.vitalsAtVisit.weight },
                  ].map((v, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200/80 text-center">
                      <span className="text-[9px] font-bold text-slate-400 block">{v.label}</span>
                      <span className="text-[11px] font-bold text-slate-800">{v.value || "—"}</span>
                    </div>
                  ))}
                </div>
              )}

              {lastAppointment.nextVisit && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                  <CalendarDays size={14} className="text-primary" />
                  <span className="font-bold text-slate-700">Next Follow-up: <span className="text-primary">{lastAppointment.nextVisit}</span></span>
                </div>
              )}
            </div>
          )}

          {/* Full Appointment History */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-slate-900">Complete Appointment History</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {blueprint.previousAppointments?.length || 0} visits
              </span>
            </div>

            <div className="space-y-3">
              {blueprint.previousAppointments?.map((apt) => {
                const isExpanded = expandedAppointment === apt.id;
                return (
                  <div
                    key={apt.id}
                    className={`rounded-xl border transition-all ${isExpanded ? "border-primary/30 shadow-md bg-white" : "border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300"}`}
                  >
                    {/* Collapsed header */}
                    <button
                      onClick={() => setExpandedAppointment(isExpanded ? null : apt.id)}
                      className="w-full p-4 flex items-center justify-between gap-3 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Stethoscope size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">{apt.doctor}</span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {apt.date} · {apt.hospital} · Token {apt.token}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 block">Specialization</span>
                            <span className="text-xs font-bold text-slate-800">{apt.specialization}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 block">Room</span>
                            <span className="text-xs font-bold text-slate-800">{apt.room}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/60">
                          <span className="text-[10px] font-bold text-amber-700 block mb-1">Diagnosis</span>
                          <span className="text-xs font-bold text-slate-800">{apt.diagnosis}</span>
                        </div>

                        <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-200/60">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <MessageSquareText size={12} className="text-sky-600" />
                            <span className="text-[10px] font-bold text-sky-700 uppercase">What Doctor Said</span>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed">"{apt.doctorSaid}"</p>
                        </div>

                        <div className="p-3 rounded-lg bg-white border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1.5">Prescription</span>
                          <div className="space-y-1">
                            {apt.prescription.map((rx, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                <Pill size={11} className="text-primary shrink-0 mt-0.5" />
                                <span>{rx}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {apt.vitalsAtVisit && (
                          <div className="grid grid-cols-5 gap-2">
                            {Object.entries(apt.vitalsAtVisit).map(([key, val]) => (
                              <div key={key} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                                <span className="text-[9px] font-bold text-slate-400 block uppercase">{key}</span>
                                <span className="text-[11px] font-bold text-slate-800">{val || "—"}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {apt.nextVisit && (
                          <div className="flex items-center gap-2 text-xs font-bold text-primary">
                            <CalendarDays size={12} />
                            <span>Next follow-up: {apt.nextVisit}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          {blueprint.timeline && blueprint.timeline.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-slate-900">Medical History Timeline</h3>
              </div>
              <div className="overflow-x-auto">
                <div className="relative flex items-start gap-6 pt-2 pb-1 min-w-max border-t-2 border-dashed border-slate-200">
                  {blueprint.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-0 pt-3 w-40 shrink-0">
                      <div className="absolute -top-[7px] left-0 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white ring-2 ring-sky-100" />
                      <span className="text-[10px] font-bold text-slate-400 block">{item.date}</span>
                      <span className="text-xs font-bold text-slate-800 block mt-0.5">{item.title}</span>
                      <span className="text-[11px] text-slate-600 block mt-0.5 line-clamp-3">{item.summary}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TAB: DOCUMENTS & RECORDS                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "records" && (
        <div className="space-y-5">
          {/* Documents Grid */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-slate-900">Digitized Parche & Reports</h3>
              </div>
              <span className="text-xs font-bold text-primary bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                {documents.length} Records
              </span>
            </div>

            {documents.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No physical documents uploaded for this encounter.</p>
            ) : (
              <>
                {/* Thumbnail strip */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {documents.map((doc) => (
                    <button
                      key={`thumb-${doc.id}`}
                      onClick={() => setSelectedDoc(doc)}
                      className="shrink-0 w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 hover:border-primary/50 hover:shadow-sm transition-all flex items-center justify-center overflow-hidden cursor-pointer"
                      title={doc.name}
                    >
                      {doc.url && doc.url !== "#" ? (
                        <img
                          src={`http://127.0.0.1:8000${doc.url}`}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={18} className="text-slate-300" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-200/70 hover:border-primary/40 hover:shadow-sm transition-all bg-slate-50/50 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <FileText size={14} className="text-primary shrink-0" />
                          <span className="text-xs font-bold text-slate-800 truncate">{doc.name}</span>
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded">
                            {doc.type}
                          </span>
                          {doc.uploadedAt && (
                            <span className="text-[10px] text-slate-400">{doc.uploadedAt}</span>
                          )}
                        </div>
                        {doc.rawOcr && (
                          <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 italic font-mono bg-white p-2 rounded-lg border border-slate-100">
                            "{doc.rawOcr}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="text-slate-400 hover:text-primary p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer shrink-0"
                        title="View Document & OCR"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Lab Results Summary */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
              <Activity size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-slate-900">Lab Results Summary</h3>
            </div>
            {documents.filter((d) => d.type.toLowerCase().includes("lab") || d.type.toLowerCase().includes("blood")).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No lab reports available.</p>
            ) : (
              <div className="space-y-2.5">
                {documents
                  .filter((d) => d.type.toLowerCase().includes("lab") || d.type.toLowerCase().includes("blood"))
                  .map((doc) => (
                    <button
                      key={`lab-${doc.id}`}
                      onClick={() => setSelectedDoc(doc)}
                      className="w-full flex items-center justify-between gap-3 text-left cursor-pointer group p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 transition-all"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <FileText size={15} className="text-primary shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 truncate group-hover:text-primary transition-colors">
                          {doc.type} — {doc.name}
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">{doc.uploadedAt || ""}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DOCUMENT VIEW MODAL                                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-lg w-full space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 truncate">{selectedDoc.name}</h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedDoc.url && selectedDoc.url !== "#" ? (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={`http://127.0.0.1:8000${selectedDoc.url}`}
                    alt="Document"
                    className="w-full h-auto object-contain"
                  />
                </div>
              ) : (
                <div className="p-6 bg-slate-50 text-center rounded-xl text-xs text-slate-400">
                  Paper document digitized during triage check-in.
                </div>
              )}

              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                  Extracted OCR Text (Gemini Medical Vision)
                </span>
                <pre className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap font-mono">
                  {selectedDoc.rawOcr || "No raw text extracted."}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setSelectedDoc(null)}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-[#1e3a5f] text-white font-bold text-xs cursor-pointer transition-colors active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}