import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Check, Smartphone, FileCheck } from 'lucide-react';

interface PrescriptionSuccessModalProps {
  isOpen: boolean;
  patientName: string;
  patientId: string;
}

export const PrescriptionSuccessModal: React.FC<PrescriptionSuccessModalProps> = ({
  isOpen,
  patientName,
  patientId,
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/patients');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, navigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-100 p-8 sm:p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {/* Animated Green Checkmark Sphere */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 mb-5 shadow-lg shadow-emerald-500/15 animate-bounce">
          <Check size={40} className="stroke-[3]" />
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider mb-2">
          <ShieldCheck size={13} />
          E-Prescription Dispatched
        </span>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Prescription Sent!
        </h2>

        <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed max-w-xs">
          Prescription has been successfully sent to <strong className="text-slate-800">{patientName}</strong> ({patientId}).
        </p>

        {/* Transmission Delivery Indicators */}
        <div className="w-full my-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-left text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-2">
              <FileCheck size={14} className="text-emerald-500" />
              <span>Digital Rx PDF Transferred</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-600 font-bold">SENT</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-2">
              <Smartphone size={14} className="text-emerald-500" />
              <span>SMS & WhatsApp Alert Dispatched</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-600 font-bold">DELIVERED</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Queue Status Updated</span>
            </span>
            <span className="font-mono text-[10px] text-indigo-600 font-bold">COMPLETED</span>
          </div>
        </div>

        {/* Navigation Action */}
        <button
          onClick={() => navigate('/patients')}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-black tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Return to Patient Directory ({countdown}s)</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
