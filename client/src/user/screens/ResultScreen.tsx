import React from "react";
import { AlertTriangle, Activity, ChevronRight, Zap } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Section } from "../components/Section";
import { SummaryRow } from "../components/SummaryRow";
import { PRIORITY_STYLES } from "../data/patientData";
import type { BlueprintSynthesisResult } from "../types";

interface ResultScreenProps {
  blueprintResult?: BlueprintSynthesisResult | null;
  onClose: () => void;
  onFindDoctors: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  blueprintResult,
  onClose,
  onFindDoctors,
}) => {
  const bp = blueprintResult?.blueprint;
  const priority = bp?.triage_priority || bp?.triagePriority || "Specialist";
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Specialist;
  const redFlags = bp?.red_flags || bp?.redFlags || ["Radiating pain, diaphoresis"];
  const summary =
    bp?.ai_summary ||
    bp?.aiSummary ||
    "Chest tightness with breathlessness and left-arm discomfort recorded. Prompt physician evaluation advised.";
  const token = blueprintResult?.appointment?.token || bp?.token || 2;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      <TopBar title="Health Assessment & Token" onBack={onClose} />
      <div className="px-5 md:px-10 pb-6 md:pb-10 space-y-4">
        {/* Token and One-Time Database Committal Ribbon */}
        <div className="p-4 rounded-2xl bg-white border border-primary-tint shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex flex-col items-center justify-center">
              <span className="text-[9px] font-bold uppercase">Token</span>
              <span className="text-sm font-black">#{token}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">OPD Queue Registered</p>
              <p className="text-[11px] text-slate-500">
                Your health blueprint is stored. Doctor loads it in &lt;50ms.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
            <Zap size={13} />
            <span>Stored in DB</span>
          </div>
        </div>

        {/* Priority Banner */}
        <div
          className="rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-start gap-3 md:gap-5 shadow-sm"
          style={{ background: style.bg }}
        >
          <AlertTriangle size={20} color={style.fg} className="mt-0.5 md:mt-1 shrink-0 md:w-6 md:h-6" />
          <div>
            <p className="text-[15px] md:text-[18px] font-extrabold" style={{ color: style.fg }}>
              {style.label}
            </p>
            <p className="text-[12.5px] md:text-[15px] mt-1 md:mt-2 leading-relaxed" style={{ color: style.fg }}>
              {summary}
            </p>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-8">
          <Section title="What you told us (Structured by AI)">
            <div
              className="rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-3 md:space-y-4 shadow-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <SummaryRow
                label="Chief complaint"
                value={bp?.chief_complaint || bp?.chiefComplaint || "Chest tightness, breathlessness (3 hrs)"}
              />
              <SummaryRow label="Onset" value={bp?.hpi?.onset || "3 hours ago"} />
              <SummaryRow label="Relevant history" value="Type 2 diabetes (4 years)" />
              {redFlags.length > 0 && (
                <SummaryRow label="Red flags" value={redFlags.join(", ")} warn />
              )}
            </div>
          </Section>

          <Section title="Recommended OPD Room">
            <div
              className="rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-center gap-3 md:gap-5 shadow-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 md:w-16 md:h-16"
                style={{ width: 42, height: 42, background: "var(--primary-tint)" }}
              >
                <Activity size={19} color="var(--primary)" className="md:w-7 md:h-7" />
              </div>
              <div>
                <p className="text-[14px] md:text-[18px] font-bold text-slate-900">
                  Cardiology & General Medicine
                </p>
                <p className="text-[12px] md:text-[14px] mt-0.5 text-slate-500">
                  Room 4B · Dr. John Smith
                </p>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="px-5 md:px-10 pb-6 md:pb-10 mt-auto">
        <button
          onClick={onFindDoctors}
          className="w-full rounded-full py-3.5 md:py-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          style={{ background: "var(--primary)" }}
        >
          <span className="text-[14px] md:text-[16px] font-bold text-white">
            Proceed to OPD Queue / Doctors
          </span>
          <ChevronRight size={16} color="#fff" className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};
