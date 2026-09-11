import React from "react";
import { ArrowLeft, Globe, Search } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "./LanguageModal";

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
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  onBack,
  right,
  currentLang,
  onOpenLangModal,
  showSearch,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search doctors, symptoms, departments, or records...",
}) => {
  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);

  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 md:px-10 pt-5 md:pt-7 pb-3 md:pb-5 shrink-0 border-b border-slate-200/50"
      style={{ background: "var(--bg)" }}
    >
      <div className="flex items-center gap-3">
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

      {/* Global Search Bar if enabled (Desktop & Kiosk ready) */}
      {showSearch && (
        <div className="flex-1 max-w-xl mx-0 md:mx-6 w-full">
          <div className="relative flex items-center w-full">
            <Search
              size={16}
              className="absolute left-3.5 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9.5 pr-4 py-2 text-xs md:text-sm rounded-xl bg-white border border-slate-200 shadow-2xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      {/* Action Buttons & Language Selector */}
      <div className="flex items-center gap-2.5 self-end md:self-auto">
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
        {right}
      </div>
    </div>
  );
};
