import React, { useState } from 'react';
import qrCodeImage from '../../images/qr_code.png';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  Maximize2, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SyncedPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  bp: string;
  pulse: string;
  spO2: string;
  complaint: string;
  time: string;
  avatar: string;
}

export const PatientQRCard: React.FC<{ onPatientSynced?: (patient: SyncedPatient) => void }> = ({
  onPatientSynced
}) => {
  const navigate = useNavigate();
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [syncedPatient, setSyncedPatient] = useState<SyncedPatient | null>(null);

  // Simulated scan points to the first seeded database patient.
  const mockPatient: SyncedPatient = {
    id: 'dd282916-ac7a-4ca8-a6c0-e63ffc62066f',
    name: 'Emma Watson',
    age: 24,
    gender: 'Male',
    bloodGroup: 'O+',
    bp: '120/78 mmHg',
    pulse: '76 bpm',
    spO2: '98%',
    complaint: 'Fever, cough & severe fatigue for 3 days',
    time: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSyncedPatient(mockPatient);
      if (onPatientSynced) {
        onPatientSynced(mockPatient);
      }
    }, 1200);
  };

  const handleReset = () => {
    setSyncedPatient(null);
  };

  return (
    <>
      <div className="bg-white rounded-[2rem] p-6 border border-slate-100/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Patient QR Check-in</h3>
              <p className="text-[11px] text-slate-400 font-medium">Scan to receive patient EHR data</p>
            </div>
          </div>

          <button 
            onClick={() => setIsEnlarged(true)}
            title="Full-screen Desk QR"
            className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* QR Code Container with Laser Scanning Effect */}
        <div className="relative mx-auto my-1 p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col items-center">
          <div className="relative w-36 h-36 bg-white p-2.5 rounded-xl shadow-xs flex items-center justify-center overflow-hidden">
            {/* Real QR Code Image */}
            <img src={qrCodeImage} alt="Patient QR Code" className="w-full h-full object-contain" />

            {/* Pulsing Scan Line */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_8px_#6366f1] animate-[pulse_2s_ease-in-out_infinite]" />
          </div>

          {/* Quick Desk Pass Tag */}
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Kiosk Desk #04 • Live Sync</span>
          </div>
        </div>

        {/* Synced Info / Instructions */}
        {!syncedPatient ? (
          <div className="mt-3">
            <div className="flex items-start gap-2 text-xs text-slate-500 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <Smartphone className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>
                Patients point their camera or <strong>MediKiosk App</strong> to transmit vitals & records.
              </span>
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isScanning ? 'Receiving Patient EHR...' : 'Simulate Patient Scan'}</span>
            </button>
          </div>
        ) : (
          /* Live Received Patient Record Card */
          <div className="mt-3 bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-emerald-200/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">EHR Transferred</span>
              </div>
              <button 
                onClick={handleReset}
                className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Scan Next
              </button>
            </div>

            <div className="flex items-center gap-2.5 mb-2">
              <img 
                src={syncedPatient.avatar} 
                alt={syncedPatient.name} 
                className="w-8 h-8 rounded-full object-cover border border-emerald-300"
              />
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-tight">{syncedPatient.name}</h4>
                <p className="text-[10px] text-slate-500">{syncedPatient.gender}, {syncedPatient.age} yrs • Blood {syncedPatient.bloodGroup}</p>
              </div>
            </div>

            {/* Vitals quick badges */}
            <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold text-slate-700 text-center mb-2">
              <div className="bg-white/80 rounded-lg py-1 border border-emerald-100">
                <span className="block text-[9px] text-slate-400">BP</span>
                {syncedPatient.bp.split(' ')[0]}
              </div>
              <div className="bg-white/80 rounded-lg py-1 border border-emerald-100">
                <span className="block text-[9px] text-slate-400">Pulse</span>
                {syncedPatient.pulse.split(' ')[0]}
              </div>
              <div className="bg-white/80 rounded-lg py-1 border border-emerald-100">
                <span className="block text-[9px] text-slate-400">SpO2</span>
                {syncedPatient.spO2}
              </div>
            </div>

            <p className="text-[11px] text-slate-600 font-medium line-clamp-1 bg-white/60 px-2 py-1 rounded-lg mb-2.5">
              🩺 {syncedPatient.complaint}
            </p>

            {/* Click to open detailed EHR Profile */}
            <button
              onClick={() => navigate(`/patients/${syncedPatient.id}`)}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>View Full Profile ({syncedPatient.id})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Enlarged Modal for Patient Facing Display */}
      {isEnlarged && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative text-center flex flex-col items-center">
            <button
              onClick={() => setIsEnlarged(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              MediKiosk Patient Pass
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Scan with your smartphone to instantly send your vitals and medical records to Dr. Liza
            </p>

            {/* Giant QR for Desk Screen */}
            <div className="p-4 bg-slate-50 rounded-3xl border-2 border-indigo-100 mb-5 relative">
              <div className="w-60 h-60 bg-white p-4 rounded-2xl shadow-sm flex items-center justify-center">
                <img src={qrCodeImage} alt="Patient QR Code" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 py-3 px-4 rounded-xl">
              <span>Station: Clinic Room 4B</span>
              <span className="text-indigo-600">Encrypted HIPAA Link</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientQRCard;
