import { useEffect, useState } from "react";
import { NavBar } from "./components/NavBar";
import { LanguageModal } from "./components/LanguageModal";
import { HomeScreen } from "./screens/HomeScreen";
import { AppointmentsScreen } from "./screens/AppointmentsScreen";
import { RecordsScreen } from "./screens/RecordsScreen";
import { AIAssistantScreen } from "./screens/AIAssistantScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { ConfirmScreen } from "./screens/ConfirmScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { KioskSessionGuard } from "./components/KioskSessionGuard";
import { DEFAULT_PATIENT } from "./data/patientData";
import { PatientNotificationProvider, usePatientNotifications } from "./context/PatientNotificationContext";
import { Bell, X } from "lucide-react";

import type { DoctorDirectoryItem, BlueprintSynthesisResult } from "./types";

export default function PatientApp() {
  const [tab, setTab] = useState("home");
  const [flow, setFlow] = useState<string | null>(null); // null | "result" | "confirm"
  const [lang, setLang] = useState("en");
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [bookedDoctor, setBookedDoctor] = useState<DoctorDirectoryItem | null>(null);
  const [blueprintResult] = useState<BlueprintSynthesisResult | null>(null);
  const [patientId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("medikiosk_user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.patient_id || parsed.id || null;
    } catch {
      return null;
    }
  });

  const [currentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("medikiosk_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PATIENT,
          name: parsed.full_name || DEFAULT_PATIENT.name,
          abha: parsed.abha || DEFAULT_PATIENT.abha,
          bloodGroup: parsed.bloodGroup || DEFAULT_PATIENT.bloodGroup,
          allergies: parsed.allergies || DEFAULT_PATIENT.allergies,
          phone: parsed.phone || DEFAULT_PATIENT.phone,
          gender: parsed.gender || DEFAULT_PATIENT.gender,
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_PATIENT;
  });

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
        onOpenProfile={() => setTab("profile")}
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
        onOpenProfile={() => setTab("profile")}
      />
    );
  } else if (tab === "ai-assistant") {
    content = (
      <AIAssistantScreen
        currentLang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        onOpenProfile={() => setTab("profile")}
      />
    );
  } else if (tab === "profile") {
    content = (
      <ProfileScreen
        patient={currentUser}
        currentLang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        onBack={() => setTab("home")}
      />
    );
  } else {
    content = (
      <HomeScreen
        patient={currentUser}
        currentLang={lang}
        onOpenLangModal={() => setIsLangModalOpen(true)}
        onOpenIntake={() => setTab("ai-assistant")}
        setTab={setTab}
      />
    );
  }

  return (
    <PatientNotificationProvider patientId={patientId}>
      <PatientNotificationToast />
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
          currentLang={lang}
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

      {/* DPDP Act 2023 Public Kiosk Inactivity Auto-Reset */}
      <KioskSessionGuard
        onReset={() => {
          setFlow(null);
          setTab("home");
        }}
        inactivityTimeoutSeconds={90}
        countdownThresholdSeconds={15}
      />
      </div>
    </PatientNotificationProvider>
  );
}

function PatientNotificationToast() {
  const notificationContext = usePatientNotifications();
  const notification = notificationContext?.latestNotification;

  useEffect(() => {
    if (!notification) return;
    const timeoutId = window.setTimeout(() => notificationContext?.dismissLatestNotification(), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [notification, notificationContext]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-[80] w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-sky-200 bg-white p-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <Bell size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black text-slate-900">{notification.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{notification.message}</p>
          {notification.doctor_name && <p className="mt-2 text-[10px] font-bold text-slate-400">{notification.doctor_name}</p>}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => notificationContext.dismissLatestNotification()}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

