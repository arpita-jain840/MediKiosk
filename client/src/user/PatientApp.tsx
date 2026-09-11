import { useState } from "react";
import { NavBar } from "./components/NavBar";
import { LanguageModal } from "./components/LanguageModal";
import { HomeScreen } from "./screens/HomeScreen";
import { AppointmentsScreen } from "./screens/AppointmentsScreen";
import { RecordsScreen } from "./screens/RecordsScreen";
import { AIAssistantScreen } from "./screens/AIAssistantScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { ConfirmScreen } from "./screens/ConfirmScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { DEFAULT_PATIENT } from "./data/patientData";
import type { DoctorDirectoryItem, BlueprintSynthesisResult } from "./types";

export default function PatientApp() {
  const [tab, setTab] = useState("home");
  const [flow, setFlow] = useState<string | null>(null); // null | "result" | "confirm"
  const [lang, setLang] = useState("en");
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [bookedDoctor, setBookedDoctor] = useState<DoctorDirectoryItem | null>(null);
  const [blueprintResult, setBlueprintResult] = useState<BlueprintSynthesisResult | null>(null);

  let content;
  if (flow === "result") {
    content = (
      <ResultScreen
        blueprintResult={blueprintResult}
        onClose={() => setFlow(null)}
        onFindDoctors={() => setTab("appointments")}
      />
    );
  } else if (flow === "confirm") {
    content = (
      <ConfirmScreen
        doctor={bookedDoctor}
        onDone={() => {
          setFlow(null);
          setTab("appointments");
        }}
      />
    );
  } else if (tab === "appointments") {
    content = (
      <AppointmentsScreen
        currentLang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        onBookSuccess={(doc) => {
          setBookedDoctor(doc);
        }}
      />
    );
  } else if (tab === "records") {
    content = (
      <RecordsScreen
        currentLang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
      />
    );
  } else if (tab === "ai-assistant") {
    content = (
      <AIAssistantScreen
        currentLang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        onFinishCaseTaking={(res) => {
          setBlueprintResult(res);
          setFlow("result");
        }}
      />
    );
  } else if (tab === "profile") {
    content = (
      <ProfileScreen
        patient={DEFAULT_PATIENT}
        currentLang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
      />
    );
  } else {
    content = (
      <HomeScreen
        patient={DEFAULT_PATIENT}
        currentLang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        onOpenIntake={() => setTab("ai-assistant")}
        setTab={setTab}
      />
    );
  }

  return (
    <div
      className="w-full min-h-screen h-screen flex flex-col-reverse md:flex-row overflow-hidden"
      style={{
        background: "var(--bg)",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        :root {
          --bg: #f8fafc;
          --surface: #FFFFFF;
          --primary: #3368a0;
          --primary-tint: #e6eff5;
          --primary-light: #66a3bf;
          --ink: #0f172a;
          --ink-soft: #64748b;
          --border: rgba(51, 104, 160, 0.12);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .tap-target { min-width: 42px; min-height: 42px; display: flex; align-items: center; justify-content: center; }
        .dot {
          width: 7px; height: 7px; border-radius: 9999px; background: var(--ink-soft);
          opacity: 0.4; animation: dotPulse 1s infinite ease-in-out;
        }
        @keyframes dotPulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.85);} 40% { opacity: 1; transform: scale(1);} }
        @media (prefers-reduced-motion: reduce) {
          .dot { animation: none; opacity: 0.6; }
          * { transition: none !important; }
        }
        button:focus-visible, [role="button"]:focus-visible {
          outline: 2px solid var(--primary); outline-offset: 2px;
        }
      `}</style>

      {!flow && (
        <NavBar
          tab={tab}
          setTab={(t) => {
            setFlow(null);
            setTab(t);
          }}
          onOpenIntake={() => {
            setFlow(null);
            setTab("ai-assistant");
          }}
        />
      )}

      <main className="flex-1 flex flex-col overflow-y-auto relative h-full">
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
          {content}
        </div>
      </main>

      {isLangModalOpen && (
        <LanguageModal
          currentLang={lang}
          onSelectLanguage={(chosen) => {
            setLang(chosen);
            setIsLangModalOpen(false);
          }}
          onClose={() => setIsLangModalOpen(false)}
        />
      )}
    </div>
  );
}
