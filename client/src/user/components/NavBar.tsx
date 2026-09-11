import React from "react";
import { Home, FileText, Stethoscope, Search, User } from "lucide-react";

interface NavBarProps {
  tab: string;
  setTab: (tab: string) => void;
  onOpenIntake: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ tab, setTab, onOpenIntake }) => {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "records", label: "Records", icon: FileText },
    { id: "intake", label: "AI Check", icon: Stethoscope, isCenter: true },
    { id: "doctors", label: "Doctors", icon: Search },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div
      className="shrink-0 border-t md:border-t-0 md:border-r flex flex-row md:flex-col items-stretch md:w-28 md:py-8"
      style={{ borderColor: "var(--border)", background: "var(--surface)", zIndex: 10 }}
    >
      {items.map((it) => {
        const active = tab === it.id;
        if (it.isCenter) {
          return (
            <button
              key={it.id}
              onClick={onOpenIntake}
              className="flex-1 md:flex-none flex flex-col items-center justify-center gap-1 py-2 md:my-6 tap-target cursor-pointer group"
            >
              <div
                className="flex items-center justify-center rounded-full -mt-5 md:mt-0 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                style={{
                  width: 52,
                  height: 52,
                  background: "var(--primary)",
                  border: "4px solid var(--surface)",
                }}
              >
                <it.icon size={22} color="#fff" />
              </div>
              <span className="text-[11px] md:text-[12px] font-bold text-slate-800">
                {it.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className="flex-1 md:flex-none flex flex-col items-center justify-center gap-1 py-3 md:py-4 tap-target cursor-pointer transition-colors"
            style={{ color: active ? "var(--primary)" : "var(--ink-soft)" }}
          >
            <it.icon size={20} color={active ? "var(--primary)" : "var(--ink-soft)"} />
            <span className={`text-[11px] md:text-[12.5px] ${active ? "font-bold" : "font-medium"}`}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
