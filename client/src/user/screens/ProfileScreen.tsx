import React from "react";
import { ShieldCheck, Globe, ChevronRight, Pill, LogOut, Stethoscope } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Section } from "../components/Section";
import { SUPPORTED_LANGUAGES } from "../components/LanguageModal";
import { getTranslations } from "../utils/i18n";
import type { PatientProfile } from "../types";

interface ProfileScreenProps {
  patient: PatientProfile;
  currentLang?: string;
  onOpenLangModal?: () => void;
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  patient,
  currentLang = "en",
  onOpenLangModal,
  onBack,
}) => {
  const t = getTranslations(currentLang);
  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang);

  return (
    <div className="flex-1 overflow-y-auto px-5 md:px-10 pb-6 md:pb-10" style={{ background: "var(--bg)" }}>
      <TopBar
        title={t.profile.title}
        currentLang={currentLang}
        onOpenLangModal={onOpenLangModal}
        onBack={onBack}
        patientName={patient.name}
      />
      <div className="flex items-center gap-3.5 md:gap-6 mb-5 md:mb-8 mt-1">
        <div
          className="rounded-full flex items-center justify-center shrink-0 md:w-24 md:h-24 text-white font-extrabold text-[19px] md:text-[28px]"
          style={{ width: 58, height: 58, background: "var(--primary)" }}
        >
          {patient.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-[17px] md:text-[24px] font-extrabold text-slate-900">{patient.name}</p>
          <p className="text-[13px] md:text-[16px] text-slate-500">
            {patient.age} {t.profile.years} · {patient.gender}
          </p>
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div>
          <div
            className="rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-8 flex items-center gap-3 md:gap-4 shadow-sm"
            style={{ background: "var(--primary-tint)" }}
          >
            <ShieldCheck size={19} color="var(--primary)" className="md:w-6 md:h-6" />
            <div>
              <p className="text-[12px] md:text-[14px] font-bold" style={{ color: "var(--primary)" }}>
                {t.profile.abhaLinked}
              </p>
              <p className="text-[12px] md:text-[14px] text-slate-600 font-mono">{patient.abha}</p>
            </div>
          </div>

          <Section title={t.profile.allergies}>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {patient.allergies.map((a) => (
                <span
                  key={a}
                  className="rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[12.5px] md:text-[14px] font-semibold"
                  style={{ background: "#FAEAEA", color: "#C23B3B" }}
                >
                  {a}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Preferred Language (Bhashini AI)">
            <div
              onClick={onOpenLangModal}
              className="rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-white/80 transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2.5 md:gap-4">
                <Globe size={18} color="var(--primary)" className="md:w-5 md:h-5" />
                <div>
                  <span className="text-[13.5px] md:text-[15px] font-semibold text-slate-800">
                    {activeLang ? `${activeLang.name} (${activeLang.native})` : "English"}
                  </span>
                  <p className="text-[11px] text-primary font-medium">Bhashini Indic AI Enabled</p>
                </div>
              </div>
              <ChevronRight size={17} color="var(--ink-soft)" className="md:w-5 md:h-5" />
            </div>
          </Section>
        </div>

        <div>
          <Section title={t.profile.medications}>
            {patient.medications.map((m) => (
              <div
                key={m.name}
                className="rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex items-center gap-3 md:gap-5 mb-3 shadow-sm"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <Pill size={18} color="var(--primary)" className="md:w-6 md:h-6" />
                <div>
                  <p className="text-[13.5px] md:text-[16px] font-bold text-slate-900">{m.name}</p>
                  <p className="text-[12px] md:text-[14px] text-slate-500">{m.schedule}</p>
                </div>
              </div>
            ))}
          </Section>

          <Section title="Portal & Authentication">
            <div className="space-y-2">
              <button
                onClick={() => {
                  localStorage.setItem("medikiosk_role", "doctor");
                  window.location.href = "/doctor";
                }}
                className="w-full rounded-2xl p-3.5 flex items-center justify-between shadow-xs bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Stethoscope size={18} color="var(--primary)" />
                  <span className="text-xs md:text-sm font-bold text-slate-800">
                    {t.profile.switchDoctor}
                  </span>
                </div>
                <ChevronRight size={16} color="var(--ink-soft)" />
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("medikiosk_role");
                  window.location.href = "/login";
                }}
                className="w-full rounded-2xl p-3.5 flex items-center justify-between shadow-xs bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} className="text-rose-600" />
                  <span className="text-xs md:text-sm font-bold text-rose-700">
                    Logout / Change Role
                  </span>
                </div>
                <ChevronRight size={16} className="text-rose-400" />
              </button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};
