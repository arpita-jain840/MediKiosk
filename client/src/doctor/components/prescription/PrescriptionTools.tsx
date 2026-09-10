import React from 'react';
import {
  FileText,
  Mic,
  Upload,
  PenTool,
  CheckCircle2,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';
import type { PrescriptionData } from '../../../types/prescription';

interface PrescriptionToolsProps {
  prescription: PrescriptionData;
  onOpenText: () => void;
  onOpenVoice: () => void;
  onOpenUpload: () => void;
  onOpenHandwritten: () => void;
}

export const PrescriptionTools: React.FC<PrescriptionToolsProps> = ({
  prescription,
  onOpenText,
  onOpenVoice,
  onOpenUpload,
  onOpenHandwritten,
}) => {
  const medicineCount = prescription.medicines.length;
  const hasVoice = !!prescription.voice;
  const hasFiles = prescription.uploadedFiles.length > 0;
  const hasHandwritten = !!prescription.handwritten;

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-xs flex flex-col gap-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Prescription</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Select an authoring mode to create or append instructions.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-extrabold">
          4 Modalities
        </span>
      </div>

      {/* 4 Interactive Modality Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. Text Card */}
        <button
          onClick={onOpenText}
          className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200/80 hover:border-indigo-300 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <FileText size={20} />
            </div>
            {medicineCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={12} />
                {medicineCount} Med{medicineCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
              Text
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Write prescription details & medicine schedule
            </p>
          </div>
        </button>

        {/* 2. Voice Card */}
        <button
          onClick={onOpenVoice}
          className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-slate-50/70 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-300 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Mic size={20} />
            </div>
            {hasVoice ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                <CheckCircle2 size={12} />
                Voice Added
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                <Sparkles size={11} />
                AI Triage
              </span>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
              Voice
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Record prescription instructions & voice notes
            </p>
          </div>
        </button>

        {/* 3. Upload Card */}
        <button
          onClick={onOpenUpload}
          className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-slate-50/70 hover:bg-amber-50/40 border border-slate-200/80 hover:border-amber-300 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Upload size={20} />
            </div>
            {hasFiles && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <CheckCircle2 size={12} />
                {prescription.uploadedFiles.length} File{prescription.uploadedFiles.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
              Upload
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Upload existing prescription or audio files
            </p>
          </div>
        </button>

        {/* 4. Handwritten Card */}
        <button
          onClick={onOpenHandwritten}
          className="group relative flex flex-col justify-between p-4.5 rounded-2xl bg-slate-50/70 hover:bg-teal-50/40 border border-slate-200/80 hover:border-teal-300 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <PenTool size={20} />
            </div>
            {hasHandwritten && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                <CheckCircle2 size={12} />
                Drawing Added
              </span>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
              Handwritten
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Write directly on the prescription canvas
            </p>
          </div>
        </button>
      </div>

      {/* Clinical Workspace Helper Banner */}
      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70 flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Info size={15} className="text-indigo-600 shrink-0" />
          <span>Multi-Format Prescription Support</span>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          You can utilize any combination of Text, Voice, Uploaded documents, or Handwritten notes. All components automatically synchronize live into the electronic prescription on the right.
        </p>

        {/* Active Attachments Summary Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Status:
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${medicineCount > 0 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            {medicineCount} Rx Medicines
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${hasVoice ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            {hasVoice ? 'Voice Note Attached' : 'No Voice'}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${hasHandwritten ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            {hasHandwritten ? 'Handwritten Ink Saved' : 'No Ink'}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${hasFiles ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            {hasFiles ? `${prescription.uploadedFiles.length} File(s)` : 'No Files'}
          </span>
        </div>
      </div>

      {/* Quick Clinic Timestamp */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          Auto-saving changes locally
        </span>
        <span className="font-semibold text-slate-500">
          Ref: {prescription.consultationId}
        </span>
      </div>
    </div>
  );
};
