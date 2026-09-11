import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Send,
  Sparkles,
  Volume2,
  Globe,
  ChevronRight,
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { SUPPORTED_LANGUAGES } from "../components/LanguageModal";
import { INTAKE_SCRIPT } from "../data/patientData";
import type { BlueprintSynthesisResult } from "../types";

interface AIAssistantScreenProps {
  currentLang?: string;
  onOpenLangModal?: () => void;
  onFinishCaseTaking: (result: BlueprintSynthesisResult | null) => void;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  currentLang = "en",
  onOpenLangModal,
  onFinishCaseTaking,
}) => {
  const [mode, setMode] = useState<"intake" | "general">("intake");
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([
    {
      from: "ai",
      text:
        currentLang === "hi"
          ? "नमस्ते! मैं मेडिकियोस्क एआई सहायक हूँ। आपको क्या स्वास्थ्य समस्या या लक्षण महसूस हो रहे हैं? बोलें या लिखें।"
          : "Hello! I am your MediKiosk AI Assistant. What health symptoms or concerns are you experiencing today? You can speak or type.",
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [step, setStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [playingTtsIndex, setPlayingTtsIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Translate active question dynamically if non-English/non-Hindi Indic language is chosen
  useEffect(() => {
    let isCancelled = false;
    async function translateQuestionForLang() {
      if (isDone || messages.length === 0 || mode !== "intake") return;
      const currentQEnglish = INTAKE_SCRIPT[step]?.q.en;
      if (!currentQEnglish) return;

      if (currentLang === "en") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { from: "ai", text: currentQEnglish };
          return next;
        });
      } else if (currentLang === "hi") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { from: "ai", text: INTAKE_SCRIPT[step]?.q.hi };
          return next;
        });
      } else {
        // Use Bhashini NMT for regional translation
        try {
          const res = await fetch("http://127.0.0.1:8000/api/bhashini/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: currentQEnglish,
              source_lang: "en",
              target_lang: currentLang,
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
  }, [currentLang, step, mode]);

  // Bhashini TTS Voice Synthesis (female Indic voice)
  const handlePlayTts = async (text: string, index: number) => {
    setPlayingTtsIndex(index);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/bhashini/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lang: currentLang === "en" ? "hi" : currentLang,
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
      console.warn("[Bhashini TTS] Playback error:", e);
    }
    setPlayingTtsIndex(null);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    // Simulate voice listening cycle with auto-completion for kiosk
    setTimeout(() => {
      setIsListening(false);
      const current = INTAKE_SCRIPT[step];
      const answer = currentLang === "hi" ? current?.a.hi : current?.a.en;
      sendAnswer(answer || "I have chest discomfort with sweating since morning.");
    }, 2500);
  };

  const sendAnswer = (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim() || isDone) return;

    setMessages((m) => [...m, { from: "user", text }]);
    setUserInput("");
    setTyping(true);

    if (mode === "intake") {
      setTimeout(() => {
        setTyping(false);
        const nextStep = step + 1;
        if (nextStep < INTAKE_SCRIPT.length) {
          const nextQ =
            currentLang === "hi"
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
                currentLang === "hi"
                  ? "धन्यवाद! आपका पूरा नैदानिक इतिहास दर्ज हो चुका है। डॉक्टर के लिए ब्लूप्रिंट तैयार करने हेतु नीचे बटन दबाएँ।"
                  : "Thank you! Sufficient clinical details gathered. Press below to synthesize your 1-page doctor blueprint.",
            },
          ]);
          setIsDone(true);
        }
      }, 700);
    } else {
      // General OPD queries
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            from: "ai",
            text:
              currentLang === "hi"
                ? "ओपीडी कक्ष 4B में डॉ. जॉन स्मिथ उपलब्ध हैं। ब्लड टेस्ट के लिए 10-12 घंटे का उपवास आवश्यक है। आप टोकन बुक कर सकते हैं।"
                : "Dr. John Smith is available in OPD Room 4B. For fasting blood sugar tests, 10-12 hours overnight fasting is advised.",
          },
        ]);
      }, 700);
    }
  };

  const handleSynthesizeBlueprint = async () => {
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
        onFinishCaseTaking(data);
        return;
      }
    } catch (err) {
      console.warn("[AIAssistantScreen] Server synthesis error, proceeding:", err);
    } finally {
      setIsSynthesizing(false);
    }
    onFinishCaseTaking(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full" style={{ background: "var(--bg)" }}>
      <TopBar
        title="AI Voice Assistant & Clinical Case-Taking"
        currentLang={currentLang}
        onOpenLangModal={onOpenLangModal}
        right={
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setMode("intake")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "intake"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Case-Taking Intake
            </button>
            <button
              onClick={() => setMode("general")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "general"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              General OPD Chat
            </button>
          </div>
        }
      />

      {/* Main Conversation Container */}
      <div className="flex-1 overflow-y-auto px-5 md:px-10 py-4 max-w-4xl mx-auto w-full space-y-4">
        
        {/* Mode & Accessibility Guidance Banner */}
        <div className="p-3.5 rounded-2xl bg-white border border-primary/20 shadow-2xs flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">
              {mode === "intake"
                ? "Bhashini Voice Intake Active · Speaking in " + activeLangObj.native
                : "General Hospital OPD Assistant Active"}
            </span>
          </div>

          <button
            onClick={onOpenLangModal}
            className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
          >
            <Globe size={13} />
            <span>{activeLangObj.native}</span>
          </button>
        </div>

        {/* Message Bubble Stream */}
        <div className="space-y-4 pt-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={"flex " + (m.from === "user" ? "justify-end" : "justify-start")}
            >
              <div className="flex items-end gap-2 max-w-[85%] md:max-w-[75%]">
                <div
                  className={`rounded-3xl px-5 py-3.5 text-sm md:text-base leading-relaxed shadow-2xs ${
                    m.from === "user"
                      ? "bg-primary text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>

                {/* Speaker Audio Playback (Bhashini TTS) */}
                {m.from === "ai" && (
                  <button
                    onClick={() => handlePlayTts(m.text, i)}
                    className={`p-2 rounded-full border transition-all cursor-pointer shrink-0 ${
                      playingTtsIndex === i
                        ? "bg-primary text-white border-primary animate-pulse"
                        : "bg-white text-slate-500 hover:text-primary border-slate-200 hover:bg-slate-50"
                    }`}
                    title="Listen in your language (Bhashini TTS Voice)"
                    aria-label="Play audio"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-2xs flex items-center gap-1.5">
                <span className="dot" />
                <span className="dot" style={{ animationDelay: "0.2s" }} />
                <span className="dot" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Large Voice Microphone & Interactive Control Dock */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-200/80 shrink-0 shadow-lg">
        <div className="max-w-4xl mx-auto w-full space-y-3">
          
          {/* Quick Suggestion Pills */}
          {!isDone && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {mode === "intake" ? (
                <button
                  onClick={() =>
                    sendAnswer(
                      currentLang === "hi"
                        ? INTAKE_SCRIPT[step]?.a.hi
                        : INTAKE_SCRIPT[step]?.a.en
                    )
                  }
                  className="shrink-0 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer truncate max-w-sm"
                >
                  👉 {currentLang === "hi" ? INTAKE_SCRIPT[step]?.a.hi : INTAKE_SCRIPT[step]?.a.en}
                </button>
              ) : (
                <>
                  {["OPD Timings", "Fasting Requirements", "Panchakarma Therapies"].map((q) => (
                    <button
                      key={q}
                      onClick={() => sendAnswer(q)}
                      className="shrink-0 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Voice Mic + Text Input Area */}
          <div className="flex items-center gap-3">
            {/* Primary Large Animated Voice Wave Microphone */}
            <button
              onClick={handleVoiceToggle}
              className={`relative flex items-center justify-center rounded-2xl shrink-0 transition-all cursor-pointer shadow-md ${
                isListening
                  ? "w-16 h-16 bg-rose-500 text-white animate-pulse ring-4 ring-rose-200"
                  : "w-14 h-14 bg-primary hover:bg-[#204b77] text-white hover:scale-105 active:scale-95"
              }`}
              title="Speak in your native language (Bhashini Indic Voice)"
            >
              <Mic size={24} />
              {isListening && (
                <span className="absolute -top-2 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
              )}
            </button>

            {/* Natural Text input */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendAnswer();
                }}
                placeholder={
                  isListening
                    ? "Listening to speech in " + activeLangObj.native + "..."
                    : currentLang === "hi"
                    ? "बोलें या यहाँ अपना जवाब लिखें..."
                    : "Speak or type your clinical symptom / query..."
                }
                className="w-full px-4 py-3.5 md:py-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs placeholder:text-slate-400"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={() => sendAnswer()}
              className="p-3.5 md:p-4 rounded-2xl bg-primary hover:bg-[#204b77] text-white transition-all shadow-xs cursor-pointer shrink-0"
              aria-label="Send answer"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Finish & Synthesize Blueprint Button */}
          {(isDone || step >= 2) && (
            <button
              onClick={handleSynthesizeBlueprint}
              disabled={isSynthesizing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#3368a0] to-[#1c436b] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles size={16} />
              <span>
                {isSynthesizing
                  ? "Storing 1-Page Blueprint in PostgreSQL..."
                  : "Finish Intake & Generate Doctor Clinical Blueprint (तुरंत ब्लूप्रिंट बनाएँ)"}
              </span>
              <ChevronRight size={16} />
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
