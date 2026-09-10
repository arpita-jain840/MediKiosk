import React, { useState } from 'react';
import {
  QrCode,
  Bell,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [deskAutoSync, setDeskAutoSync] = useState(true);
  const [audioChime, setAudioChime] = useState(true);
  const [highPriorityAlerts, setHighPriorityAlerts] = useState(true);
  const [autoPrintPrescription, setAutoPrintPrescription] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 max-w-4xl mx-auto pb-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            MediKiosk Settings & Hardware
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure desk scanner, real-time patient syncing, and clinic alerts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{saved ? 'Saved Successfully!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-5">
        {/* Hardware & Desk Station */}
        <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <QrCode className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">QR Kiosk Hardware & Desk Receiver</h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Automatic QR Sync on Scan</p>
                <p className="text-xs text-slate-400">Instantly populate EHR queue when patient checks in</p>
              </div>
              <button
                onClick={() => setDeskAutoSync(!deskAutoSync)}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${
                  deskAutoSync ? 'bg-teal-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    deskAutoSync ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Scan Audio Chime</p>
                <p className="text-xs text-slate-400">Play pleasant audible confirmation upon valid QR transfer</p>
              </div>
              <button
                onClick={() => setAudioChime(!audioChime)}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${
                  audioChime ? 'bg-teal-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    audioChime ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Clinical Triage & Notifications */}
        <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Clinical Alerts & Fast-Track Triage</h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Critical Patient Flash Notifications</p>
                <p className="text-xs text-slate-400">High priority toast when critical vitals or chest pain are flagged</p>
              </div>
              <button
                onClick={() => setHighPriorityAlerts(!highPriorityAlerts)}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${
                  highPriorityAlerts ? 'bg-teal-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    highPriorityAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Auto-trigger Thermal Print on Finalize</p>
                <p className="text-xs text-slate-400">Directly print signed RX upon clicking Finish Consultation</p>
              </div>
              <button
                onClick={() => setAutoPrintPrescription(!autoPrintPrescription)}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${
                  autoPrintPrescription ? 'bg-teal-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    autoPrintPrescription ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Station Info */}
        <div className="bg-slate-900 text-white rounded-[2rem] p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              Station Status: Online
            </span>
            <h3 className="text-lg font-extrabold">MediKiosk Desk Receiver #04 (Saket Center)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Firmware v2.4.1 • AES-256 Encrypted Sync Active</p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer border border-slate-700">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Updates</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
