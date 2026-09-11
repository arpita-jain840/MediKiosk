import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Sparkles, ChevronRight } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { INTAKE_SCRIPT } from "../data/patientData";
import type { BlueprintSynthesisResult } from "../types";

interface IntakeScreenProps {
  onClose: () => void;
  onFinish: (result: BlueprintSynthesisResult | null) => void;
  lang: string;
  setLang: (lang: string) => void;
}

export const IntakeScreen: React.FC<IntakeScreenProps> = ({
  onClose,
  onFinish,
  lang,
  setLang,
}) => {
  const [messages, setMessages] = useState([
    { from: "ai", text: INTAKE_SCRIPT[0].q[lang as keyof typeof INTAKE_SCRIPT[0]["q"]] },
  ]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const completeness = Math.min(100, Math.round(((step) / INTAKE_SCRIPT.length) * 100));

  function sendAnswer() {
    if (done) return;
    const current = INTAKE_SCRIPT[step];
    setMessages((m) => [...m, { from: "user", text: current.a[lang as keyof typeof current["a"]] }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const nextStep = step + 1;
      if (nextStep < INTAKE_SCRIPT.length) {
        setMessages((m) => [...m, { from: "ai", text: INTAKE_SCRIPT[nextStep].q[lang as keyof typeof INTAKE_SCRIPT[0]["q"]] }]);
        setStep(nextStep);
      } else {
        setMessages((m) => [
          ...m,
          {
            from: "ai",
            text:
              lang === "en"
                ? "Thank you. I have enough clinical details to generate your physician-ready Health Blueprint."
                : "धन्यवाद। डॉक्टर के लिए आपका संपूर्ण स्वास्थ्य सारांश तैयार किया जा रहा है।",
          },
        ]);
        setDone(true);
      }
    }, 600);
  }

  async function handleFinish() {
    setIsSynthesizing(true);
    const intakeSummary = messages
      .map((m) => `${m.from === "user" ? "Patient" : "Kiosk AI"}: ${m.text}`)
      .join("\n");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/clinical/generate-blueprint?patient_id=227107b6-d738-4acd-ad21-8c88430acbd9&intake_narration=${encodeURIComponent(intakeSummary)}`,
        { method: "POST" }
      );
      if (res.ok) {
        const data: BlueprintSynthesisResult = await res.json();
        onFinish(data);
        return;
      }
    } catch (err) {
      console.warn("[IntakeScreen] Server synthesis error, proceeding to results:", err);
    } finally {
      setIsSynthesizing(false);
    }
    onFinish(null);
  }

  return (
    <div className="flex-1 flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <TopBar
        title={lang === "en" ? "Voice & Touch Clinical Intake" : "स्वास्थ्य जाँच (आवाज और स्पर्श)"}
        onBack={onClose}
        right={
          <div
            className="flex rounded-full overflow-hidden shadow-sm"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            {["en", "hi"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-2.5 md:px-4 py-1 md:py-1.5 text-[11.5px] md:text-[13px] transition-colors cursor-pointer"
                style={{
                  background: lang === l ? "var(--primary)" : "transparent",
                  color: lang === l ? "#fff" : "var(--ink-soft)",
                  fontWeight: 700,
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        }
      />

      <div className="px-5 md:px-10 pb-3 md:pb-6">
        <div className="flex items-center justify-between mb-1.5 md:mb-2.5">
          <span className="text-[11.5px] md:text-[13px]" style={{ color: "var(--ink-soft)" }}>
            {lang === "en" ? "Intake completeness" : "जाँच प्रगति"}
          </span>
          <span className="text-[11.5px] md:text-[13px] font-bold" style={{ color: "var(--primary)" }}>
            {completeness}%
          </span>
        </div>
        <div className="rounded-full h-1.5 md:h-2 overflow-hidden" style={{ background: "var(--primary-tint)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${completeness}%`, background: "var(--primary)" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-10 py-2 md:py-4 space-y-3 md:space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={"flex " + (m.from === "user" ? "justify-end" : "justify-start")}>
            <div
              className="max-w-[80%] md:max-w-[70%] rounded-2xl md:rounded-3xl px-4 py-2.5 md:px-6 md:py-4 text-[13.5px] md:text-[15px] leading-relaxed shadow-sm"
              style={
                m.from === "user"
                  ? { background: "var(--primary)", color: "#fff", borderBottomRightRadius: 4 }
                  : {
                      background: "var(--surface)",
                      color: "var(--ink)",
                      border: "1px solid var(--border)",
                      borderBottomLeftRadius: 4,
                    }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl md:rounded-3xl px-4 py-3 md:px-6 md:py-4 flex gap-1 shadow-sm"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderBottomLeftRadius: 4,
              }}
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="dot md:w-2 md:h-2"
                  style={{ animationDelay: `${d * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div
        className="px-5 md:px-10 pt-2 pb-5 md:py-6 shrink-0 bg-white md:bg-transparent shadow-[0_-10px_20px_rgba(0,0,0,0.02)] md:shadow-none"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {isSynthesizing ? (
          <div className="py-4 px-5 rounded-2xl bg-white border border-[#c8dfdb] flex items-center justify-center gap-3 text-slate-700 shadow-xs">
            <div className="w-5 h-5 border-2 border-[#3368a0] border-t-transparent rounded-full animate-spin" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900">
                {lang === "en" ? "AI Engine Synthesizing Health Blueprint..." : "AI स्वास्थ्य ब्लूप्रिंट तैयार कर रहा है..."}
              </p>
              <p className="text-[11px] text-slate-500">
                {lang === "en"
                  ? "Storing 1-page structured profile in PostgreSQL (Doctor will view instantly in <50ms)"
                  : "डेटाबेस में सहेजा जा रहा है — डॉक्टर बिना देरी तुरंत देख पाएंगे"}
              </p>
            </div>
          </div>
        ) : !done ? (
          <div className="flex items-center gap-2 md:gap-4 mt-3">
            <div
              className="flex-1 rounded-full px-4 py-3 md:px-6 md:py-4 text-[13px] md:text-[15px] truncate shadow-sm cursor-text"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--ink-soft)",
              }}
            >
              {INTAKE_SCRIPT[step].a[lang as keyof typeof INTAKE_SCRIPT[0]["a"]]}
            </div>
            <button
              className="tap-target flex items-center justify-center rounded-full shrink-0 hover:bg-teal-100 transition-colors md:w-14 md:h-14 cursor-pointer"
              style={{ width: 42, height: 42, background: "var(--primary-tint)" }}
              aria-label="Voice input"
            >
              <Mic size={17} color="var(--primary)" className="md:w-6 md:h-6" />
            </button>
            <button
              onClick={sendAnswer}
              className="tap-target flex items-center justify-center rounded-full shrink-0 hover:opacity-90 transition-opacity md:w-14 md:h-14 shadow-md cursor-pointer"
              style={{ width: 42, height: 42, background: "var(--primary)" }}
              aria-label="Send answer"
            >
              <Send size={16} color="#fff" className="md:w-5 md:h-5 ml-1" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleFinish}
            className="w-full rounded-full py-3.5 md:py-4 mt-3 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            style={{ background: "var(--primary)" }}
          >
            <Sparkles size={16} color="#fff" />
            <span className="text-[14px] md:text-[16px] font-bold text-white">
              {lang === "en" ? "Analyze & Generate Health Profile" : "स्वास्थ्य प्रोफाइल तैयार करें"}
            </span>
            <ChevronRight size={16} color="#fff" className="md:w-5 md:h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
