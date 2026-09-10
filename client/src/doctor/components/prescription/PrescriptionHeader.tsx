import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Stethoscope, ShieldCheck } from 'lucide-react';
import type { PrescriptionData } from '../../../types/prescription';

interface PrescriptionHeaderProps {
  prescription: PrescriptionData;
}

export const PrescriptionHeader: React.FC<PrescriptionHeaderProps> = ({ prescription }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5">
      {/* Top row: Title + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer group"
            title="Back to Consultation"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                Prescription
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-[11px] font-extrabold tracking-wide uppercase shadow-2xs">
                Doctor Workspace
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Create, review and send the prescription to the patient.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>HIPAA Compliant Electronic Rx</span>
          </div>
        </div>
      </div>

      {/* Compact Patient & Doctor Info Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <User size={16} />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Patient
            </span>
            <p className="text-xs font-extrabold text-slate-800 truncate">
              {prescription.patientName}
            </p>
          </div>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Demographics
          </span>
          <p className="text-xs font-bold text-slate-700">
            {prescription.patientAge} yrs • {prescription.patientGender}
          </p>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Vitals Profile
          </span>
          <p className="text-xs font-bold text-slate-700">
            {prescription.patientWeight} • Blood {prescription.patientBloodGroup}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Stethoscope size={15} />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Attending Doctor
            </span>
            <p className="text-xs font-extrabold text-slate-800 truncate">
              {prescription.doctorName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
            <Calendar size={15} />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Date & ID
            </span>
            <p className="text-xs font-bold text-slate-700">
              {prescription.consultationDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
