import React, { useState } from "react";
import {
  Calendar,
  FileText,
  Mic,
  PhoneCall,
  UploadCloud,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { TopBar } from "../components/TopBar";
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
  const [searchQuery, setSearchQuery] = useState("");

  const searchSuggestions = [
    { label: "Book Token (Dr. John Smith · Room 4B)", tab: "appointments" },
    { label: "Panchakarma Department (पंचकर्म)", tab: "appointments" },
    { label: "Upload Paper Prescription (पर्चा स्कैन)", tab: "records" },
    { label: "Ask AI Assistant for Hospital Directions", tab: "ai-assistant" },
    { label: "Emergency Desk & Reception", tab: "appointments" },
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
        title="MediKiosk OPD"
        currentLang={currentLang}
        onOpenLangModal={onOpenLangModal}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search doctors, departments, or records..."
        onOpenProfile={() => setTab("profile")}
        patientName={patient.name}
      />

      {/* Search dropdown suggestions */}
      {searchQuery.trim() && (
        <div className="px-6 md:px-12 py-2 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-lg space-y-1">
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
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-800 transition-colors"
                >
                  <span>{s.label}</span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    Open {s.tab}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 p-2">
                Press to consult AI Assistant for '{searchQuery}'.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area - Clean, Spacious, Professional Layout */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-12 py-8 space-y-8">
        
        {/* Clean Greeting Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70">
              All India Institute of Ayurveda · OPD Kiosk
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Namaste, {patient.name.split(" ")[0]}
          </h2>
          <p className="text-sm md:text-base text-slate-500">
            Welcome to the digital OPD self-service terminal. How can we help you today?
          </p>
        </div>

        {/* Primary Hero Banner - Generous breathing room, focused on core action */}
        <div
          className="w-full rounded-3xl p-8 md:p-10 text-left text-white shadow-xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #3368a0 0%, #173757 100%)",
          }}
        >
          <div className="relative z-10 space-y-4 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Hospital Self-Service Made Simple
            </h3>
            
            <p className="text-sm md:text-base text-white/85 leading-relaxed">
              Book your OPD consultation token, scan physical prescriptions (*parche*) to your digital health records, or talk with our AI guide in your native language.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setTab("appointments")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-primary text-sm font-bold shadow-md hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                <Calendar size={18} />
                <span>Book OPD Token</span>
              </button>

              <button
                onClick={() => setTab("records")}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-sm font-bold border border-white/30 transition-colors cursor-pointer"
              >
                <UploadCloud size={18} />
                <span>Scan Prescription</span>
              </button>

              <button
                onClick={() => setTab("ai-assistant")}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-sm font-bold border border-white/30 transition-colors cursor-pointer"
              >
                <Mic size={18} />
                <span>Ask AI Guide</span>
              </button>
            </div>
          </div>

          {/* Stethoscope Watermark */}
          <div className="absolute right-6 bottom-4 opacity-15 pointer-events-none hidden md:block">
            <Stethoscope size={160} color="#ffffff" />
          </div>
        </div>

        {/* 4 Clean Main Feature Cards with Breathing Room */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Quick Services & Navigation
            </h3>
            <span className="text-xs text-slate-400">AIIA New Delhi</span>
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
                    Appointments & Live Queue
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Check your live token status (Token #2, Room 4B), find doctors on duty, and book OPD slots.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>Open Appointments</span>
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
                    Digital Records & Parche
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Scan your handwritten paper prescriptions (*parche*) with AI OCR or review previous lab reports.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>View Records & Upload</span>
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
                    AI Voice Guide & Assistant
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Speak or chat in your language to ask about doctor rooms, OPD timings, or which department to visit.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>Start Conversation</span>
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
                    Emergency Desk & Reception
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Immediate assistance for emergency triage, wheelchair support, and hospital reception guidance.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                <span>Contact Helpdesk</span>
                <ArrowRight size={14} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
