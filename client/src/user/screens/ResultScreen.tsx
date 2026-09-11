import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Activity,
  ChevronRight,
  Zap,
  QrCode,
  Download,
  Printer,
  Radio,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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
  const priority = bp?.triage_priority || bp?.triagePriority || "Routine";
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Routine;
  const redFlags = bp?.red_flags || bp?.redFlags || [];
  const summary =
    bp?.ai_summary ||
    bp?.aiSummary ||
    "Intake recorded at MediKiosk terminal. Clinical blueprint committed to database.";

  const token = blueprintResult?.appointment?.token || bp?.token || 1;
  const patientId = blueprintResult?.profileId || "227107b6-d738-4acd-ad21-8c88430acbd9";


  // Live WebSocket queue state
  const [queueStatus, setQueueStatus] = useState<string>("waiting");
  const [activeCallRoom, setActiveCallRoom] = useState<string>("Room 4B");
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [isExportingFhir, setIsExportingFhir] = useState<boolean>(false);

  // QR Code payload (Structured for Doctor Cockpit Scanner)
  const qrData = JSON.stringify({
    system: "MediKiosk",
    token: token,
    patientId: patientId,
    room: "Room 4B",
    priority: priority,
    generatedAt: new Date().toISOString(),
  });

  // Subscribe to live WebSocket queue updates
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket("ws://127.0.0.1:8000/ws/queue");
      ws.onopen = () => setIsLiveConnected(true);
      ws.onclose = () => setIsLiveConnected(false);
      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (data.type === "QUEUE_ADVANCED" || data.type === "QUEUE_UPDATED") {
            if (data.token === token) {
              setQueueStatus(data.status);
              if (data.room) setActiveCallRoom(data.room);
            }
          }
        } catch {
          // ignore heartbeat / ping
        }
      };
    } catch {
      setIsLiveConnected(false);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [token]);

  // Export ABDM FHIR JSON Bundle
  const handleExportFhir = async () => {
    setIsExportingFhir(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/patient/${patientId}/fhir`);
      if (res.ok) {
        const bundle = await res.json();
        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ABDM_FHIR_Bundle_Token_${token}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.warn("Error exporting FHIR bundle:", err);
    } finally {
      setIsExportingFhir(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      <TopBar title="Health Assessment & Token" onBack={onClose} />
      
      <div className="px-5 md:px-10 pb-6 md:pb-10 space-y-5 max-w-4xl mx-auto w-full">
        
        {/* Token Banner & Live WebSocket Sync Indicator */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex flex-col items-center justify-center shadow-md shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">Token</span>
              <span className="text-2xl font-black tracking-tight">#{token}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-slate-900">OPD Queue Registered</p>
                {isLiveConnected && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Radio size={10} className="animate-pulse text-emerald-600" />
                    Live WebSocket
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Clinical blueprint saved. Doctor opens slip in <strong className="text-primary font-bold">&lt;50ms</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Zap size={14} className="text-emerald-600" />
              <span>Status: {queueStatus === "in_consultation" ? "Doctor Calling You!" : queueStatus === "completed" ? "Consultation Done" : "Waiting in Queue"}</span>
            </div>
          </div>
        </div>

        {/* QR Code Handshake Card (Kiosk to Doctor Desk) */}
        <div className="p-6 rounded-3xl bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold">
              <QrCode size={13} className="text-teal-300" />
              <span>1-Second Doctor Handshake QR</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Scan at Doctor's Desk
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-md leading-relaxed">
              Show this QR code to the doctor's webcam or enter your Token <strong>#{token}</strong> to instantly project your Clinical Blueprint onto their cockpit screen.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleExportFhir}
                disabled={isExportingFhir}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/30 transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span>{isExportingFhir ? "Generating FHIR..." : "Download ABDM FHIR JSON"}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/30 transition-colors cursor-pointer"
              >
                <Printer size={13} />
                <span>Print OPD Slip</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-lg shrink-0 flex flex-col items-center">
            <QRCodeSVG value={qrData} size={140} level="M" />
            <span className="text-[10px] font-bold text-slate-700 mt-2 tracking-wider uppercase font-mono">
              Token #{token} · MediKiosk
            </span>
          </div>
        </div>

        {/* Priority & Triage Banner */}
        <div
          className="rounded-3xl p-5 flex items-start gap-4 shadow-sm"
          style={{ background: style.bg }}
        >
          <AlertTriangle size={22} color={style.fg} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-base font-extrabold" style={{ color: style.fg }}>
              Triage Priority: {style.label}
            </p>
            <p className="text-xs md:text-sm mt-1 leading-relaxed opacity-90" style={{ color: style.fg }}>
              {summary}
            </p>
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="Structured Clinical Highlights">
            <div
              className="rounded-3xl p-5 space-y-3 bg-white border border-slate-200/90 shadow-xs"
            >
              <SummaryRow
                label="Chief complaint"
                value={bp?.chief_complaint || bp?.chiefComplaint || "General Consultation"}
              />
              <SummaryRow label="Onset" value={bp?.hpi?.onset || "Acute"} />
              <SummaryRow label="Triage category" value={priority} />
              {redFlags.length > 0 ? (
                <SummaryRow label="Red flags flagged" value={redFlags.join(", ")} warn />
              ) : (
                <SummaryRow label="Red flags" value="None detected" />
              )}
            </div>
          </Section>

          <Section title="Allocated Consultation Room">
            <div
              className="rounded-3xl p-5 flex items-center gap-4 bg-white border border-slate-200/90 shadow-xs"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "var(--primary-tint)" }}
              >
                <Activity size={24} color="var(--primary)" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">
                  {activeCallRoom}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dr. Admin Doc · Cardiology & General OPD
                </p>
                <span className="inline-block mt-2 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  Floor 1, West Wing
                </span>
              </div>
            </div>
          </Section>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onFindDoctors}
            className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/95 cursor-pointer text-white font-bold text-sm"
          >
            <span>Proceed to Doctor Consultation Queue</span>
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};
