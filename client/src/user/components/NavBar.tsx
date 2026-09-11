import React from "react";
import {
  Home,
  Calendar,
  FileText,
  Mic,
  Activity,
  Stethoscope,
} from "lucide-react";

interface NavBarProps {
  tab: string;
  setTab: (tab: string) => void;
  onOpenIntake?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ tab, setTab }) => {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "appointments", label: "Appointments & Token", icon: Calendar },
    { id: "records", label: "Records & Parche", icon: FileText },
    { id: "ai-assistant", label: "AI Assistant (Guide)", icon: Mic, isAi: true },
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
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{ background: "var(--primary)" }}
            >
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                MediKiosk
              </h2>
              <p className="text-[11px] font-bold text-primary tracking-wide mt-1">
                AIIA OPD KIOSK (PS 26047)
              </p>
            </div>
          </div>

          {/* Clean Navigation Links with breathing space */}
          <nav className="space-y-2 pt-2">
            {items.map((it) => {
              const active = tab === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setTab(it.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <it.icon
                    size={20}
                    className={active ? "text-white" : "text-slate-400"}
                  />
                  <span>{it.label}</span>
                  {it.isAi && (
                    <span
                      className={`ml-auto text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      Indic Voice
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Doctor quick switch with clean card */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              localStorage.setItem("medikiosk_role", "doctor");
              window.location.href = "/doctor";
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-primary transition-colors cursor-pointer"
          >
            <Stethoscope size={15} />
            <span>Switch to Doctor Cockpit →</span>
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
          <Home size={19} color={tab === "home" ? "var(--primary)" : "var(--ink-soft)"} />
          <span className={`text-[10.5px] ${tab === "home" ? "font-bold" : "font-medium"}`}>
            Home
          </span>
        </button>

        <button
          onClick={() => setTab("appointments")}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer"
          style={{ color: tab === "appointments" ? "var(--primary)" : "var(--ink-soft)" }}
        >
          <Calendar size={19} color={tab === "appointments" ? "var(--primary)" : "var(--ink-soft)"} />
          <span className={`text-[10.5px] ${tab === "appointments" ? "font-bold" : "font-medium"}`}>
            Appts
          </span>
        </button>

        {/* Center Floating AI Check Button */}
        <button
          onClick={() => setTab("ai-assistant")}
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
            <Mic size={22} color="#fff" />
          </div>
          <span className="text-[10.5px] font-bold text-slate-800">
            AI Voice
          </span>
        </button>

        <button
          onClick={() => setTab("records")}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer"
          style={{ color: tab === "records" ? "var(--primary)" : "var(--ink-soft)" }}
        >
          <FileText size={19} color={tab === "records" ? "var(--primary)" : "var(--ink-soft)"} />
          <span className={`text-[10.5px] ${tab === "records" ? "font-bold" : "font-medium"}`}>
            Records
          </span>
        </button>
      </div>
    </>
  );
};
