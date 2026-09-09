import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  QrCode,
  CheckCircle2,
  Heart,
  Activity,
  Droplet,
  Thermometer,
  Scale,
  FileText,
  Pill,
  Stethoscope,
  ChevronDown,
  Printer,
  Plus,
  MoreVertical,
  MessageSquare,
  Sparkles,
  Brain,
  RefreshCw,
  Tag,
  ShieldCheck
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { initialPatients } from "../data/patientsData";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find matching patient or fallback
  const matched = initialPatients.find((p) => p.id === id) || initialPatients[0];

  const [openVisit, setOpenVisit] = useState(0);
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [showAiDiff, setShowAiDiff] = useState(true);
  
  // AI-Driven Chief Problems & Symptoms State
  const [aiProblemsList, setAiProblemsList] = useState([
    {
      id: "ai-1",
      date: "06/01/2026",
      source: "MediKiosk AI Voice & Symptom Intake",
      confidence: "96% AI Confidence",
      severity: "Moderate",
      text: "Patient having severe sinusitis about two to three months ago with facial discomfort, nasal congestion, eye pain, and postnasal drip symptoms.\n\nProbable environmental inhalant allergies, probable food allergies, and history of asthma.",
      tags: [
        { label: "Severe Sinusitis", type: "primary" },
        { label: "Facial Discomfort", type: "symptom" },
        { label: "Nasal Congestion", type: "symptom" },
        { label: "Eye Pain", type: "symptom" },
        { label: "Postnasal Drip", type: "symptom" },
        { label: "Inhalant Allergies", type: "history" },
        { label: "Asthma History", type: "history" },
      ],
      aiSuggestions: [
        "Primary Suspect: Chronic Allergic Rhinosinusitis with secondary ocular irritation.",
        "Consider CT Paranasal Sinus review & IgE panel correlation before systemic steroids.",
        "Prescription interaction check passed for Clarinex + Acular."
      ]
    }
  ]);

  // Mock patient profile data matching the grid screenshot
  const patient = {
    name: matched?.name || "John Smith",
    tag: "Allergy & Pulmonology",
    dob: "03/13/1998",
    age: matched?.age ? `${matched.age}y 4m` : "22y 4m",
    weight: matched?.weight || "168 lb",
    height: "5' 9''",
    bloodGroup: matched?.bloodGroup || "O+",
    id: matched?.id || "MDX-2024-0567",
    homeAddress: "123 Broadway, New York, NY, 10012",
    mobilePhone: "917 (543)-1234",
    homePhone: "212 (123)-1234",
    workPhone: "718 (702)-9876",
    email: "j.smith@gmail.com",
    avatar: matched?.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    lastVisit: "Apr 4, 2026"
  };

  const vitals = [
    { label: "Blood Pressure", value: matched?.bp.split(" ")[0] || "121/75", unit: "mmHg", icon: Heart, status: "normal" },
    { label: "Pulse", value: matched?.pulse.split(" ")[0] || "67", unit: "BPM", icon: Activity, status: "normal" },
    { label: "Blood Sugar", value: "142", unit: "mg/dL", icon: Droplet, status: "watch" },
    { label: "Temperature", value: matched?.temp || "98.6 °F", unit: "", icon: Thermometer, status: "normal" },
    { label: "Weight / BMI", value: matched?.weight || "68 kg", unit: "BMI 24.1", icon: Scale, status: "normal" },
  ];

  const medications = [
    { name: "Desloratadine (Clarinex)", dose: "5mg · once daily", forCondition: "Allergic Rhinitis" },
    { name: "Ketorolac (Acular, Acuvail)", dose: "0.5% · 1 drop 4x daily", forCondition: "Ocular Inflammation" },
    { name: "Azelastine (Astelin, Astepro)", dose: "1-2 sprays · twice daily", forCondition: "Nasal Symptoms" },
  ];

  const labResults = [
    { name: `X-Ray - ${patient.name}`, date: "06/01/2026", type: "Radiology" },
    { name: "Allergen-specific IgE Panel", date: "05/31/2026", type: "Immunology" },
    { name: "Nasal Endoscopy Report", date: "05/31/2026", type: "ENT" },
    { name: `CT Sinus - ${patient.name}`, date: "05/29/2026", type: "Imaging" },
  ];

  const sugarTrend = [
    { visit: "Nov", value: 158 },
    { visit: "Dec", value: 151 },
    { visit: "Jan", value: 149 },
    { visit: "Feb", value: 146 },
    { visit: "Mar", value: 144 },
    { visit: "Apr", value: 142 },
  ];

  const visits = [
    {
      date: "Apr 4, 2026",
      doctor: "Dr. Emily Carter",
      specialty: "Pulmonologist",
      diagnosis: "Seasonal bronchitis & allergic rhinitis",
      notes:
        "Persistent cough and mild fever for 4 days. Prescribed a 5-day course of azithromycin and a steam inhalation routine. Advised follow-up if symptoms continue past a week.",
    },
    {
      date: "Feb 18, 2026",
      doctor: "Dr. John Smith",
      specialty: "Cardiologist",
      diagnosis: "Vitals & BP review",
      notes:
        "Blood pressure trending stable on current dosage. Continue routine monitoring twice a week at home.",
    },
    {
      date: "Dec 2, 2025",
      doctor: "Dr. Sana Reyes",
      specialty: "Endocrinologist",
      diagnosis: "Preventive metabolic panel",
      notes:
        "Glucose trending down nicely. Diet is on track — encouraged to keep current low-sodium meal plan.",
    },
  ];

  const handleAddProblem = () => {
    if (!newNote.trim()) return;
    setAiProblemsList([
      {
        id: `ai-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US'),
        source: "Doctor Clinical Input · AI Correlated",
        confidence: "98% Clinical Match",
        severity: "Follow-up",
        text: newNote.trim(),
        tags: [
          { label: "Clinical Note", type: "primary" },
          { label: "Active Review", type: "symptom" }
        ],
        aiSuggestions: [
          "Correlated with existing allergy history and vital sign trends.",
          "Updated into patient active differential summary."
        ]
      },
      ...aiProblemsList
    ]);
    setNewNote("");
    setShowNoteInput(false);
  };

  const handleReanalyzeAi = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiProblemsList([
        {
          id: `ai-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US'),
          source: "MediKiosk AI Real-Time Triage Engine",
          confidence: "99% High Accuracy",
          severity: "Moderate - Watchlist",
          text: `AI Re-Assessment for ${patient.name}:\nPatient presents with recurrent seasonal sinusitis flare-ups with marked facial tenderness and mucosal congestion. High correlation with environmental allergens and asthma comorbidities. Vitals (BP ${patient ? vitals[0].value : '121/75'}) remain stable.`,
          tags: [
            { label: "Recurrent Sinusitis", type: "primary" },
            { label: "Facial Tenderness", type: "symptom" },
            { label: "Mucosal Congestion", type: "symptom" },
            { label: "Allergic Rhinitis Comorbidity", type: "history" },
            { label: "Asthma Watchlist", type: "history" }
          ],
          aiSuggestions: [
            "Maintain current antihistamine therapy (Desloratadine 5mg).",
            "Evaluate response to ocular NSAID drops (Ketorolac).",
            "Recommended follow-up in 14 days if nasal congestion persists."
          ]
        },
        ...aiProblemsList
      ]);
    }, 900);
  };

  return (
    <div className="w-full text-slate-800 pb-16 space-y-6">
      {/* Clean Top Navigation Bar with working Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-full shadow-xs transition-all cursor-pointer group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900">{patient.name}</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-black">
              {patient.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
          >
            <Printer size={14} />
            <span>Print EHR</span>
          </button>

          <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full shadow-xs">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Live Synced</span>
          </span>
        </div>
      </div>

      {/* QR Scan Confirmation Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-indigo-50/90 border border-indigo-100 px-5 py-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <QrCode size={18} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-indigo-950">
                <span>QR Scanned Successfully</span> — Patient EHR & Vitals transferred instantly from Desk #04.
              </p>
              <p className="text-[11px] text-indigo-600/80 font-medium">
                Encrypted HIPAA data payload verified · Station ID: MK-KIOSK-04
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-white/80 px-2.5 py-1 rounded-full border border-indigo-100">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Live Synced
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* GRID SECTION MATCHING USER'S SCREENSHOT                   */}
        {/* 2 Main Columns: Left (Profile & Notes) | Right (Meds, Vitals, Labs) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT COLUMN (7 Cols) ================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Card 1: Patient Profile Card (Matching Screenshot Top-Left) */}
            <div className="rounded-[2rem] bg-white p-6 sm:p-7 border border-slate-100 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                {/* Left Mini Column: Avatar & Basic Stats */}
                <div className="sm:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left sm:border-r border-slate-100 sm:pr-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-md mb-3 relative">
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                    {patient.name}
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 mb-4 block">
                    {patient.tag}
                  </span>

                  {/* DOB & Age Row */}
                  <div className="w-full grid grid-cols-2 gap-2 text-left mb-3">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">DOB</span>
                      <span className="text-xs font-bold text-slate-700">{patient.dob}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</span>
                      <span className="text-xs font-bold text-slate-700">{patient.age}</span>
                    </div>
                  </div>

                  {/* Weight & Height Row */}
                  <div className="w-full grid grid-cols-2 gap-2 text-left mb-5">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weight</span>
                      <span className="text-xs font-bold text-slate-700">{patient.weight}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Height</span>
                      <span className="text-xs font-bold text-slate-700">{patient.height}</span>
                    </div>
                  </div>

                  {/* Send Message Button (Teal style from screenshot) */}
                  <button 
                    onClick={() => alert(`Message composer opened for ${patient.name}`)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0097a7] hover:bg-[#00838f] text-white text-xs font-black tracking-wider uppercase shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Send Message</span>
                  </button>
                </div>

                {/* Right Mini Column: Contact Details */}
                <div className="sm:col-span-7 flex flex-col justify-between gap-3 text-left pl-0 sm:pl-2">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Home Address
                    </span>
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">
                      {patient.homeAddress}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Mobile Phone #
                    </span>
                    <p className="text-xs font-bold text-slate-700">{patient.mobilePhone}</p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Home Phone #
                    </span>
                    <p className="text-xs font-bold text-slate-700">{patient.homePhone}</p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Work Phone #
                    </span>
                    <p className="text-xs font-bold text-slate-700">{patient.workPhone}</p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Email
                    </span>
                    <p className="text-xs font-bold text-[#0097a7] hover:underline cursor-pointer">
                      {patient.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: AI-Driven Clinical Problems & Symptoms (Matching Screenshot Bottom-Left with AI Intelligence) */}
            <div className="rounded-[2rem] bg-white p-6 border border-slate-100 shadow-xs flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-bold text-slate-800">Notes & Problems Faced</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200/60 text-[#0097a7] text-[10px] font-extrabold tracking-wide uppercase shadow-2xs">
                    <Sparkles size={11} className="text-[#0097a7] animate-pulse" />
                    AI-Driven
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReanalyzeAi}
                    disabled={isAiAnalyzing}
                    title="Re-run AI Symptom & Differential Analysis"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50/80 hover:bg-teal-100/80 text-[#0097a7] text-xs font-bold transition-all cursor-pointer border border-teal-100 disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={isAiAnalyzing ? "animate-spin" : ""} />
                    <span>{isAiAnalyzing ? "Analyzing..." : "Re-Analyze AI"}</span>
                  </button>

                  <button 
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    title="Add new clinical observation or symptom"
                    className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 text-[#0097a7] flex items-center justify-center transition-colors cursor-pointer border border-slate-200/60"
                  >
                    <Plus size={15} />
                  </button>

                  <button className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* AI Triage Banner */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-50/60 via-indigo-50/40 to-slate-50 border border-teal-100/60 text-xs">
                <div className="flex items-center gap-2">
                  <Brain size={14} className="text-[#0097a7] shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-700">
                    AI Symptom Extraction: Patient intake synchronized from Kiosk check-in
                  </span>
                </div>
                <button
                  onClick={() => setShowAiDiff(!showAiDiff)}
                  className="text-[10px] font-bold text-[#0097a7] hover:underline cursor-pointer ml-2 shrink-0"
                >
                  {showAiDiff ? "Hide AI Insights" : "Show AI Insights"}
                </button>
              </div>

              {/* Add Note / Symptom Input Area */}
              {showNoteInput && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col gap-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                      <Tag size={12} className="text-[#0097a7]" />
                      Add Clinical Problem / Note (AI Correlated)
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">Doctor Observation</span>
                  </div>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter patient complaints, symptom severity, or clinical assessment..."
                    rows={3}
                    className="w-full text-xs p-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0097a7] placeholder:text-slate-400"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowNoteInput(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddProblem}
                      className="px-4 py-1.5 bg-[#0097a7] hover:bg-[#00838f] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
                    >
                      Save & Correlate
                    </button>
                  </div>
                </div>
              )}

              {/* AI Extracted Problems & Notes Content */}
              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                {aiProblemsList.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-teal-100 transition-colors"
                  >
                    {/* Header with Date & AI Source tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400">{item.date}</span>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100/80">
                          {item.source}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                        {item.confidence}
                      </span>
                    </div>

                    {/* Problem Narrative (Matches screenshot text) */}
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                      {item.text}
                    </p>

                    {/* AI Problem Tags / Symptom Breakdown */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                              tag.type === "primary"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : tag.type === "symptom"
                                ? "bg-teal-50 text-teal-800 border-teal-100"
                                : "bg-indigo-50 text-indigo-800 border-indigo-100"
                            }`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* AI Differential Insights & Suggestions */}
                    {showAiDiff && item.aiSuggestions && item.aiSuggestions.length > 0 && (
                      <div className="mt-1 pt-2.5 border-t border-slate-200/60 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                          <ShieldCheck size={12} className="text-indigo-600" />
                          <span>AI Clinical Suggestions</span>
                        </div>
                        <ul className="space-y-1 pl-1">
                          {item.aiSuggestions.map((sug, sIdx) => (
                            <li key={sIdx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                              <span className="text-indigo-400 mt-0.5 font-bold">•</span>
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (5 Cols) ================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Card 2: Current Medications (Matching Screenshot Top-Right) */}
            <div className="rounded-[2rem] bg-white p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Current medications</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert("Prescribe / Add Medication modal")}
                    title="Add medication"
                    className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 text-[#0097a7] flex items-center justify-center transition-colors cursor-pointer border border-slate-200/60"
                  >
                    <Plus size={15} />
                  </button>
                  <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {medications.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0097a7] flex items-center justify-center shrink-0 mt-0.5">
                      <Pill size={14} className="rotate-45" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{m.name}</p>
                      <p className="text-[11px] text-slate-400">{m.dose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Vitals with Heart & Pulse Wave (Matching Screenshot Middle-Right) */}
            <div className="rounded-[2rem] bg-white p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Vitals</h3>
                <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* 2-Column Split: Blood Pressure & Pulse */}
              <div className="grid grid-cols-2 divide-x divide-slate-100">
                {/* Blood Pressure */}
                <div className="flex flex-col items-center text-center pr-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50/80 text-[#0097a7] flex items-center justify-center mb-2">
                    <Heart size={22} className="stroke-[1.75]" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 mb-1">Blood Pressure</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{patient ? vitals[0].value : "121/75"}</span>
                  </div>
                </div>

                {/* Pulse */}
                <div className="flex flex-col items-center text-center pl-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50/80 text-[#0097a7] flex items-center justify-center mb-2">
                    <Activity size={22} className="stroke-[1.75]" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 mb-1">Pulse</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{vitals[1].value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">BPM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Lab Results (Matching Screenshot Bottom-Right) */}
            <div className="rounded-[2rem] bg-white p-6 border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Lab results</h3>
                <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {labResults.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={15} className="text-[#0097a7] shrink-0" />
                      <span className="text-xs font-bold text-slate-700">{r.name}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">{r.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CLINICAL TIMELINE & ANALYTICS EXTENSIONS (Recharts & History) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Blood Sugar Trend Chart (Recharts) */}
          <div className="lg:col-span-7 rounded-[2rem] bg-white p-6 border border-slate-100 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Blood Sugar Trend (HbA1c & Fasting)</h3>
                <p className="text-[11px] text-slate-400">Quarterly progression across last 6 checkups</p>
              </div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                Avg: 147 mg/dL
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sugarTrend} margin={{ top: 5, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="visit" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    labelStyle={{ color: "#334155", fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2, stroke: "#fff" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Visit History Accordion */}
          <div className="lg:col-span-5 rounded-[2rem] bg-white p-6 border border-slate-100 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Visit History & Clinical Diagnosis</h3>
            <div className="relative space-y-2 pl-4">
              <div className="absolute left-[6px] top-2 bottom-2 w-px bg-slate-200" />
              {visits.map((v, i) => (
                <div key={i} className="relative pb-2">
                  <div className="absolute -left-[14px] top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600 ring-2 ring-indigo-100" />
                  <button
                    onClick={() => setOpenVisit(openVisit === i ? -1 : i)}
                    className="flex w-full items-center justify-between rounded-xl p-2 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {v.diagnosis}
                        <span className="ml-2 text-[10px] font-medium text-slate-400">{v.date}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {v.doctor} · {v.specialty}
                      </p>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`shrink-0 text-slate-400 transition-transform ${openVisit === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openVisit === i && (
                    <p className="mx-2 mt-1 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 border border-slate-100">
                      {v.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Consultation Action Footer */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Stethoscope size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Consultation Session Active</h4>
              <p className="text-xs text-slate-400">Review vitals, update prescriptions, and complete checkup.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer size={15} />
              Print Summary
            </button>
            <button
              onClick={() => {
                navigate(`/prescription/${patient.id}`);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Finish Consultation (Done)</span>
            </button>
          </div>
        </div>
      </div>
  );
}
