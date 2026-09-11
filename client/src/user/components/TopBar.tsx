import React from "react";
import { ArrowLeft, Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "./LanguageModal";

interface TopBarProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  currentLang?: string;
  onOpenLangModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  onBack,
  right,
  currentLang,
  onOpenLangModal,
}) => {
  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);

  return (
    <div
      className="flex items-center justify-between px-5 md:px-10 pt-5 md:pt-8 pb-3 md:pb-6 shrink-0"
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
        <h1 className="text-[19px] md:text-[24px] font-bold text-slate-900 truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {currentLang && onOpenLangModal && (
          <button
            onClick={onOpenLangModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-xs font-bold text-primary hover:bg-slate-50 hover:border-primary/40 transition-all cursor-pointer"
            title="Change Language (Bhashini AI)"
          >
            <Globe size={13} />
            <span>{activeLangObj ? activeLangObj.native : "English"}</span>
          </button>
        )}
        {right}
      </div>
    </div>
  );
};
