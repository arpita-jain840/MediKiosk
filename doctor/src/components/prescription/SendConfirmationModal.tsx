import { X, Send, CheckCircle2, Sparkles } from 'lucide-react';
import type { PrescriptionData } from '../../types/prescription';

interface SendConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  prescription: PrescriptionData;
  isSending: boolean;
}

export const SendConfirmationModal: React.FC<SendConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  prescription,
  isSending,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Send size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Send Prescription?</h2>
              <p className="text-xs text-slate-400 font-medium">
                Verify recipient channels & attached diagnostic assets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Patient Card */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                {prescription.patientName.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {prescription.patientName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {prescription.patientAge} yrs • {prescription.patientGender} • ID: {prescription.patientId}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active Patient
            </span>
          </div>

          {/* Checklist of what patient receives */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-700 block">
              The patient will receive:
            </span>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>
                  <strong>Official Digital Prescription</strong> ({prescription.medicines.length} medications specified)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>
                  <strong>Consultation Summary</strong> & Diagnostic advice ({prescription.diagnosis})
                </span>
              </div>
              {prescription.voice && (
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                  <span>
                    <strong>Voice instructions</strong> ({prescription.voice.duration} audio with transcription)
                  </span>
                </div>
              )}
              {prescription.handwritten && (
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 size={16} className="text-teal-500 shrink-0" />
                  <span>
                    <strong>Handwritten prescription ink</strong> attached
                  </span>
                </div>
              )}
              {prescription.uploadedFiles.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>
                    <strong>{prescription.uploadedFiles.length} Uploaded prescription/diagnostic file(s)</strong>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Instant SMS & WhatsApp delivery notification link</span>
              </div>
            </div>
          </div>

          {/* Automatic Queue Alert */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-start gap-2 text-xs text-indigo-950">
            <Sparkles size={15} className="text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Upon sending, this consultation will be marked <strong>Completed</strong> and the patient will be cleared from the active waiting queue.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Transmitting...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Send Prescription</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
