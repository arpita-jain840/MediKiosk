import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Camera, X, ArrowRight, Keyboard } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScanModal: React.FC<QRScanModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [manualInput, setManualInput] = useState("");
  const [activeMode, setActiveMode] = useState<"camera" | "manual">("manual");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (activeMode === "camera") {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          handleScannedData(decodedText);
          scanner.clear();
        },
        () => {
          // ignore background frame errors
        }
      );
    }


    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [isOpen, activeMode]);

  const handleScannedData = (dataStr: string) => {
    let resolvedId = dataStr.trim();
    try {
      // If JSON payload from ResultScreen QR
      const parsed = JSON.parse(dataStr);
      if (parsed.patientId) resolvedId = parsed.patientId;
      else if (parsed.token) resolvedId = String(parsed.token);
    } catch {
      // Plain text token or UUID
    }

    onClose();
    navigate(`/doctor/patients/${resolvedId}`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleScannedData(manualInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <QrCode size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Scan Patient QR Code</h3>
              <p className="text-xs text-slate-500">Loads 1-page Clinical Blueprint in &lt;50ms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold">
          <button
            onClick={() => setActiveMode("manual")}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "manual" ? "bg-white text-primary shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Keyboard size={14} />
            <span>Enter ID / Token</span>
          </button>
          <button
            onClick={() => setActiveMode("camera")}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "camera" ? "bg-white text-primary shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Camera size={14} />
            <span>Camera Scanner</span>
          </button>
        </div>

        {activeMode === "camera" ? (
          <div className="space-y-3">
            <div id="qr-reader" className="overflow-hidden rounded-2xl border border-slate-200" />
            <p className="text-center text-[11px] text-slate-400">
              Hold the patient's phone or printed OPD slip in front of the camera.
            </p>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Patient UUID, Token Number, or ABHA
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. 1, 2, user1, or paste QR text"
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/95 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <span>Open</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Fast Quick Select for Demo */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Test Shortcuts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["1", "2", "3", "user1", "user2"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleScannedData(val)}
                    className="px-3 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    Token #{val}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
