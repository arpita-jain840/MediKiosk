import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { SUPPORTED_LANGUAGES } from "../components/LanguageModal";
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
  const activeLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const initialGreeting =
    currentLang === "hi"
      ? "नमस्ते! मैं मेडिकियोस्क अस्पताल सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?"
      : "Hello! I am your hospital guide. How can I assist you today?";

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
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Update greeting when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].from === "ai") {
      setMessages([
        {
          from: "ai",
          text:
            currentLang === "hi"
              ? "नमस्ते! मैं मेडिकियोस्क अस्पताल सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?"
              : "Hello! I am your hospital guide. How can I assist you today?",
        },
      ]);
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
      setIsListening(false);
      return;
    }

    setIsListening(true);
    // Voice intake simulation for Kiosk
    setTimeout(() => {
      setIsListening(false);
      const sampleQuestion =
        currentLang === "hi"
          ? "डॉ. जॉन स्मिथ का कमरा कहाँ है?"
          : "Where is Dr. John Smith's OPD room?";
      handleSendMessage(sampleQuestion);
    }, 2800);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full" style={{ background: "var(--bg)" }}>
      {/* Clean TopBar with Language and Top-Right Profile */}
      <TopBar
        title="AI Hospital Guide"
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
            <span className="hidden sm:inline">{isMuted ? "Muted" : "Voice On"}</span>
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
                AIIA Smart Kiosk Companion
              </h3>
              <p className="text-xs text-slate-500">
                Supports speech & text in {activeLangObj.name} ({activeLangObj.native})
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Active Guide
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
                      <span>Replay Voice</span>
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
                <span className="ml-1 text-slate-500 font-medium">Listening & Thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

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
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 ${
              isListening
                ? "bg-rose-500 text-white animate-pulse ring-4 ring-rose-200"
                : "bg-primary hover:bg-[#204b77] text-white active:scale-95"
            }`}
            title={isListening ? "Listening... click to stop" : "Click to speak"}
          >
            <Mic size={24} />
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
                  ? (currentLang === "hi" ? "हम सुन रहे हैं..." : "Listening to your voice...")
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
