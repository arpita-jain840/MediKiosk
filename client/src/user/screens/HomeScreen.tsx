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

      <div className="px-5 md:px-10 pb-6 md:pb-10 flex-1 md:grid md:grid-cols-2 md:gap-8">
        <div>
          {/* Greeting */}
          <div className="mb-4 md:mb-6">
            <p className="text-[20px] md:text-[28px] font-extrabold text-slate-900 tracking-tight">
              Hello, {patient.name.split(" ")[0]}
            </p>
            <p className="text-[13px] md:text-[15px] text-slate-500 mt-0.5">
              Welcome to the digital OPD case-taking kiosk.
            </p>
          </div>

          {/* Health Check CTA */}
          <button
            onClick={onOpenIntake}
            className="w-full rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6 text-left flex items-center justify-between transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            style={{ background: "var(--primary)", boxShadow: "0 10px 30px rgba(51,104,160,0.2)" }}
          >
            <div className="pr-3">
              <p className="text-[16px] md:text-[22px] font-extrabold text-white leading-snug">
                Not feeling well?
              </p>
              <p className="text-[13px] md:text-[15px] mt-1 md:mt-2 text-white/80 leading-snug">
                Talk or type your symptoms — we'll create a 1-page health profile for your doctor.
              </p>
              <span
                className="inline-flex items-center gap-1.5 mt-3 md:mt-5 rounded-full px-3.5 py-2 md:px-5 md:py-2.5 transition-colors hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.16)" }}
              >
                <span className="text-[13px] md:text-[14px] font-bold text-white">Start health check</span>
                <ChevronRight size={15} color="#fff" />
              </span>
            </div>
            <div
              className="shrink-0 rounded-full flex items-center justify-center md:w-20 md:h-20"
              style={{ width: 52, height: 52, background: "rgba(255,255,255,0.14)" }}
            >
              <Stethoscope size={24} color="#fff" className="md:w-8 md:h-8" />
            </div>
          </button>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3 md:gap-5 mb-5 md:mb-8">
            <QuickAction icon={FileText} label="Records" onClick={() => setTab("records")} />
            <QuickAction icon={Calendar} label="Appointments" onClick={() => setTab("doctors")} />
            <QuickAction icon={PhoneCall} label="Emergency" onClick={() => {}} danger />
          </div>
        </div>

        <div>
          {/* Upcoming appointment */}
          <p className="text-[13px] md:text-[15px] mb-2 md:mb-4 font-bold" style={{ color: "var(--ink-soft)" }}>
            Upcoming appointment
          </p>
          <div
            className="rounded-2xl md:rounded-3xl p-4 md:p-6 mb-5 md:mb-8 flex items-center gap-3 md:gap-4 shadow-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div
              className="rounded-full flex items-center justify-center shrink-0 md:w-14 md:h-14"
              style={{ width: 44, height: 44, background: "var(--primary-tint)" }}
            >
              <span style={{ color: "var(--primary)", fontWeight: 800 }} className="text-[14px] md:text-[16px]">
                JS
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] md:text-[16px] font-bold text-slate-900 truncate">
                Dr. John Smith
              </p>
              <p className="text-[12.5px] md:text-[14px] text-slate-500">
                Cardiology & General Medicine · Room 4B
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[12.5px] md:text-[14px] font-bold" style={{ color: "var(--primary)" }}>
                Today
              </p>
              <p className="text-[11.5px] md:text-[13px] text-slate-400">Token #2</p>
            </div>
          </div>

          {/* History completeness */}
          <div
            className="rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <p className="text-[13.5px] md:text-[15px] font-bold text-slate-900">Digital health profile</p>
              <p className="text-[13px] md:text-[15px] font-black" style={{ color: "var(--primary)" }}>
                85% Complete
              </p>
            </div>
            <div className="rounded-full h-2 md:h-3 overflow-hidden mb-2 md:mb-4" style={{ background: "var(--primary-tint)" }}>
              <div className="h-full rounded-full" style={{ width: "85%", background: "var(--primary)" }} />
            </div>
            <p className="text-[12px] md:text-[14px] text-slate-500">
              All paper prescriptions digitized and linked to your ABHA account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
