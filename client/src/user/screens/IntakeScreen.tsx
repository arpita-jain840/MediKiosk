import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Sparkles, ChevronRight, Volume2, Globe } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { LanguageModal, SUPPORTED_LANGUAGES } from "../components/LanguageModal";
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
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([
    {
      from: "ai",
      text: lang === "hi" ? INTAKE_SCRIPT[0].q.hi : INTAKE_SCRIPT[0].q.en,
    },
  ]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [playingTtsIndex, setPlayingTtsIndex] = useState<number | null>(null);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [userInputText, setUserInputText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Translate active question dynamically if a non-English/non-Hindi Indic language is chosen
  useEffect(() => {
    let isCancelled = false;
    async function translateQuestionForLang() {
      if (done || messages.length === 0) return;
      const currentQEnglish = INTAKE_SCRIPT[step]?.q.en;
      if (!currentQEnglish) return;

      if (lang === "en") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { from: "ai", text: currentQEnglish };
          return next;
        });
      } else if (lang === "hi") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { from: "ai", text: INTAKE_SCRIPT[step]?.q.hi };
          return next;
        });
      } else {
        // Use Bhashini NMT for regional translation (Bengali, Tamil, Telugu, Marathi, etc.)
        try {
          const res = await fetch("http://127.0.0.1:8000/api/bhashini/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: currentQEnglish,
              source_lang: "en",
              target_lang: lang,
            }),
          });
          if (res.ok && !isCancelled) {
            const data = await res.json();
            if (data.translated_text) {
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { from: "ai", text: data.translated_text };
                return next;
              });
            }
          }
        } catch (e) {
          console.warn("[Bhashini NMT] Translation error:", e);
        }
      }
    }

    translateQuestionForLang();
    return () => {
      isCancelled = true;
    };
  }, [lang, step]);

  const completeness = Math.min(100, Math.round(((step) / INTAKE_SCRIPT.length) * 100));

  // Audio Guidance via Bhashini TTS (Voice Accessibility for low-literacy / elderly)
  const handlePlayTts = async (text: string, index: number) => {
    setPlayingTtsIndex(index);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/bhashini/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lang: lang === "en" ? "hi" : lang,
          gender: "female",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audio_base64) {
          const audio = new Audio("data:audio/wav;base64," + data.audio_base64);
          audio.onended = () => setPlayingTtsIndex(null);
          audio.onerror = () => setPlayingTtsIndex(null);
          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn("[Bhashini TTS] Audio playback error:", e);
    }
    setPlayingTtsIndex(null);
  };

  function sendAnswer(answerText?: string) {
    if (done) return;
    const current = INTAKE_SCRIPT[step];
    const textToSend =
      answerText ||
      userInputText ||
      (lang === "hi" ? current.a.hi : current.a.en);

    setMessages((m) => [...m, { from: "user", text: textToSend }]);
    setUserInputText("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const nextStep = step + 1;
      if (nextStep < INTAKE_SCRIPT.length) {
        const nextQ =
          lang === "hi"
            ? INTAKE_SCRIPT[nextStep].q.hi
            : INTAKE_SCRIPT[nextStep].q.en;
        setMessages((m) => [...m, { from: "ai", text: nextQ }]);
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
          <button
            onClick={() => setIsLangModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs text-xs font-bold text-primary hover:bg-slate-50 transition-colors cursor-pointer"
            title="Choose Language (Bhashini AI)"
          >
            <Globe size={13} />
            <span>{activeLangObj.native}</span>
          </button>
        }
      />

      <div className="w-full max-w-4xl mx-auto px-5 md:px-10 pb-3 md:pb-6">
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

      <div className="flex-1 overflow-y-auto px-5 md:px-10 py-2 md:py-4 space-y-3 md:space-y-5 w-full max-w-4xl mx-auto">
        {messages.map((m, i) => (
          <div key={i} className={"flex " + (m.from === "user" ? "justify-end" : "justify-start")}>
            <div className="flex items-end gap-2 max-w-[85%] md:max-w-[75%]">
              <div
                className="rounded-2xl md:rounded-3xl px-4 py-2.5 md:px-6 md:py-4 text-[13.5px] md:text-[15px] leading-relaxed shadow-sm flex-1"
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

              {/* Bhashini TTS Audio Button for Elderly/Low-literacy */}
              {m.from === "ai" && (
                <button
                  onClick={() => handlePlayTts(m.text, i)}
                  className={`p-2 rounded-full border transition-all cursor-pointer shrink-0 ${
                    playingTtsIndex === i
                      ? "bg-primary text-white border-primary animate-pulse"
                      : "bg-white text-slate-500 hover:text-primary border-slate-200 hover:bg-slate-50"
                  }`}
                  title="Listen in your language (Bhashini TTS)"
                  aria-label="Play audio"
                >
                  <Volume2 size={15} />
                </button>
              )}
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
        className="w-full max-w-4xl mx-auto px-5 md:px-10 pt-2 pb-5 md:py-6 shrink-0 bg-white md:bg-transparent shadow-[0_-10px_20px_rgba(0,0,0,0.02)] md:shadow-none"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {isSynthesizing ? (
          <div className="py-4 px-5 rounded-2xl bg-white border border-primary-tint flex items-center justify-center gap-3 text-slate-700 shadow-xs">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <div className="space-y-2.5">
            {/* Guided Suggestion Pill for easy single-tap answering */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              <button
                onClick={() => sendAnswer(lang === "hi" ? INTAKE_SCRIPT[step].a.hi : INTAKE_SCRIPT[step].a.en)}
                className="shrink-0 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-primary/40 transition-colors shadow-xs cursor-pointer truncate max-w-xs"
              >
                👉 {lang === "hi" ? INTAKE_SCRIPT[step].a.hi : INTAKE_SCRIPT[step].a.en}
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <input
                type="text"
                value={userInputText}
                onChange={(e) => setUserInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendAnswer();
                }}
                placeholder={
                  lang === "hi"
                    ? "अपना जवाब यहाँ लिखें या बोलें..."
                    : "Type or speak your answer in your language..."
                }
                className="flex-1 rounded-full px-4 py-3 md:px-6 md:py-4 text-[13px] md:text-[15px] shadow-sm bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => {
                  // Simulate or trigger Indic voice speech capture
                  sendAnswer(lang === "hi" ? INTAKE_SCRIPT[step].a.hi : INTAKE_SCRIPT[step].a.en);
                }}
                className="tap-target flex items-center justify-center rounded-full shrink-0 hover:bg-teal-100 transition-colors md:w-14 md:h-14 cursor-pointer"
                style={{ width: 42, height: 42, background: "var(--primary-tint)" }}
                aria-label="Bhashini Voice Input"
                title="Speak in your language (Bhashini Indic ASR)"
              >
                <Mic size={17} color="var(--primary)" className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => sendAnswer()}
                className="tap-target flex items-center justify-center rounded-full shrink-0 hover:opacity-90 transition-opacity md:w-14 md:h-14 shadow-md cursor-pointer"
                style={{ width: 42, height: 42, background: "var(--primary)" }}
                aria-label="Send answer"
              >
                <Send size={16} color="#fff" className="md:w-5 md:h-5 ml-1" />
              </button>
            </div>
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

      {/* Language Selection Modal */}
      {isLangModalOpen && (
        <LanguageModal
          currentLang={lang}
          onSelectLanguage={(code) => setLang(code)}
          onClose={() => setIsLangModalOpen(false)}
        />
      )}
    </div>
  );
};
