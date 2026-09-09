import React from 'react';
import { X, Printer, Download, Send, ArrowLeft, ShieldCheck } from 'lucide-react';
import type { PrescriptionData } from '../../types/prescription';

interface PrescriptionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  prescription: PrescriptionData;
}

export const PrescriptionPreviewModal: React.FC<PrescriptionPreviewModalProps> = ({
  isOpen,
  onClose,
  onSend,
  prescription,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-100 rounded-[2.5rem] w-full max-w-4xl max-h-[92vh] shadow-2xl border border-slate-300/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Preview Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Edit</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Patient View Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer size={14} />
              <span>Print Rx</span>
            </button>
            <button
              onClick={() => {
                alert('PDF generation initiated. Download will start shortly.');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer shadow-2xs"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onSend();
              }}
              className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer ml-1"
            >
              <Send size={14} />
              <span>Send to Patient</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Prescription Paper Display (Pure Patient Final View) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex justify-center">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-slate-200 w-full max-w-3xl flex flex-col justify-between space-y-6">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                  {prescription.clinicName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {prescription.clinicAddress} • Tel: {prescription.clinicPhone}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Official Electronic Medical Record • Verification Code: #MDX-RX-{prescription.consultationId}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <h4 className="text-sm font-black text-slate-900">{prescription.doctorName}</h4>
                <p className="text-xs font-bold text-indigo-700">{prescription.doctorQualification}</p>
                <p className="text-[11px] text-slate-500">{prescription.doctorSpecialty}</p>
                <span className="text-[10px] text-slate-400 font-mono">Reg #: {prescription.doctorRegNo}</span>
              </div>
            </div>

            {/* Patient Demographics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Patient</span>
                <p className="font-extrabold text-slate-900">{prescription.patientName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</span>
                <p className="font-bold text-slate-700">{prescription.patientAge}y • {prescription.patientGender}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Weight / Blood</span>
                <p className="font-bold text-slate-700">{prescription.patientWeight} • {prescription.patientBloodGroup}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Date</span>
                <p className="font-bold text-slate-700 font-mono">{prescription.consultationDate}</p>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <span className="text-xs font-bold text-slate-500 mr-2">Diagnosis:</span>
              <span className="text-xs font-black text-slate-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                {prescription.diagnosis}
              </span>
            </div>

            {/* Medicines */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-2xl text-indigo-900">℞</span>
                <span className="text-xs font-black text-slate-800 uppercase">Prescribed Medicines</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Medicine</th>
                      <th className="py-2 px-3">Dosage</th>
                      <th className="py-2 px-3">Frequency</th>
                      <th className="py-2 px-3">Duration</th>
                      <th className="py-2 px-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prescription.medicines.map((m, idx) => (
                      <tr key={m.id || idx}>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-extrabold text-slate-900">{m.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{m.dosage}</td>
                        <td className="py-2.5 px-3 font-bold text-indigo-700">{m.frequency}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{m.duration}</td>
                        <td className="py-2.5 px-3 text-slate-600">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Instructions & Follow-up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  General Instructions
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">{prescription.instructions}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Review Schedule
                </span>
                <p className="font-bold text-slate-800">{prescription.followUp}</p>
              </div>
            </div>

            {/* Handwritten Canvas if present */}
            {prescription.handwritten && (
              <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-100">
                <span className="text-[10px] font-bold text-teal-800 uppercase block mb-1">
                  Doctor Handwritten Notes
                </span>
                <img
                  src={prescription.handwritten.imageDataUrl}
                  alt="Handwritten prescription"
                  className="max-h-36 object-contain rounded-lg bg-white p-2 border border-slate-100"
                />
              </div>
            )}

            {/* Footer Signature */}
            <div className="pt-6 border-t-2 border-slate-100 flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  Official Electronic Healthcare Record
                </span>
                <p className="text-[10px] text-slate-400 font-mono">
                  Transmitted securely via MEDIX Clinical Gateway
                </p>
              </div>
              <div className="text-right">
                <div className="border-b border-slate-400 pb-1 w-36 text-right">
                  <span className="font-serif italic font-black text-base text-slate-900">
                    Dr. Melvin S., MD
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 mt-1 block">
                  {prescription.doctorName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
