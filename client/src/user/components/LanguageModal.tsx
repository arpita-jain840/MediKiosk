import React from "react";
import { Check, Globe, X } from "lucide-react";

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
];

interface LanguageModalProps {
  currentLang: string;
  onSelectLanguage: (langCode: string) => void;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  currentLang,
  onSelectLanguage,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-5 md:p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3368a0]/10 flex items-center justify-center text-[#3368a0]">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-900">
                Choose Language / भाषा चुनें
              </h3>
              <p className="text-[11px] text-slate-400">
                Powered by Bhashini National Language Mission
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-[#3368a0] text-white border-[#3368a0] shadow-sm scale-[1.02]"
                    : "bg-slate-50/70 hover:bg-white text-slate-800 border-slate-200/80 hover:border-[#3368a0]/40"
                }`}
              >
                <div>
                  <span className="text-sm font-bold block">{lang.native}</span>
                  <span
                    className={`text-[11px] block mt-0.5 ${
                      isSelected ? "text-white/80" : "text-slate-400"
                    }`}
                  >
                    {lang.name}
                  </span>
                </div>
                {isSelected && <Check size={16} className="text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 text-center">
          Audio prompts (TTS) & voice intake will adapt automatically to your selection.
        </div>
      </div>
    </div>
  );
};
