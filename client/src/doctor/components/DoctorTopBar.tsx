import React from "react";
import { ArrowLeft, Globe, Search } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../../user/components/LanguageModal";
import { getTranslations } from "../../user/utils/i18n";

interface DoctorTopBarProps {
  title: string;
  subtitle?: string;
  doctorName?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  currentLang?: string;
  onOpenLangModal?: () => void;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  onOpenProfile?: () => void;
}

export const DoctorTopBar: React.FC<DoctorTopBarProps> = ({
  title,
  subtitle,
  doctorName = "Dr. Ananya Sharma",
  onBack,
  right,
  currentLang = "en",
  onOpenLangModal,
  showSearch = true,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search patients, tokens, or records...",
  onOpenProfile,
}) => {
  const t = getTranslations(currentLang);
  const activeLanguage = SUPPORTED_LANGUAGES.find((language) => language.code === currentLang);
  const initials = doctorName.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2);

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-5 md:px-10 pt-5 md:pt-6 pb-3 md:pb-5 shrink-0 border-b border-slate-200/60 bg-[var(--bg)]">
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Back" className="tap-target -ml-1 text-slate-700 hover:text-slate-900 cursor-pointer transition-colors">
            <ArrowLeft size={20} color="var(--ink)" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">{title}</h1>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{subtitle || "Cardiology · On Duty"}</p>
        </div>
      </div>

      {showSearch && (
        <div className="flex-1 max-w-xl mx-0 md:mx-6 w-full">
          <div className="relative flex items-center w-full">
            <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9.5 pr-4 py-2 text-xs md:text-sm rounded-xl bg-white border border-slate-200 shadow-2xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
        {onOpenLangModal && (
          <button type="button" onClick={onOpenLangModal} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-bold text-primary hover:bg-slate-50 transition-all cursor-pointer">
            <Globe size={14} />
            <span>{activeLanguage?.native || "English"}</span>
          </button>
        )}
        {right}
        <button type="button" onClick={onOpenProfile} title="Doctor profile" className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all cursor-pointer group">
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform bg-primary">{initials}</span>
          <span className="text-left hidden sm:block pr-1">
            <span className="text-xs font-bold text-slate-900 leading-none block">{doctorName.split(" ")[0]}</span>
            <span className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5 block">{t.doctorNav?.ai || "Clinical AI"} ready</span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default DoctorTopBar;
