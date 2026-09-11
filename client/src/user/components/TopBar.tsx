import React from "react";
import { ArrowLeft } from "lucide-react";

interface TopBarProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onBack, right }) => {
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
        <h1 className="text-[19px] md:text-[24px] font-bold text-slate-900">
          {title}
        </h1>
      </div>
      {right}
    </div>
  );
};
