import React from "react";
import { ArrowLeft, Globe, Search } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "./LanguageModal";
import { getTranslations } from "../utils/i18n";
import NotificationCenter from "../../components/NotificationCenter";

interface TopBarProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  currentLang?: string;
  onOpenLangModal?: () => void;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchPlaceholder?: string;
  onOpenProfile?: () => void;
  patientName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  onBack,
  right,
  currentLang = "en",
  onOpenLangModal,
  showSearch,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder,
  onOpenProfile,
  patientName = "Priya Sharma",
}) => {
  const t = getTranslations(currentLang);
  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);
  const resolvedPlaceholder = searchPlaceholder || t.topbar.searchPlaceholder;

  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 md:px-10 pt-5 md:pt-6 pb-3 md:pb-5 shrink-0 border-b border-slate-200/60"
      style={{ background: "var(--bg)" }}
    >
      <div className="flex items-start justify-between gap-3 md:contents">
        <div className="flex items-center gap-3 min-w-0 md:order-1">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back"
              className="tap-target -ml-1 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors"
            >
              <ArrowLeft size={20} color="var(--ink)" />
            </button>
          )}
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 md:order-3">
          {currentLang && onOpenLangModal && (
            <button
              onClick={onOpenLangModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-bold text-primary hover:bg-slate-50 hover:border-primary/40 transition-all cursor-pointer"
              title="Change Language (Bhashini National Language Mission)"
            >
              <Globe size={14} className="text-primary" />
              <span>{activeLangObj ? activeLangObj.native : "English"}</span>
            </button>
          )}
          <NotificationCenter role="patient" />
          {right}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              title="Patient Profile & ABHA"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform" style={{ background: "var(--primary)" }}>
                {patientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="text-left hidden sm:block pr-1">
                <p className="text-xs font-bold text-slate-900 leading-none">{patientName.split(" ")[0]}</p>
                <p className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5">{t.topbar.abhaActive}</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Global Search Bar if enabled (Desktop & Kiosk ready) */}
      {showSearch && (
        <div className="hidden md:block flex-1 max-w-xl mx-0 md:mx-6 w-full md:order-2">
          <div className="relative flex items-center w-full">
            <Search
              size={16}
              className="absolute left-3.5 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={resolvedPlaceholder}
              className="w-full pl-9.5 pr-4 py-2 text-xs md:text-sm rounded-xl bg-white border border-slate-200 shadow-2xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

    </div>
  );
};
