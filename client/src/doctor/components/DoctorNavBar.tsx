import React from "react";
import {
  CalendarDays,
  Activity,
  FileText,
  Home,
  ListChecks,
} from "lucide-react";
import { getTranslations } from "../../user/utils/i18n";

interface DoctorNavBarProps {
  tab: string;
  setTab: (tab: string) => void;
  currentLang?: string;
}

export const DoctorNavBar: React.FC<DoctorNavBarProps> = ({
  tab,
  setTab,
  currentLang = "en",
}) => {
  const t = getTranslations(currentLang);
  const labels = t.doctorNav!;
  const items = [
    { id: "dashboard", label: labels.dashboard, icon: Home },
    { id: "queue", label: labels.queue, icon: ListChecks },
    { id: "appointments", label: labels.appointments, icon: CalendarDays },
    { id: "records", label: labels.records, icon: FileText },
  ];
  const mobileItems = items.filter((item) => item.id !== "dashboard");

  return (
    <>
      <aside className="hidden md:flex flex-col justify-between shrink-0 w-64 lg:w-72 h-screen sticky top-0 p-6 border-r z-20 bg-white border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 bg-primary">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">MediKiosk</h2>
              <p className="text-[11px] font-bold text-primary tracking-wide mt-1">AIIA OPD KIOSK (PS 26047)</p>
            </div>
          </div>

          <nav className="space-y-2 pt-2" aria-label="Doctor navigation">
            {items.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer text-left ${
                    active ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <item.icon size={20} className={active ? "text-white" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
          Secure clinical workspace
        </p>
      </aside>

      <nav className="md:hidden shrink-0 border-t flex items-stretch w-full py-1 sticky bottom-0 z-20 bg-white border-slate-200/60" aria-label="Doctor mobile navigation">
        {mobileItems.slice(0, 2).map((item) => {
          const active = tab === item.id;
          return (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer" style={{ color: active ? "var(--primary)" : "var(--ink-soft)" }}>
              <item.icon size={19} />
              <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </button>
          );
        })}
        <button type="button" onClick={() => setTab("dashboard")} className="flex-1 flex flex-col items-center justify-center gap-1 py-1 tap-target cursor-pointer group">
          <span className="flex items-center justify-center rounded-full -mt-5 shadow-md transition-transform group-hover:scale-105 bg-primary border-4 border-white w-[50px] h-[50px]">
            <Home size={22} color="#fff" />
          </span>
          <span className="text-[10px] font-bold text-slate-800">{labels.dashboard}</span>
        </button>
        {mobileItems.slice(2).map((item) => {
          const active = tab === item.id;
          return (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target cursor-pointer" style={{ color: active ? "var(--primary)" : "var(--ink-soft)" }}>
              <item.icon size={19} />
              <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default DoctorNavBar;
