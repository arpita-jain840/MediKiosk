import React, { useState } from "react";
import {
  Stethoscope,
  ChevronRight,
  FileText,
  Calendar,
  PhoneCall,
  Bell,
  Mic,
  UploadCloud,
  ShieldCheck,
  Leaf,
  Clock,
  Sparkles,
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { QuickAction } from "../components/QuickAction";
import type { PatientProfile } from "../types";

interface HomeScreenProps {
  patient: PatientProfile;
  currentLang?: string;
  onOpenLangModal?: () => void;
  onOpenIntake: () => void;
  setTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  patient,
  currentLang = "en",
  onOpenLangModal,
  onOpenIntake,
  setTab,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchSuggestions = [
    { label: "Chest pain / छाती में दर्द", tab: "ai-assistant" },
    { label: "Ayurvedic Pariksha (प्रकृति जाँच)", tab: "ai-assistant" },
    { label: "Upload Parche / पर्चा स्कैन", tab: "records" },
    { label: "Dr. John Smith (Room 4B)", tab: "appointments" },
    { label: "Panchakarma Department", tab: "appointments" },
  ];

  const filteredSuggestions = searchQuery.trim()
    ? searchSuggestions.filter((s) =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Top Header with Global Search Bar & Bhashini Language Selector */}
      <TopBar
        title="MediKiosk OPD"
        currentLang={currentLang}
        onOpenLangModal={onOpenLangModal}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search symptoms, doctors, departments, or records..."
        right={
          <button
            className="tap-target flex items-center justify-center rounded-full w-9 h-9 md:w-10 md:h-10 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer shadow-2xs"
            aria-label="Notifications"
          >
            <Bell size={17} className="text-slate-600" />
          </button>
        }
      />

      {/* Search dropdown suggestions if typing */}
      {searchQuery.trim() && (
        <div className="px-5 md:px-10 py-2">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-md max-w-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
              Quick Suggestions
            </span>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setTab(s.tab);
                    setSearchQuery("");
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span>{s.label}</span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    Open {s.tab}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 p-2">
                No direct match. Press below to consult the AI Voice Assistant for '{searchQuery}'.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="px-5 md:px-10 py-5 md:py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Greeting & PS Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                  SIH'26 PS 26047 · Ayush & AIIA OPD
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Namaste, {patient.name.split(" ")[0]}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Ayushman Bharat linked digital case-taking kiosk terminal.
              </p>
            </div>

            {/* Quick Language pill */}
            <button
              onClick={onOpenLangModal}
              className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-primary hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🌐 भाषा बदलें (Bhashini AI)</span>
            </button>
          </div>

          {/* Primary Hero Banner (PS 26047 Core Focus: AI Case Taking) */}
          <div
            className="w-full rounded-3xl p-6 md:p-8 text-left text-white shadow-xl relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #3368a0 0%, #173757 100%)",
            }}
          >
            <div className="relative z-10 space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                <Sparkles size={14} />
                <span>One-Time AI Synthesis to PostgreSQL</span>
              </div>

              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight">
                Not feeling well today?
              </h3>
              
              <p className="text-xs md:text-sm text-white/85 leading-relaxed">
                Speak your symptoms in your native language or scan your paper prescriptions (*parche*). 
                MediKiosk creates an instant **1-page Clinical Blueprint** so the doctor can examine you in seconds with zero delay.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenIntake}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-primary text-xs md:text-sm font-bold shadow-md hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                >
                  <Mic size={16} />
                  <span>Start AI Voice Intake</span>
                </button>

                <button
                  onClick={() => setTab("records")}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs md:text-sm font-bold border border-white/30 transition-colors cursor-pointer"
                >
                  <UploadCloud size={16} />
                  <span>Scan Paper Parche</span>
                </button>
              </div>
            </div>

            {/* Decorative Stethoscope watermark */}
            <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none hidden sm:block">
              <Stethoscope size={140} color="#ffffff" />
            </div>
          </div>

          {/* Core Services 4-Column Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Hospital OPD Services
              </p>
              <span className="text-[11px] font-semibold text-primary">All India Institute of Ayurveda</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              <QuickAction
                icon={Calendar}
                label="Appointments & Token"
                onClick={() => setTab("appointments")}
              />
              <QuickAction
                icon={FileText}
                label="Digital Records & OCR"
                onClick={() => setTab("records")}
              />
              <QuickAction
                icon={Mic}
                label="AI Voice Assistant"
                onClick={() => setTab("ai-assistant")}
              />
              <QuickAction
                icon={PhoneCall}
                label="Emergency Desk"
                onClick={() => {}}
                danger
              />
            </div>
          </div>

          {/* AYUSH & Ayurvedic Clinical Pariksha Widget (PS Specific) */}
          <div className="rounded-3xl p-5 md:p-6 bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Leaf size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    AYUSH Clinical Pariksha Profile (आयुर्वेदिक परीक्षा)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Dashavidha & Trividha Pariksha for personalized care
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTab("ai-assistant")}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Assess in AI Check →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Prakriti</span>
                <span className="text-xs font-extrabold text-slate-900 mt-1 block">Vata - Pitta</span>
                <span className="text-[10px] text-slate-500">वात्त-पित्त प्रकृति</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Agni</span>
                <span className="text-xs font-extrabold text-slate-900 mt-1 block">Vishamagni</span>
                <span className="text-[10px] text-slate-500">पाचन अग्नि क्षमता</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Koshtha</span>
                <span className="text-xs font-extrabold text-slate-900 mt-1 block">Madhyama</span>
                <span className="text-[10px] text-slate-500">कोष्ठ स्वभाव</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Ahara-Vihara</span>
                <span className="text-xs font-extrabold text-slate-900 mt-1 block">Irregular Diet</span>
                <span className="text-[10px] text-slate-500">आहार-विहार जीवनशैली</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Today's OPD Status & ABHA */}
        <div className="space-y-6">
          
          {/* Today's Token & Live OPD Status */}
          <div className="rounded-3xl p-5 md:p-6 bg-white border border-primary/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500">Today's Active Queue</span>
              <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Token Active
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="rounded-2xl flex flex-col items-center justify-center shrink-0 w-16 h-16 shadow-xs"
                style={{ background: "var(--primary)", color: "#ffffff" }}
              >
                <span className="text-[9px] uppercase font-bold text-white/80">Token</span>
                <span className="text-2xl font-black">#2</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-900 truncate">
                  Dr. John Smith
                </p>
                <p className="text-xs text-slate-500">
                  Cardiology & Ayush · Room 4B
                </p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
                  <Clock size={13} />
                  <span>Est. Wait: ~4 mins</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setTab("appointments")}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Appointment Slip & Queue</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Digital Health Completeness Gauge */}
          <div className="rounded-3xl p-5 md:p-6 bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Digital Health Profile</p>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                85% Complete
              </span>
            </div>
            <div className="rounded-full h-2.5 overflow-hidden bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: "85%", background: "var(--primary)" }}
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prescriptions digitized. Complete the voice intake to reach 100% before seeing the doctor.
            </p>
          </div>

          {/* Ayushman Bharat (ABHA) Information Banner */}
          <div
            onClick={() => setTab("profile")}
            className="rounded-3xl p-5 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-transparent border border-teal-200 flex flex-col gap-3 cursor-pointer hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-teal-700" />
                <span className="text-xs font-extrabold text-teal-900">
                  Ayushman Bharat Linked
                </span>
              </div>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                ABHA Active
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500">ABHA Address:</p>
              <p className="text-sm font-mono font-bold text-slate-900">{patient.abha}</p>
            </div>
            <span className="text-xs font-bold text-primary flex items-center gap-1 mt-1">
              <span>Manage Profile & Medications</span>
              <ChevronRight size={14} />
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
