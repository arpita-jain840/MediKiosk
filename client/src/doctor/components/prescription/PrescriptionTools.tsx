import React from 'react';
import {
  FileText,
  Mic,
  Upload,
  PenTool,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { PrescriptionData } from '../../types/prescription';

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

  const tools = [
    {
      id: 'text',
      title: 'Text & Schedule',
      desc: 'Type diagnosis, dosage & medicine timetable',
      icon: FileText,
      color: 'from-indigo-600 to-indigo-700',
      activeColor: 'border-indigo-300 bg-indigo-50/50',
      badge: medicineCount > 0 ? `${medicineCount} Meds Added` : null,
      onClick: onOpenText,
    },
    {
      id: 'voice',
      title: 'Voice Dictation',
      desc: 'Record voice instructions & AI auto-transcribe',
      icon: Mic,
      color: 'from-sky-500 to-blue-600',
      activeColor: 'border-blue-300 bg-blue-50/50',
      badge: hasVoice ? 'Voice Note Ready' : null,
      onClick: onOpenVoice,
    },
    {
      id: 'upload',
      title: 'Upload Reports',
      desc: 'Attach previous prescriptions or lab test PDFs',
      icon: Upload,
      color: 'from-amber-500 to-orange-600',
      activeColor: 'border-amber-300 bg-amber-50/50',
      badge: hasFiles ? `${prescription.uploadedFiles.length} File(s)` : null,
      onClick: onOpenUpload,
    },
    {
      id: 'handwritten',
      title: 'Handwritten Drawing',
      desc: 'Draw or write clinical ink notes directly',
      icon: PenTool,
      color: 'from-teal-600 to-emerald-600',
      activeColor: 'border-teal-300 bg-teal-50/50',
      badge: hasHandwritten ? 'Drawing Saved' : null,
      onClick: onOpenHandwritten,
    },
  ];

  return (
    <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Authoring Tools</h2>
          <p className="text-xs text-slate-400 font-medium">Choose an option below to update the prescription</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
          4 Options
        </span>
      </div>

      {/* 4 Clean Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={tool.onClick}
              className={`group flex flex-col justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden ${
                tool.badge ? tool.activeColor : 'bg-slate-50/70 hover:bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform flex-shrink-0`}>
                  <Icon size={18} />
                </div>
                {tool.badge && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shadow-2xs">
                    <CheckCircle2 size={11} />
                    {tool.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                  {tool.desc}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/40 text-[11px] font-bold text-slate-600 group-hover:text-indigo-600">
                <span>{tool.badge ? 'Edit / Review' : 'Open Option'}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Live sync pill */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-indigo-600" />
          <span>All 4 options sync directly to the prescription sheet</span>
        </span>
        <span className="font-mono text-slate-400">Live Rx</span>
      </div>
    </div>
  );
};

export default PrescriptionTools;
