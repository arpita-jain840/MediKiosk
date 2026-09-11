import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  Radio,
  Cpu,
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { getTranslations } from "../utils/i18n";

interface AIAssistantScreenProps {
  currentLang?: string;
  onOpenLangModal?: () => void;
  onOpenProfile?: () => void;
}

interface ChatMessage {
  from: "ai" | "user";
  text: string;
  model?: string;
  time?: string;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  currentLang = "en",
  onOpenLangModal,
  onOpenProfile,
}) => {
  const t = getTranslations(currentLang);
  const initialGreeting = t.aiGuide.initialGreeting;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "ai",
      text: initialGreeting,
      model: "Groq + Bhashini NMT",
      time: "Just now",
    },
  ]);

  const [isListening, setIsListening] = useState(false);
  const [isContinuous, setIsContinuous] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [typing, setTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [activeModel, setActiveModel] = useState("Groq + Bhashini NMT");

  // Stable references for async event handlers
  const isContinuousRef = useRef(isContinuous);
  const isSpeakingRef = useRef(isSpeaking);
  const typingRef = useRef(typing);
  const isMutedRef = useRef(isMuted);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const synthAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    isContinuousRef.current = isContinuous;
  }, [isContinuous]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    typingRef.current = typing;
  }, [typing]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (synthAudioRef.current) {
        synthAudioRef.current.pause();
      }
      setIsSpeaking(false);
    }
  }, [isMuted]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, isListening, isSpeaking]);

  // Update greeting when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].from === "ai") {
      setMessages([
        {
          from: "ai",
          text: t.aiGuide.initialGreeting,
          model: "Groq + Bhashini NMT",
          time: "Just now",
        },
      ]);
    }
  }, [currentLang, t.aiGuide.initialGreeting]);

  // Start speech recognition safely
  const startListening = useCallback(() => {
    if (isSpeakingRef.current || typingRef.current) return;
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (e) {
      // Recognition might already be running
      setIsListening(true);
    }
  }, []);

  // Stop speech recognition safely
  const stopListening = useCallback(() => {
    setIsListening(false);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {}
  }, []);

  // Text-To-Speech: Automatically speaks response aloud
  const speakVoiceResponse = useCallback(
    async (text: string, onDone?: () => void) => {
      if (isMutedRef.current) {
        if (onDone) onDone();
        return;
      }

      // Stop listening while AI speaks to avoid hearing itself
      stopListening();

      // Cancel any ongoing browser speech
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (synthAudioRef.current) {
        synthAudioRef.current.pause();
      }

      setIsSpeaking(true);

      const handleSpeechComplete = () => {
        setIsSpeaking(false);
        if (onDone) onDone();
      };

      // 1. Try Bhashini regional TTS if not English
      let bhashiniPlayed = false;
      if (currentLang !== "en") {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/bhashini/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              lang: currentLang,
              gender: "female",
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.audio_base64) {
              const audio = new Audio("data:audio/wav;base64," + data.audio_base64);
              synthAudioRef.current = audio;
              audio.onended = handleSpeechComplete;
              audio.onerror = handleSpeechComplete;
              await audio.play();
              bhashiniPlayed = true;
              return;
            }
          }
        } catch (err) {
          console.warn("[AIAssistant] Bhashini TTS notice, falling back to Web Speech:", err);
        }
      }

      // 2. High-quality Web SpeechSynthesis fallback
      if (!bhashiniPlayed && "speechSynthesis" in window) {
        // Strip markdown asterisks or symbols for clean speech
        const cleanSpeechText = text
          .replace(/[*_#`~[\]()]/g, "")
          .replace(/\s+/g, " ")
          .trim();

        const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
        utterance.lang = currentLang === "hi" ? "hi-IN" : "en-IN";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to pick an Indian English or Hindi voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            (currentLang === "hi" && (v.lang.includes("hi") || v.name.includes("India"))) ||
            (currentLang === "en" && (v.lang.includes("en-IN") || v.name.includes("India") || v.lang.includes("en-US")))
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = handleSpeechComplete;
        utterance.onerror = handleSpeechComplete;

        window.speechSynthesis.speak(utterance);
      } else {
        handleSpeechComplete();
      }
    },
    [currentLang, stopListening]
  );

  // Natural fallback rule engine
  const getGuidanceReply = useCallback(
    (q: string): string => {
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
          ? "बुखार, सर्दी, या सामान्य स्वास्थ्य समस्याओं के लिए कायाचिकित्सा ओपीडी कक्ष 2A और 2B में परामर्श लें। आप टोकन भी तुरंत बुक कर सकते हैं।"
          : "For fever, cough, or general illness, please visit the Kayachikitsa (General Medicine) OPD in Rooms 2A-2B.";
      }

      if (query.includes("token") || query.includes("टोकन") || query.includes("queue") || query.includes("लाइन")) {
        return currentLang === "hi"
          ? "आप 'Appointments & Token' टैब में जाकर अपनी पसंद के विभाग या डॉक्टर के लिए डिजिटल टोकन पर्ची तुरंत प्राप्त कर सकते हैं।"
          : "You can view the real-time queue or book a new OPD consultation token directly in the 'Appointments & Token' tab.";
      }

      if (query.includes("timing") || query.includes("time") || query.includes("समय") || query.includes("open")) {
        return currentLang === "hi"
          ? "एआईआईए ओपीडी पंजीकरण सोमवार से शनिवार सुबह 8:00 बजे से दोपहर 1:00 बजे तक खुला रहता है। चिकित्सक परामर्श दोपहर 2:00 बजे तक चलता है।"
          : "AIIA OPD registration is open Monday to Saturday from 8:00 AM to 1:00 PM. Physician consultations continue until 2:00 PM.";
      }

      return currentLang === "hi"
        ? "मैं आपकी सहायता के लिए यहाँ हूँ। आप मुझसे डॉक्टर के कमरे का स्थान, विभाग, ओपीडी समय या लक्षणों के बारे में पूछ सकते हैं।"
        : "I'm here to guide you at MediKiosk. You can ask me about doctor rooms, OPD departments, registration timings, or which specialist to see.";
    },
    [currentLang]
  );

  // Send message to Gemini 3.6 Flash & auto-speak result
  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || userInput).trim();
      if (!text) return;

      stopListening();
      setInterimTranscript("");
      setUserInput("");

      const userMsg: ChatMessage = {
        from: "user",
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setTyping(true);

      try {
        const response = await fetch("http://127.0.0.1:8000/api/assistant/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: text,
            lang: currentLang,
            history: messages.slice(-4),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.reply || getGuidanceReply(text);
          const model = data.model || "Groq + Bhashini NMT";

          setActiveModel(model);
          setTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              from: "ai",
              text: reply,
              model,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          // Automatically speak aloud!
          speakVoiceResponse(reply, () => {
            // After speaking finishes, auto-resume listening if continuous mode is on!
            if (isContinuousRef.current) {
              setTimeout(() => {
                if (isContinuousRef.current && !isSpeakingRef.current) {
                  startListening();
                }
              }, 400);
            }
          });
          return;
        }
      } catch (err) {
        console.warn("[AIAssistant] Backend API notice, falling back to local engine:", err);
      }

      // Fallback
      const fallbackReply = getGuidanceReply(text);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: fallbackReply,
          model: "MediKiosk Guide Engine",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      speakVoiceResponse(fallbackReply, () => {
        if (isContinuousRef.current) {
          setTimeout(() => {
            if (isContinuousRef.current && !isSpeakingRef.current) {
              startListening();
            }
          }, 400);
        }
      });
    },
    [userInput, stopListening, currentLang, messages, getGuidanceReply, speakVoiceResponse, startListening]
  );

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLang === "hi" ? "hi-IN" : "en-US";

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final.trim()) {
          setInterimTranscript("");
          handleSendMessage(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("[AIAssistant] SpeechRecognition error:", event?.error);
        if (event?.error === "not-allowed") {
          setIsListening(false);
          setIsContinuous(false);
        }
      };

      recognition.onend = () => {
        // Continuous mode auto-recovery: if active, not speaking, not typing, re-arm
        if (isContinuousRef.current && !isSpeakingRef.current && !typingRef.current) {
          setTimeout(() => {
            if (isContinuousRef.current && !isSpeakingRef.current && !typingRef.current) {
              try {
                recognition.start();
                setIsListening(true);
              } catch (e) {}
            }
          }, 350);
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentLang, handleSendMessage]);

  // Toggle Continuous Talk
  const handleVoiceToggle = () => {
    if (isListening || isSpeaking) {
      // User tapped to pause/stop voice talk
      setIsContinuous(false);
      isContinuousRef.current = false;
      stopListening();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (synthAudioRef.current) {
        synthAudioRef.current.pause();
      }
      setIsSpeaking(false);
    } else {
      // User tapped to start continuous hands-free talk
      setIsContinuous(true);
      isContinuousRef.current = true;
      startListening();
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full" style={{ background: "var(--bg)" }}>
      {/* Clean TopBar with Language, Mute Toggle, and Top-Right Profile */}
      <TopBar
        title={t.aiGuide.title}
        currentLang={currentLang}
        onOpenLangModal={onOpenLangModal}
        onOpenProfile={onOpenProfile}
        right={
          <div className="flex items-center gap-2">
            {/* Continuous Mode Toggle Badge */}
            <button
              onClick={() => {
                const next = !isContinuous;
                setIsContinuous(next);
                isContinuousRef.current = next;
                if (!next) {
                  stopListening();
                } else if (!isSpeaking) {
                  startListening();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                isContinuous
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
              title="Toggle Hands-Free Continuous Conversation"
            >
              <Radio size={13} className={isContinuous ? "animate-pulse text-emerald-600" : ""} />
              <span className="hidden sm:inline">Hands-Free:</span>
              <span>{isContinuous ? "ON" : "OFF"}</span>
            </button>

            {/* Mute/Unmute Audio Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                isMuted
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
              title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-primary" />}
            </button>
          </div>
        }
      />

      {/* Spacious Conversation Container */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-6 max-w-4xl mx-auto w-full space-y-6">
        {/* Model Transparency & Status Banner */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ background: "var(--primary)" }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {t.aiGuide.companionTitle}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <Cpu size={12} className="text-blue-600" />
                  <span>{activeModel}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  <span>🇮🇳 Bhashini Translation Layer</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isContinuous
                  ? "Continuous talk mode is active. Speak anytime without clicking."
                  : "Continuous talk is paused. Click the microphone to start."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                isListening
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : isSpeaking
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isListening
                    ? "bg-rose-500 animate-ping"
                    : isSpeaking
                    ? "bg-indigo-500 animate-pulse"
                    : "bg-emerald-500"
                }`}
              />
              {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready"}
            </span>
          </div>
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
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-500">
                        <Bot size={12} className="text-primary" />
                        {m.model || activeModel}
                      </span>
                      <button
                        onClick={() => speakVoiceResponse(m.text)}
                        className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={12} />
                        <span>{t.aiGuide.replay}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Thinking Indicator */}
          {typing && (
            <div className="flex gap-3 items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0"
                style={{ background: "var(--primary)" }}
              >
                AI
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-200" />
                <span className="font-semibold text-slate-600">
                  {activeModel} is generating response...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Live Audio Visualizer Banner (Speaking or Listening State) */}
        {(isListening || isSpeaking) && (
          <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-700/60 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg ${
                      isSpeaking
                        ? "bg-indigo-600 shadow-indigo-500/40"
                        : "bg-rose-500 shadow-rose-500/40"
                    }`}
                  >
                    {isSpeaking ? (
                      <Volume2 size={20} className="animate-pulse" />
                    ) : (
                      <Mic size={20} className="animate-pulse" />
                    )}
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isSpeaking ? "bg-indigo-400" : "bg-rose-400"
                      }`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                        isSpeaking ? "bg-indigo-500" : "bg-rose-500"
                      }`}
                    ></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {isSpeaking ? "MediKiosk Voice Output" : "Continuous Voice Talk"}
                    </h4>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        isSpeaking
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}
                    >
                      {isSpeaking ? "Auto-Speaking Result" : "Hands-Free Live"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    {isSpeaking
                      ? "Speaking answer aloud... mic will re-open automatically."
                      : interimTranscript
                      ? `"${interimTranscript}"`
                      : "Listening to you... Ask about doctor room, symptoms, or timings."}
                  </p>
                </div>
              </div>

              <button
                onClick={handleVoiceToggle}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isSpeaking ? <VolumeX size={13} /> : <MicOff size={13} />}
                <span>{isSpeaking ? "Stop Voice" : "Pause Mic"}</span>
              </button>
            </div>

            {/* Dynamic Sound Wave Frequency Bars */}
            <div className="h-12 flex items-center justify-center gap-1 px-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden">
              {[
                { h: "24px", d: "0.1s" },
                { h: "38px", d: "0.25s" },
                { h: "18px", d: "0.4s" },
                { h: "44px", d: "0.15s" },
                { h: "32px", d: "0.3s" },
                { h: "40px", d: "0.05s" },
                { h: "22px", d: "0.35s" },
                { h: "46px", d: "0.2s" },
                { h: "28px", d: "0.45s" },
                { h: "42px", d: "0.1s" },
                { h: "34px", d: "0.28s" },
                { h: "45px", d: "0.18s" },
                { h: "24px", d: "0.38s" },
                { h: "38px", d: "0.08s" },
                { h: "30px", d: "0.22s" },
                { h: "44px", d: "0.32s" },
                { h: "20px", d: "0.12s" },
                { h: "36px", d: "0.42s" },
                { h: "26px", d: "0.26s" },
              ].map((bar, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full animate-soundwave"
                  style={{
                    height: bar.h,
                    animationDelay: bar.d,
                    background: isSpeaking
                      ? "linear-gradient(180deg, #818cf8 0%, #38bdf8 50%, #c084fc 100%)"
                      : "linear-gradient(180deg, #34d399 0%, #38bdf8 50%, #6366f1 100%)",
                  }}
                />
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>
                {isSpeaking ? "🔊 AI Speaking" : "🎙️ Continuous conversation mode"}
              </span>
              <span>Say "Doctor room" or any medical question</span>
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
                : isSpeaking
                ? "bg-indigo-600 text-white animate-pulse ring-4 ring-indigo-200"
                : "bg-primary hover:bg-[#204b77] text-white active:scale-95"
            }`}
            title={
              isListening
                ? "Listening... Tap to pause hands-free talk"
                : isSpeaking
                ? "Speaking aloud... Tap to stop"
                : "Start Continuous Hands-Free Talk"
            }
          >
            {isSpeaking ? <Volume2 size={24} /> : isListening ? <Mic size={24} /> : <Mic size={24} />}
            {(isListening || isSpeaking) && (
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
                  : isSpeaking
                  ? "Speaking response aloud..."
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
