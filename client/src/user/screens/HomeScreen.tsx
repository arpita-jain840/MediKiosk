import React from "react";
import {
  Stethoscope,
  ChevronRight,
  FileText,
  Calendar,
  PhoneCall,
  Bell,
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { QuickAction } from "../components/QuickAction";
import type { PatientProfile } from "../types";

interface HomeScreenProps {
  patient: PatientProfile;
  onOpenIntake: () => void;
  setTab: (tab: string) => void;
  currentLang?: string;
  onOpenLangModal?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  patient,
  onOpenIntake,
  setTab,
  currentLang,
  onOpenLangModal,
}) => {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      <TopBar
        title="MediKiosk AI Care"
        currentLang={currentLang}
        onOpenLangModal={onOpenLangModal}
        right={
          <button
            className="tap-target flex items-center justify-center rounded-full md:w-10 md:h-10 cursor-pointer"
            style={{ width: 34, height: 34, background: "var(--primary-tint)" }}
            aria-label="Notifications"
          >
            <Bell size={18} color="var(--primary)" className="md:w-5 md:h-5" />
          </button>
        }
      />

      <div className="px-5 md:px-10 pb-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left / Main Column (2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-5 md:space-y-6">
          {/* Greeting */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                OPD Kiosk Terminal Active
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Hello, {patient.name.split(" ")[0]}
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              Welcome to the digital OPD clinical case-taking kiosk. Select a service below to get started.
            </p>
          </div>

          {/* Primary Health Check Hero CTA */}
          <div
            onClick={onOpenIntake}
            className="w-full rounded-2xl md:rounded-3xl p-6 md:p-8 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-xl hover:scale-[1.005] active:scale-[0.995] cursor-pointer group"
            style={{
              background: "linear-gradient(135deg, #3368a0 0%, #1c436b 100%)",
              boxShadow: "0 14px 40px rgba(51, 104, 160, 0.22)",
            }}
          >
            <div className="flex-1 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wide">
                <Stethoscope size={14} />
                <span>AI Clinical Case-Taking</span>
              </span>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                Not feeling well today?
              </h3>
              <p className="text-sm md:text-base text-white/85 max-w-xl leading-relaxed">
                Talk or touch your symptoms in your native language. Our AI engine builds a comprehensive 1-page Clinical Blueprint so your doctor can evaluate your condition in seconds.
              </p>
              <div className="pt-2">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition-all group-hover:bg-white group-hover:text-primary"
                  style={{ background: "rgba(255,255,255,0.18)", color: "#ffffff" }}
                >
                  <span className="text-sm md:text-base font-bold">Start health check now</span>
                  <ChevronRight size={17} />
                </span>
              </div>
            </div>

            <div
              className="shrink-0 rounded-3xl flex items-center justify-center w-16 h-16 md:w-24 md:h-24 shadow-inner"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <Stethoscope size={36} color="#fff" className="md:w-12 md:h-12" />
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Essential Kiosk Services
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              <QuickAction icon={FileText} label="Upload Records" onClick={() => setTab("records")} />
              <QuickAction icon={Calendar} label="OPD Doctors" onClick={() => setTab("doctors")} />
              <QuickAction icon={Stethoscope} label="AYUSH Check" onClick={onOpenIntake} />
              <QuickAction icon={PhoneCall} label="Emergency Desk" onClick={() => {}} danger />
            </div>
          </div>
        </div>

        {/* Right Column (Hospital & Appointment Widgets) */}
        <div className="space-y-5 md:space-y-6">
          {/* Upcoming appointment card */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Today's OPD Queue
            </p>
            <div
              className="rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-primary/15 bg-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500">Department</span>
                <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  Cardiology & Ayush
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="rounded-2xl flex items-center justify-center shrink-0 w-14 h-14 font-black text-lg"
                  style={{ background: "var(--primary-tint)", color: "var(--primary)" }}
                >
                  JS
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-900 truncate">
                    Dr. John Smith
                  </p>
                  <p className="text-xs text-slate-500">
                    OPD Room 4B · AIIA Hospital
                  </p>
                </div>
                <div className="text-right shrink-0 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase">Token</p>
                  <p className="text-base font-black text-primary">#2</p>
                </div>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                <span>Estimated Wait:</span>
                <span className="font-bold text-slate-800">~4 minutes</span>
              </div>
            </div>
          </div>

          {/* History completeness Gauge */}
          <div
            className="rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm bg-white border border-slate-200/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Digital Health Profile</p>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
              Paper prescriptions and Ayushman Bharat ID are linked. Complete the voice intake to reach 100%.
            </p>
          </div>

          {/* Ayushman Bharat (ABHA) Information Banner */}
          <div
            onClick={() => setTab("profile")}
            className="rounded-2xl p-4 bg-linear-to-r from-teal-50 to-blue-50 border border-teal-200/70 flex items-center justify-between cursor-pointer hover:shadow-xs transition-shadow"
          >
            <div>
              <p className="text-xs font-extrabold text-teal-900">Ayushman Bharat (ABHA)</p>
              <p className="text-xs font-mono text-teal-700 mt-0.5">{patient.abha}</p>
            </div>
            <span className="text-xs font-bold text-primary flex items-center gap-1">
              <span>View Profile</span>
              <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
