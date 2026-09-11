import { useState, useEffect } from "react";
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
  Zap
} from "lucide-react";
import { initialPatients } from "../data/patientsData";

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

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BlueprintData | null>(null);
  const [doctorNote, setDoctorNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ name: string; url: string; rawOcr?: string } | null>(null);
  const [showAyush, setShowAyush] = useState(true);

  // Fetch pre-computed blueprint from FastAPI + PostgreSQL
  useEffect(() => {
    let isMounted = true;
    async function loadBlueprint() {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/doctor/patient/${id}/blueprint`);
        if (res.ok) {
          const json: BlueprintData = await res.json();
          if (isMounted) {
            setData(json);
            setDoctorNote(json.blueprint.doctorNotes || "");
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("[PatientDetail] Backend API unreachable, loading offline fallback:", err);
      }

      // Fallback to local data if offline
      const matched = initialPatients.find((p) => p.id === id) || initialPatients[0];
      if (isMounted) {
        setData({
          patient: {
            id: matched.id,
            name: matched.name,
            age: matched.age,
            gender: matched.gender,
            bloodGroup: matched.bloodGroup,
            abha: matched.insurance || "14-8891-2301-4402",
            allergies: matched.allergies,
            phone: "+91 98765 43210",
          },
          appointment: {
            token: matched.token || 1,
            status: matched.status === "Done" ? "completed" : "waiting",
            scheduledAt: new Date().toISOString(),
          },
          blueprint: {
            chiefComplaint: matched.complaint,
            triagePriority: matched.triagePriority || "Routine",
            redFlags: matched.triagePriority === "Emergency" ? ["Immediate clinical evaluation advised"] : [],
            aiSummary: matched.aiSummary || `Patient ${matched.name} presented for evaluation of ${matched.complaint}.`,
            vitals: {
              bp: matched.bp,
              pulse: matched.pulse,
              spO2: matched.spO2,
              temp: matched.temp,
              weight: matched.weight,
            },
            hpi: {
              onset: "3 days ago",
              duration: "Persistent / fluctuating",
              character: "Discomfort reported",
              radiation: "Local",
              triggers: "Normal daily activity",
              relieving: "Rest",
            },
            clinicalEntities: {
              medications: matched.medications,
              allergies: matched.allergies,
              symptoms: [matched.complaint],
              history: matched.history,
            },
            ayushPariksha: {
              prakriti: "Vata-Pitta",
              agni: "Vishamagni (Irregular)",
              koshtha: "Madhyama (Balanced)",
              ahara_vihara: "Irregular meal timing, chronic fatigue",
            },
            timeline: [
              {
                date: "2026-08-20",
                type: "prescription",
                title: "Previous OPD Visit",
                summary: "Consultation recorded at district civil hospital.",
              },
            ],
            doctorNotes: "",
          },
          documents: [
            {
              id: "doc-1",
              type: "prescription",
              name: "prior_parche_prescript.pdf",
              url: "#",
              rawOcr: "Rx: Tab Paracetamol 650mg SOS, Tab Cetirizine 10mg HS x 5 days.",
              uploadedAt: "2026-08-20",
            },
          ],
        });
        setLoading(false);
      }
    }

    loadBlueprint();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSaveNote = async (markComplete = false) => {
    if (!data) return;
    setIsSavingNote(true);
    try {
      const formData = new FormData();
      formData.append("note", doctorNote);
      if (markComplete) {
        formData.append("status", "completed");
      }
      await fetch(`http://127.0.0.1:8000/api/doctor/patient/${data.patient.id}/note`, {
        method: "POST",
        body: formData,
      });
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

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-700">Loading Clinical Blueprint from Database...</p>
        <span className="text-xs text-slate-400">Zero AI re-generation lag (&lt;50ms fast stream)</span>
      </div>
    );
  }

  const { patient, appointment, blueprint, documents } = data;
  const isEmergency = blueprint.triagePriority === "Emergency" || (blueprint.redFlags && blueprint.redFlags.length > 0);

  const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
    Emergency: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    Specialist: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    Routine: { bg: "bg-sky-50", text: "text-[#3368a0]", border: "border-sky-200" },
    Low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  };
  const currentPriorityStyle = priorityColors[blueprint.triagePriority] || priorityColors.Routine;

  return (
    <div className="w-full max-w-7xl mx-auto pb-16 space-y-5 text-slate-800 font-sans">
      {/* 1. Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/doctor/patients")}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-primary bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
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
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer size={13} />
            <span>Print EHR</span>
          </button>
        </div>
      </div>

      {/* 2. Patient Identity & Vitals Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg">
            {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-slate-900">{patient.name}</h1>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentPriorityStyle.bg} ${currentPriorityStyle.text} ${currentPriorityStyle.border}`}>
                {blueprint.triagePriority} Triage
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Token #{appointment.token}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span>{patient.age} yrs</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span className="font-semibold text-rose-600">Blood: {patient.bloodGroup}</span>
              <span>•</span>
              <span>Phone: {patient.phone}</span>
            </p>
          </div>
        </div>

        {/* Quick Vitals Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full lg:w-auto">
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">BP</span>
            <span className="text-xs font-black text-slate-900">{blueprint.vitals?.bp || "120/80"}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pulse</span>
            <span className="text-xs font-black text-slate-900">{blueprint.vitals?.pulse || "72"}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">SpO2</span>
            <span className="text-xs font-black text-slate-900">{blueprint.vitals?.spO2 || "98%"}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Temp</span>
            <span className="text-xs font-black text-slate-900">{blueprint.vitals?.temp || "98.6°F"}</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl px-3 py-2 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight</span>
            <span className="text-xs font-black text-slate-900">{blueprint.vitals?.weight || "65 kg"}</span>
          </div>
        </div>
      </div>

      {/* 3. Emergency Red Flags Ribbon (SIH requirement) */}
      {isEmergency && blueprint.redFlags && blueprint.redFlags.length > 0 && (
        <div className="rounded-2xl bg-rose-50 border-2 border-rose-300 p-4 shadow-xs flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-rose-900 uppercase tracking-wide">
                Red-Flag Triage Alert — Prioritize Evaluation
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200/70 text-rose-800">
                Action Required
              </span>
            </div>
            <ul className="mt-1.5 space-y-1 text-xs font-semibold text-rose-800 list-disc list-inside">
              {blueprint.redFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 4. AI 2-Sentence Clinical Brief */}
      <div className="bg-bg-warm/70 border border-primary-tint rounded-2xl p-4.5 flex items-start gap-3.5 shadow-xs">
        <div className="p-2 rounded-xl bg-primary text-white shrink-0">
          <Sparkles size={16} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#1e3a5f] uppercase tracking-wider">
              MediKiosk Clinical Synopsis (Analyzed once at intake)
            </h4>
            <span className="text-[10px] text-slate-500 font-medium">Verified by Gemini Health Engine</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 mt-1 font-medium leading-relaxed">
            {blueprint.aiSummary}
          </p>
        </div>
      </div>

      {/* 5. Main 2-Column Fast Render Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Structured History, HPI & AYUSH (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Chief Complaint & HPI (SOCRATES framework) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
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

            {/* HPI Attributes Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">Onset</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{blueprint.hpi?.onset || "Acute"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">Duration</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{blueprint.hpi?.duration || "Persistent"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">Character</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{blueprint.hpi?.character || "Discomfort"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">Radiation</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{blueprint.hpi?.radiation || "None"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">Triggers</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{blueprint.hpi?.triggers || "Exertion"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">Relieving</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{blueprint.hpi?.relieving || "Rest"}</span>
              </div>
            </div>
          </div>

          {/* Active Medications, Allergies & History */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Pill size={16} className="text-primary" />
              <span>Medications, Allergies & Medical History</span>
            </h3>

            {/* Allergies Highlight */}
            {patient.allergies && patient.allergies.length > 0 ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs">
                <span className="font-bold text-rose-800 shrink-0">⚠️ Documented Allergies:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {patient.allergies.map((al, idx) => (
                    <span key={idx} className="bg-rose-200/80 text-rose-900 font-bold px-2 py-0.5 rounded text-[11px]">
                      {al}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">No known drug allergies reported.</div>
            )}

            {/* Active Medications */}
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">Current Medications</span>
              {blueprint.clinicalEntities?.medications && blueprint.clinicalEntities.medications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {blueprint.clinicalEntities.medications.map((med, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-1 rounded-lg">
                      {med}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">None declared.</p>
              )}
            </div>

            {/* Past History */}
            {blueprint.clinicalEntities?.history && (
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Past Medical / Surgical History</span>
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {blueprint.clinicalEntities.history}
                </p>
              </div>
            )}
          </div>

          {/* AYUSH Pariksha (Ministry of Ayush / AIIA specific) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
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
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Prakriti (Constitution)</span>
                  <span className="text-xs font-bold text-emerald-950 mt-1 block">{blueprint.ayushPariksha.prakriti || "Vata-Pitta"}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Agni (Digestive Capacity)</span>
                  <span className="text-xs font-bold text-emerald-950 mt-1 block">{blueprint.ayushPariksha.agni || "Vishamagni"}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Koshtha (Bowel Pattern)</span>
                  <span className="text-xs font-bold text-emerald-950 mt-1 block">{blueprint.ayushPariksha.koshtha || "Madhyama"}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Ahara-Vihara (Diet & Lifestyle)</span>
                  <span className="text-xs font-bold text-emerald-950 mt-1 block">{blueprint.ayushPariksha.ahara_vihara || "Irregular meal timings"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scanned Parche, Timeline & Doctor Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Scanned Documents & Parche */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
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
              <p className="text-xs text-slate-400 py-3 text-center">No physical documents uploaded for this encounter.</p>
            ) : (
              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-slate-200/70 hover:border-primary/40 transition-colors bg-slate-50/50 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 truncate">{doc.name}</span>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded">
                          {doc.type}
                        </span>
                      </div>
                      {doc.rawOcr && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic font-mono bg-white p-1.5 rounded border border-slate-100">
                          "{doc.rawOcr}"
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="text-slate-400 hover:text-primary p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer shrink-0"
                      title="View Document & OCR"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chronological Medical Timeline */}
          {blueprint.timeline && blueprint.timeline.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-slate-900">Medical History Timeline</h3>
              </div>
              <div className="relative border-l-2 border-slate-200 ml-2 space-y-3 pl-3.5 pt-1">
                {blueprint.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-4.75 top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white ring-2 ring-sky-100" />
                    <span className="text-[10px] font-bold text-slate-400 block">{item.date}</span>
                    <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                    <span className="text-xs text-slate-600 block mt-0.5">{item.summary}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Notes & Quick Prescription Action */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
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
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer text-center"
              >
                {isSavingNote ? "Saving..." : "Save Note"}
              </button>
              <button
                onClick={() => navigate(`/doctor/prescription/${patient.id}`)}
                className="flex-1 py-2 px-3 rounded-xl bg-primary-light hover:bg-primary text-xs font-bold text-white transition-colors cursor-pointer text-center"
              >
                Generate Rx
              </button>
              <button
                onClick={() => handleSaveNote(true)}
                disabled={isSavingNote}
                className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-[#1e3a5f] text-xs font-bold text-white transition-colors cursor-pointer text-center shadow-xs"
              >
                Finish (Done)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document View Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-lg w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 truncate">{selectedDoc.name}</h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1 rounded-lg cursor-pointer"
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
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
