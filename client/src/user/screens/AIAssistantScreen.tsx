import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { getTranslations } from "../utils/i18n";

interface AIAssistantScreenProps {
  currentLang?: string;
  onOpenLangModal?: () => void;
  onOpenProfile?: () => void;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  currentLang = "en",
  onOpenLangModal,
  onOpenProfile,
}) => {
  const t = getTranslations(currentLang);
  const initialGreeting = t.aiGuide.initialGreeting;

  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([
    {
      from: "ai",
      text: initialGreeting,
    },
  ]);

  const [isListening, setIsListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, isListening]);

  // Update greeting when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].from === "ai") {
      setMessages([
        {
          from: "ai",
          text: t.aiGuide.initialGreeting,
        },
      ]);
    }
  }, [currentLang, t.aiGuide.initialGreeting]);

  // Web Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLang === "hi" ? "hi-IN" : "en-US";

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        setInterimTranscript(currentText);
        if (event.results[0].isFinal) {
          handleSendMessage(currentText);
          setIsListening(false);
          setInterimTranscript("");
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  // Bhashini TTS voice playback
  const playVoiceResponse = async (text: string) => {
    if (isMuted) return;
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
          await audio.play();
        }
      }
    } catch (err) {
      console.warn("[AIAssistant] TTS playback notice:", err);
    }
  };

  // Natural guidance response engine
  const getGuidanceReply = (q: string): string => {
    const query = q.toLowerCase();

    if (query.includes("cardio") || query.includes("heart") || query.includes("john") || query.includes("chest") || query.includes("दिल")) {
      return currentLang === "hi"
        ? "डॉ. जॉन स्मिथ (हृदय रोग एवं कायचिकित्सा) ओपीडी कक्ष 4B (प्रथम तल, मुख्य ब्लॉक) में उपलब्ध हैं। अनुमानित प्रतीक्षा समय लगभग 4 मिनट है।"
        : "Dr. John Smith (Cardiology & General Ayush) is currently consulting in OPD Room 4B, 1st Floor Main Block. Estimated wait time is ~4 minutes.";
    }

    if (query.includes("panchakarma") || query.includes("पंचकर्म") || query.includes("therapy")) {
      return currentLang === "hi"
        ? "पंचकर्म विभाग भूतल पर ईस्ट विंग (कमरा 101-106) में स्थित है। यह सुबह 8:30 बजे से दोपहर 3:00 बजे तक खुला रहता है।"
        : "The Panchakarma Therapy Department is located on the Ground Floor, East Wing (Rooms 101-106). Open from 8:30 AM to 3:00 PM.";
    }

    if (query.includes("fever") || query.includes("cough") || query.includes("बुखार") || query.includes("खांसी") || query.includes("headache") || query.includes("दर्द")) {
      return currentLang === "hi"
        ? "बुखार, सर्दी, या सामान्य स्वास्थ्य समस्याओं के लिए कायाचिकित्सा (जनरल मेडिसिन) ओपीडी कक्ष 2A और 2B में परामर्श लें। आप अपॉइंटमेंट टैब में जाकर तुरंत टोकन ले सकते हैं।"
        : "For fever, cough, or general illness, please visit the Kayachikitsa (General Medicine) OPD in Rooms 2A-2B. You can also generate a token directly from the Appointments section.";
    }

    if (query.includes("token") || query.includes("टोकन") || query.includes("queue") || query.includes("लाइन")) {
      return currentLang === "hi"
        ? "आप 'Appointments & Token' टैब में जाकर अपनी पसंद के विभाग या डॉक्टर के लिए डिजिटल टोकन पर्ची तुरंत प्राप्त कर सकते हैं।"
        : "You can view the real-time queue or book a new OPD consultation token directly in the 'Appointments & Token' tab.";
    }

    if (query.includes("timing") || query.includes("time") || query.includes("समय") || query.includes("open")) {
      return currentLang === "hi"
        ? "एआईआईए ओपीडी पंजीकरण सोमवार से शनिवार सुबह 8:00 बजे से दोपहर 1:00 बजे तक खुला रहता है। चिकित्सक परामर्श 2:00 बजे तक चलता है।"
        : "AIIA OPD registration is open Monday to Saturday from 8:00 AM to 1:00 PM. Consultations continue until 2:00 PM.";
    }

    if (query.includes("parche") || query.includes("prescription") || query.includes("पर्चा") || query.includes("report")) {
      return currentLang === "hi"
        ? "आप 'Records & Parche' टैब में जाकर अपने हाथ से लिखे पर्चे या लैब रिपोर्ट का फोटो खींचकर सीधे डिजिटल स्वास्थ्य रिकॉर्ड में जोड़ सकते हैं।"
        : "You can scan your paper prescription (*parche*) or upload lab reports in the 'Records & Parche' tab using our AI camera scanner.";
    }

    return currentLang === "hi"
      ? "मैं आपकी सहायता के लिए यहाँ हूँ। आप मुझसे किसी भी डॉक्टर के कमरे का स्थान, विभाग, ओपीडी समय या लक्षणों के बारे में पूछ सकते हैं।"
      : "I'm here to guide you. You can ask me about doctor rooms, OPD departments, consultation timings, or which specialist to see for your symptoms.";
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setUserInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const reply = getGuidanceReply(text);
      setMessages((prev) => [...prev, { from: "ai", text: reply }]);
      playVoiceResponse(reply);
    }, 600);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    setInterimTranscript("");
    setIsListening(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        return;
      } catch (e) {
        console.warn("Native speech recognition init error:", e);
      }
    }

    // Voice intake fallback simulation for Kiosk
    setTimeout(() => {
      setIsListening(false);
      const sampleQuestion =
        currentLang === "hi"
          ? "डॉ. जॉन स्मिथ का कमरा कहाँ है?"
          : "Where is Dr. John Smith's OPD room?";
      handleSendMessage(sampleQuestion);
    }, 3200);
  };


  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full" style={{ background: "var(--bg)" }}>
      {/* Clean TopBar with Language and Top-Right Profile */}
      <TopBar
        title={t.aiGuide.title}
        currentLang={currentLang}
        onOpenLangModal={onOpenLangModal}
        onOpenProfile={onOpenProfile}
        right={
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-primary" />}
          </button>
        }
      />

      {/* Spacious Conversation Container */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-6 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Friendly AI Intro Pill */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ background: "var(--primary)" }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t.aiGuide.companionTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.aiGuide.companionSub}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {t.aiGuide.activeGuide}
          </span>
        </div>

        {/* Message Stream */}
        <div className="space-y-4">
          {messages.map((m, idx) => {
            const isAi = m.from === "ai";
            return (
              <div
                key={idx}
                className={`flex gap-3 items-end ${isAi ? "justify-start" : "justify-end"}`}
              >
                {isAi && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs"
                    style={{ background: "var(--primary)" }}
                  >
                    AI
                  </div>
                )}
                
                <div
                  className={`max-w-xl p-4 rounded-3xl text-sm leading-relaxed ${
                    isAi
                      ? "bg-white border border-slate-200/90 text-slate-800 shadow-2xs rounded-bl-xs"
                      : "bg-primary text-white shadow-xs rounded-br-xs font-medium"
                  }`}
                >
                  <p>{m.text}</p>
                  {isAi && (
                    <button
                      onClick={() => playVoiceResponse(m.text)}
                      className="mt-2 text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 size={12} />
                      <span>{t.aiGuide.replay}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {typing && (
            <div className="flex gap-3 items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0"
                style={{ background: "var(--primary)" }}
              >
                AI
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-200" />
                <span className="ml-1 text-slate-500 font-medium">{t.aiGuide.listening}</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Voice Sound Wave Visualizer Banner (Dedicated for Talks) */}
        {isListening && (
          <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-700/60 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <Mic size={20} className="animate-pulse" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white tracking-tight">Medikiosk AI</h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live Voice Talk
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    {interimTranscript ? `"${interimTranscript}"` : "Listening to your voice... Speak naturally"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleVoiceToggle}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                Done Speaking
              </button>
            </div>

            {/* Sound Wave Frequency Bars */}
            <div className="h-14 flex items-center justify-center gap-1.5 px-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden">
              {[
                { h: "28px", d: "0.1s" },
                { h: "42px", d: "0.25s" },
                { h: "20px", d: "0.4s" },
                { h: "52px", d: "0.15s" },
                { h: "36px", d: "0.3s" },
                { h: "48px", d: "0.05s" },
                { h: "24px", d: "0.35s" },
                { h: "56px", d: "0.2s" },
                { h: "32px", d: "0.45s" },
                { h: "50px", d: "0.1s" },
                { h: "38px", d: "0.28s" },
                { h: "54px", d: "0.18s" },
                { h: "26px", d: "0.38s" },
                { h: "46px", d: "0.08s" },
                { h: "34px", d: "0.22s" },
                { h: "50px", d: "0.32s" },
                { h: "22px", d: "0.12s" },
                { h: "40px", d: "0.42s" },
                { h: "28px", d: "0.26s" },
              ].map((bar, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full animate-soundwave"
                  style={{
                    height: bar.h,
                    animationDelay: bar.d,
                    background: "linear-gradient(180deg, #34d399 0%, #38bdf8 50%, #6366f1 100%)",
                  }}
                />
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>🎙️ Voice talk mode active</span>
              <span>Say "Doctor room" or any question</span>
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {t.aiGuide.suggestedHeader}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.aiGuide.chips.map((chipText, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(chipText)}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-primary hover:border-primary/40 transition-all cursor-pointer shadow-2xs"
              >
                {chipText}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Voice & Text Input Bar */}
      <div className="shrink-0 p-4 md:p-6 bg-white border-t border-slate-200/80 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          
          {/* Animated Large Microphone Button for Kiosk */}
          <button
            onClick={handleVoiceToggle}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 relative ${
              isListening
                ? "bg-rose-500 text-white animate-pulse ring-4 ring-rose-200"
                : "bg-primary hover:bg-[#204b77] text-white active:scale-95"
            }`}
            title={isListening ? "Listening... click to stop" : "Click to speak"}
          >
            <Mic size={24} />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-ping" />
            )}
          </button>


          {/* Text Input Box */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={
                isListening
                  ? t.aiGuide.listening
                  : t.aiGuide.placeholder
              }
              className="w-full pl-5 pr-12 py-3.5 text-xs md:text-sm rounded-2xl bg-slate-50 border border-slate-200/90 focus:outline-none focus:border-primary focus:bg-white text-slate-800 placeholder:text-slate-400 shadow-inner"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!userInput.trim()}
              className="absolute right-2.5 p-2 rounded-xl bg-primary hover:bg-[#204b77] disabled:opacity-30 disabled:pointer-events-none text-white transition-colors cursor-pointer"
            >
              <Send size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
