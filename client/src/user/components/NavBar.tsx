import React from "react";
import {
  Home,
  FileText,
  Stethoscope,
  Search,
  User,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { DEFAULT_PATIENT } from "../data/patientData";

interface NavBarProps {
  tab: string;
  setTab: (tab: string) => void;
  onOpenIntake: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ tab, setTab, onOpenIntake }) => {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "records", label: "Medical Records & Parche", icon: FileText },
    { id: "doctors", label: "OPD Doctors & Rooms", icon: Search },
    { id: "profile", label: "Profile & ABHA", icon: User },
  ];

  return (
    <>
      {/* ========================================================== */}
      {/* 1. DESKTOP & LARGE TOUCH KIOSK SIDEBAR (md: and above)     */}
      {/* ========================================================== */}
      <aside
        className="hidden md:flex flex-col justify-between shrink-0 w-64 lg:w-72 h-screen sticky top-0 p-6 border-r z-20"
        style={{
          background: "#ffffff",
          borderColor: "rgba(51, 104, 160, 0.12)",
          boxShadow: "4px 0 24px rgba(0, 0, 0, 0.02)",
        }}
      >
        {/* Top: Branding */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ background: "var(--primary)" }}
            >
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                MediKiosk
              </h2>
              <p className="text-[11px] font-bold text-[#3368a0] tracking-wide mt-1">
                AI CLINICAL INTAKE
              </p>
            </div>
          </div>

          {/* Prominent Kiosk CTA Card for Health Intake */}
          <div
            onClick={onOpenIntake}
            className="p-4 rounded-2xl text-white shadow-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group"
            style={{
              background: "linear-gradient(135deg, #3368a0 0%, #204b77 100%)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Stethoscope size={18} className="text-white" />
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white/90">
                Kiosk Check
              </span>
            </div>
            <p className="text-sm font-bold leading-tight">Start AI Health Check</p>
            <p className="text-[11px] text-white/80 mt-1 leading-snug">
              Voice or touch clinical case-taking for your doctor.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-white/95 group-hover:translate-x-1 transition-transform">
              <span>Begin intake</span>
              <ArrowRight size={13} />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {items.map((it) => {
              const active = tab === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setTab(it.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                    active
                      ? "bg-[#3368a0]/10 text-[#3368a0] font-bold shadow-2xs border-l-4 border-[#3368a0]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <it.icon
                    size={19}
                    className={active ? "text-[#3368a0]" : "text-slate-400"}
                  />
                  <span>{it.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Patient info & Doctor quick switch */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div
            onClick={() => setTab("profile")}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0"
              style={{ background: "var(--primary)" }}
            >
              {DEFAULT_PATIENT.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {DEFAULT_PATIENT.name}
              </p>
              <div className="flex items-center gap-1 text-[10.5px] text-slate-500 font-mono truncate">
                <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
                <span className="truncate">{DEFAULT_PATIENT.abha}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.setItem("medikiosk_role", "doctor");
              window.location.href = "/doctor";
            }}
            className="w-full text-center py-2 text-xs font-bold text-[#3368a0] hover:text-[#204b77] hover:underline cursor-pointer"
          >
            Switch to Doctor Cockpit →
          </button>
        </div>
      </aside>

      {/* ========================================================== */}
      {/* 2. MOBILE BOTTOM NAVIGATION (hidden on md: and above)      */}
      {/* ========================================================== */}
      <div
        className="md:hidden shrink-0 border-t flex flex-row items-stretch w-full py-1 sticky bottom-0 z-20"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
        }}
      >
        <button
          onClick={() => setTab("home")}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer"
          style={{ color: tab === "home" ? "var(--primary)" : "var(--ink-soft)" }}
        >
          <Home size={20} color={tab === "home" ? "var(--primary)" : "var(--ink-soft)"} />
          <span className={`text-[11px] ${tab === "home" ? "font-bold" : "font-medium"}`}>
            Home
          </span>
        </button>

        <button
          onClick={() => setTab("records")}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer"
          style={{ color: tab === "records" ? "var(--primary)" : "var(--ink-soft)" }}
        >
          <FileText size={20} color={tab === "records" ? "var(--primary)" : "var(--ink-soft)"} />
          <span className={`text-[11px] ${tab === "records" ? "font-bold" : "font-medium"}`}>
            Records
          </span>
        </button>

        {/* Center Floating AI Check Button */}
        <button
          onClick={onOpenIntake}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1 tap-target cursor-pointer group"
        >
          <div
            className="flex items-center justify-center rounded-full -mt-5 shadow-md transition-all duration-300 group-hover:scale-105"
            style={{
              width: 50,
              height: 50,
              background: "var(--primary)",
              border: "4px solid var(--surface)",
            }}
          >
            <Stethoscope size={22} color="#fff" />
          </div>
          <span className="text-[11px] font-bold text-slate-800">
            AI Check
          </span>
        </button>

        <button
          onClick={() => setTab("doctors")}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer"
          style={{ color: tab === "doctors" ? "var(--primary)" : "var(--ink-soft)" }}
        >
          <Search size={20} color={tab === "doctors" ? "var(--primary)" : "var(--ink-soft)"} />
          <span className={`text-[11px] ${tab === "doctors" ? "font-bold" : "font-medium"}`}>
            Doctors
          </span>
        </button>

        <button
          onClick={() => setTab("profile")}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer"
          style={{ color: tab === "profile" ? "var(--primary)" : "var(--ink-soft)" }}
        >
          <User size={20} color={tab === "profile" ? "var(--primary)" : "var(--ink-soft)"} />
          <span className={`text-[11px] ${tab === "profile" ? "font-bold" : "font-medium"}`}>
            Profile
          </span>
        </button>
      </div>
    </>
  );
};
