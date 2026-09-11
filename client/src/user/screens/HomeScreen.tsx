import React, { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  Mic,
  PhoneCall,
  UploadCloud,
  Stethoscope,
  ArrowRight,
  Activity,
  HeartPulse,
  Thermometer,
  Droplets,
  ShieldCheck,
  QrCode,
  Download,
  Sparkles,
  X,
  Pill,
  AlertTriangle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { TopBar } from "../components/TopBar";
import { getTranslations } from "../utils/i18n";
import type { PatientProfile } from "../types";

interface HomeScreenProps {
  patient: PatientProfile;
  currentLang?: string;
  onOpenLangModal?: () => void;
  onOpenIntake?: () => void;
  setTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  patient,
  currentLang = "en",
  onOpenLangModal,
  setTab,
}) => {
  const t = getTranslations(currentLang);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [isExportingFhir, setIsExportingFhir] = useState(false);

  // Live WebSocket state for real-time queue handshake on Home
  const [queueStatus, setQueueStatus] = useState<string>("waiting");
  const [activeCallRoom, setActiveCallRoom] = useState<string>("Room 4B");
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  const activeToken = 5;
  const assignedDoctor = "Dr. John Smith";
  const assignedRoom = activeCallRoom || "Room 4B";

  // Subscribe to live WebSocket queue updates
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket("ws://127.0.0.1:8000/ws/queue");
      ws.onopen = () => setIsLiveConnected(true);
      ws.onclose = () => setIsLiveConnected(false);
      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (data.type === "QUEUE_ADVANCED" || data.type === "QUEUE_UPDATED") {
            if (data.token === activeToken) {
              setQueueStatus(data.status);
              if (data.room) setActiveCallRoom(data.room);
            }
          }
        } catch {
          // ignore ping
        }
      };
    } catch {
      setIsLiveConnected(false);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [activeToken]);

  // QR Code payload for doctor scanner handshake
  const qrData = JSON.stringify({
    system: "MediKiosk",
    token: activeToken,
    patientName: patient.name,
    abha: patient.abha,
    room: assignedRoom,
    doctor: assignedDoctor,
    priority: "Routine",
    generatedAt: new Date().toISOString(),
  });

  // Export ABDM FHIR JSON Bundle
  const handleExportFhir = async () => {
    setIsExportingFhir(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/patient/demo-patient/fhir`);
      if (res.ok) {
        const bundle = await res.json();
        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ABDM_FHIR_Bundle_Token_${activeToken}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert("FHIR export is generating from clinical blueprint...");
      }
    } catch (err) {
      console.warn("Notice exporting FHIR bundle:", err);
    } finally {
      setIsExportingFhir(false);
    }
  };

  const searchSuggestions = [
    { label: `${t.home.btnBook} · Dr. John Smith (Room 4B)`, tab: "appointments" },
    { label: t.appointments.depts.panchakarma, tab: "appointments" },
    { label: t.home.btnRecords, tab: "records" },
    { label: t.home.btnGuide, tab: "ai-assistant" },
    { label: t.home.cardHelpTitle, tab: "appointments" },
  ];

  const filteredSuggestions = searchQuery.trim()
    ? searchSuggestions.filter((s) =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Global Search Bar, Language Selector & Top-Right Profile */}
      <TopBar
        title={t.topbar.homeTitle}
        currentLang={currentLang}
        onOpenLangModal={onOpenLangModal}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenProfile={() => setTab("profile")}
        patientName={patient.name}
      />

      {/* Search dropdown suggestions */}
      {searchQuery.trim() && (
        <div className="px-6 md:px-12 py-2 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-lg space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
              {t.topbar.quickSuggestions}
            </span>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setTab(s.tab);
                    setSearchQuery("");
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span>{s.label}</span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    →
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 p-2">
                {t.topbar.noMatch}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-12 py-8 space-y-8">
        
        {/* Clean Greeting Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70">
              {t.home.kioskTag}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {t.home.greeting}, {patient.name.split(" ")[0]}
          </h2>
          <p className="text-sm md:text-base text-slate-500">
            {t.home.welcomeSub}
          </p>
        </div>

        {/* Primary Hero Banner */}
        <div
          className="w-full rounded-3xl p-8 md:p-10 text-left text-white shadow-xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #3368a0 0%, #173757 100%)",
          }}
        >
          <div className="relative z-10 space-y-4 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {t.home.heroTitle}
            </h3>
            
            <p className="text-sm md:text-base text-white/85 leading-relaxed">
              {t.home.heroDesc}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setTab("appointments")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-primary text-sm font-bold shadow-md hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                <Calendar size={18} />
                <span>{t.home.btnBook}</span>
              </button>

              <button
                onClick={() => setTab("records")}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-sm font-bold border border-white/30 transition-colors cursor-pointer"
              >
                <UploadCloud size={18} />
                <span>{t.home.btnRecords}</span>
              </button>

              <button
                onClick={() => setTab("ai-assistant")}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-sm font-bold border border-white/30 transition-colors cursor-pointer"
              >
                <Mic size={18} />
                <span>{t.home.btnGuide}</span>
              </button>
            </div>
          </div>

          {/* Stethoscope Watermark */}
          <div className="absolute right-6 bottom-4 opacity-15 pointer-events-none hidden md:block">
            <Stethoscope size={160} color="#ffffff" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HEALTH PAGE SECTION (Directly below Hero Banner)                           */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                  My Health Profile & Assessment
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-600" />
                  ABHA Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Live vitals, AYUSH clinical assessment, and active consultation handshake
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQRModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-2xs cursor-pointer"
              >
                <QrCode size={14} />
                <span>Digital Pass</span>
              </button>
              <button
                onClick={handleExportFhir}
                disabled={isExportingFhir}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <Download size={14} />
                <span>{isExportingFhir ? "Exporting..." : "FHIR R4"}</span>
              </button>
            </div>
          </div>

          {/* Live Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Vital 1: Blood Pressure */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Blood Pressure</span>
                <Activity size={16} className="text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">120/80</span>
                <span className="text-[11px] font-semibold text-slate-400">mmHg</span>
              </div>
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Normal Range
              </span>
            </div>

            {/* Vital 2: Heart Rate */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Heart Rate</span>
                <HeartPulse size={16} className="text-rose-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">74</span>
                <span className="text-[11px] font-semibold text-slate-400">bpm</span>
              </div>
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Regular Pulse
              </span>
            </div>

            {/* Vital 3: SpO2 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Oxygen (SpO2)</span>
                <Droplets size={16} className="text-sky-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">98%</span>
                <span className="text-[11px] font-semibold text-slate-400">Optimal</span>
              </div>
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Sufficient O2
              </span>
            </div>

            {/* Vital 4: Temperature */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Body Temp</span>
                <Thermometer size={16} className="text-amber-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">98.4</span>
                <span className="text-[11px] font-semibold text-slate-400">°F</span>
              </div>
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Afebrile
              </span>
            </div>
          </div>

          {/* Active Consultation & Live Token Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex flex-col items-center justify-center shadow-md shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Token</span>
                <span className="text-2xl font-black leading-none">#{activeToken}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {assignedRoom} · {assignedDoctor}
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Cardiology & Ayush
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-consultation clinical blueprint synthesized and sent to Doctor Cockpit.
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className={`flex items-center gap-1.5 font-bold ${isLiveConnected ? "text-emerald-700" : "text-amber-700"}`}>
                    <span className={`w-2 h-2 rounded-full ${isLiveConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                    {queueStatus === "in_consultation" ? "Now In Consultation" : "Waiting in Queue"}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 font-medium">Est. Wait: ~4-8 mins</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowQRModal(true)}
                className="w-full md:w-auto px-5 py-3 rounded-2xl bg-primary hover:bg-[#204b77] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <QrCode size={16} />
                <span>Show QR Pass</span>
              </button>
            </div>
          </div>

          {/* Ayush Prakriti & Health Overview Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Prakriti Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ayush Pariksha
                </span>
                <Sparkles size={16} className="text-amber-500" />
              </div>
              <h4 className="text-base font-black text-slate-900">Vata-Pitta Balance</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Agni: <span className="font-semibold text-slate-700">Samagni</span> · Koshtha: <span className="font-semibold text-slate-700">Madhyama</span>. Digestion and energy rhythm optimal.
              </p>
            </div>

            {/* Active Medications Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Medicines
                </span>
                <Pill size={16} className="text-primary" />
              </div>
              <div className="space-y-1.5">
                {patient.medications && patient.medications.length > 0 ? (
                  patient.medications.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{m.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{m.schedule}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No current prescriptions active</p>
                )}
              </div>
            </div>

            {/* Known Allergies Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Allergies Guard
                </span>
                <AlertTriangle size={16} className="text-rose-500" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies && patient.allergies.length > 0 ? (
                  patient.allergies.map((a, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No known drug allergies</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Clean Main Feature Cards */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {t.home.servicesHeader}
            </h3>
            <span className="text-xs text-slate-400">{t.home.aiiaTag}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Appointments */}
            <div
              onClick={() => setTab("appointments")}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform"
                  style={{ background: "var(--primary-tint)" }}
                >
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {t.home.cardApptsTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {t.home.cardApptsDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>{t.home.cardApptsTitle}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 2: Records */}
            <div
              onClick={() => setTab("records")}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform"
                  style={{ background: "var(--primary-tint)" }}
                >
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {t.home.cardRecordsTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {t.home.cardRecordsDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>{t.home.cardRecordsTitle}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 3: AI Assistant */}
            <div
              onClick={() => setTab("ai-assistant")}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform"
                  style={{ background: "var(--primary-tint)" }}
                >
                  <Mic size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {t.home.cardAiTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {t.home.cardAiDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>{t.home.cardAiTitle}</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 4: Helpdesk */}
            <div
              onClick={() => alert("Connecting to AIIA Main Reception Helpdesk (Ext: 101)...")}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-rose-600 bg-rose-50 group-hover:scale-105 transition-transform">
                  <PhoneCall size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    {t.home.cardHelpTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {t.home.cardHelpDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                <span>{t.home.cardHelpTitle}</span>
                <ArrowRight size={14} />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Interactive Consultation QR Pass Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={20} className="text-primary" />
                <h3 className="text-base font-bold text-slate-900">OPD Consultation Pass</h3>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
                <QRCodeSVG value={qrData} size={180} level="M" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mt-3">
                Token #{activeToken} · Scan at Doctor Cockpit
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {assignedRoom} · {assignedDoctor}
              </p>
            </div>

            <div className="text-xs text-slate-500 space-y-1 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span>Patient:</span>
                <span className="font-bold text-slate-800">{patient.name}</span>
              </div>
              <div className="flex justify-between">
                <span>ABHA ID:</span>
                <span className="font-mono text-slate-700">{patient.abha}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-emerald-600">Verified & Ready</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExportFhir}
                className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download size={14} />
                <span>FHIR JSON</span>
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
