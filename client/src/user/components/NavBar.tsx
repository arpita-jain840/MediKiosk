import React from "react";
import {
  Home,
  Calendar,
  FileText,
  Mic,
  Activity,
} from "lucide-react";

import { getTranslations } from "../utils/i18n";
import NotificationCenter from "../../components/NotificationCenter";

interface NavBarProps {
  tab: string;
  setTab: (tab: string) => void;
  currentLang?: string;
  onOpenIntake?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ tab, setTab, currentLang = "en" }) => {
  const t = getTranslations(currentLang);
  const items = [
    { id: "home", label: t.nav.home, icon: Home },
    { id: "appointments", label: t.nav.appointments, icon: Calendar },
    { id: "records", label: t.nav.records, icon: FileText },
    { id: "ai-assistant", label: t.nav.ai, icon: Mic, isAi: true },
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
                      {t.nav.indicBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
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
            {t.nav.home}
          </span>
        </button>

        <button
          onClick={() => setTab("appointments")}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer"
          style={{ color: tab === "appointments" ? "var(--primary)" : "var(--ink-soft)" }}
        >
          <Calendar size={19} color={tab === "appointments" ? "var(--primary)" : "var(--ink-soft)"} />
          <span className={`text-[10.5px] ${tab === "appointments" ? "font-bold" : "font-medium"}`}>
            {t.nav.appointments}
          </span>
        </button>
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
            {t.nav.ai}
          </span>
        </button>

        <button
          onClick={() => setTab("records")}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer"
          style={{ color: tab === "records" ? "var(--primary)" : "var(--ink-soft)" }}
        >
          <FileText size={19} color={tab === "records" ? "var(--primary)" : "var(--ink-soft)"} />
          <span className={`text-[10.5px] ${tab === "records" ? "font-bold" : "font-medium"}`}>
            {t.nav.records}
          </span>
        </button>

        <NotificationCenter  role="patient" mobile />
      </div>
    </>
  );
};
