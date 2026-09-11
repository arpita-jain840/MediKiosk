import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Clock, RotateCcw } from "lucide-react";

interface KioskSessionGuardProps {
  onReset: () => void;
  inactivityTimeoutSeconds?: number;
  countdownThresholdSeconds?: number;
}

export const KioskSessionGuard: React.FC<KioskSessionGuardProps> = ({
  onReset,
  inactivityTimeoutSeconds = 90,
  countdownThresholdSeconds = 15,
}) => {
  const [remainingTime, setRemainingTime] = useState(inactivityTimeoutSeconds);
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef<any>(null);

  const resetTimer = () => {
    setRemainingTime(inactivityTimeoutSeconds);
    setShowWarning(false);
  };

  useEffect(() => {
    const handleActivity = () => resetTimer();
    const events = ["mousedown", "mousemove", "keydown", "touchstart", "scroll"];

    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          // Teardown sensitive session
          clearInterval(timerRef.current);
          onReset();
          return 0;
        }
        if (prev <= countdownThresholdSeconds) {
          setShowWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [inactivityTimeoutSeconds, countdownThresholdSeconds, onReset]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-center gap-3 max-w-sm">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Clock size={20} className="animate-spin" style={{ animationDuration: "8s" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              DPDP Act 2023 · Privacy Guard
            </span>
          </div>
          <p className="text-xs text-slate-200 mt-0.5">
            Session resetting in <strong className="text-amber-400">{remainingTime}s</strong> to protect health privacy.
          </p>
        </div>
        <button
          onClick={resetTimer}
          className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
        >
          <RotateCcw size={12} />
          <span>I'm Here</span>
        </button>
      </div>
    </div>
  );
};
