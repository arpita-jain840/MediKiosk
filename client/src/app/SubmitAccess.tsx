import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  User,
  Stethoscope,
  ChevronDown,
  Building2,
  Sparkles
} from 'lucide-react';
import { initialPatients, type PatientRecord } from '../data/patientsData';

const EXISTING_DOCTOR_ID = 'DOC-1001';

export const SubmitAccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(initialPatients[0]!);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [transmittedTime, setTransmittedTime] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  const handleGrantAccess = async () => {
    const patientId = selectedPatient.id;
    const doctorId = searchParams.get('doctor_id') || EXISTING_DOCTOR_ID;

    if (!patientId || !doctorId) {
      setSubmitError('Patient or doctor information is missing.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('http://localhost:8000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId, doctor_id: doctorId }),
      });

      if (!response.ok) {
        setSubmitError(response.status === 409 ? 'This patient has already been submitted.' : 'Unable to submit the patient right now.');
        return;
      }

      const notificationResponse = await fetch('http://localhost:8000/patient/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientId, doctor_id: doctorId }),
      });

      if (!notificationResponse.ok) {
        setSubmitError('The patient was saved, but notifying the doctor failed. Please try again.');
        return;
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTransmittedTime(timeStr);
      setIsSubmitted(true);
    } catch {
      setSubmitError('The MediKiosk server is unavailable. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/6 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/6 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative transition-all duration-300">
        <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-teal-200 backdrop-blur-sm border border-white/10">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">MediKiosk Health Desk</h2>
              <p className="text-[11px] text-teal-200/80 font-medium">Room 4B • Dr. Ananya Sharma</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Desk #04
          </span>
        </div>
        <div className="p-6 sm:p-7 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3.5 shadow-inner border border-teal-100/80">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1.5">
            Access Restricted
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-5 max-w-xs">
            Hit the request access button and we’ll find someone who can give you access
          </p>
          <div className="w-full text-left bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 mb-4 transition-all">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-700" />
                Select Patient Record
              </span>

              <div className="relative">
                <select
                  value={selectedPatient.id}
                  onChange={(e) => {
                    const p = initialPatients.find((item) => item.id === e.target.value);
                    if (p) setSelectedPatient(p);
                  }}
                  className="text-xs font-semibold text-teal-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1 pr-6 cursor-pointer outline-none shadow-xs appearance-none"
                >
                  {initialPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-xs mb-2.5">
              <img
                src={selectedPatient.avatar}
                alt={selectedPatient.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{selectedPatient.name}</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700">
                    Blood {selectedPatient.bloodGroup}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {selectedPatient.age} yrs • {selectedPatient.gender}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-medium text-slate-600 mb-2">
              <div className="bg-white rounded-lg p-1.5 border border-slate-100">
                <span className="text-slate-400 block text-[9px] font-bold">BP</span>
                <span className="font-bold text-slate-800">{selectedPatient.bp.split(' ')[0]}</span>
              </div>
              <div className="bg-white rounded-lg p-1.5 border border-slate-100">
                <span className="text-slate-400 block text-[9px] font-bold">PULSE</span>
                <span className="font-bold text-slate-800">{selectedPatient.pulse}</span>
              </div>
              <div className="bg-white rounded-lg p-1.5 border border-slate-100">
                <span className="text-slate-400 block text-[9px] font-bold">SpO2</span>
                <span className="font-bold text-slate-800">{selectedPatient.spO2}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-2 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{selectedPatient.complaint}</span>
            </div>
          </div>

          

          <button
            onClick={handleGrantAccess}
            disabled={isSubmitting || isSubmitted}
            className="w-full py-3.5 px-5 bg-[#1f7a6c] hover:bg-[#18665a] active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-teal-900/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Requesting Access & Transmitting...</span>
              </>
            ) : (
              <>
                <span>Request Access</span>
              </>
            )}
          </button>
          {submitError && (
            <p className="mt-3 text-xs font-semibold text-rose-600" role="alert">{submitError}</p>
          )}
        </div>
      </div>
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 py-8 ">
          <div className="bg-white rounded-3xl p-7 sm:p-9 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-center flex flex-col items-center my-auto">

            {/* Checkmark */}
            <div className="w-16 h-16 rounded-full bg-[#00c888] flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6 flex-shrink-0">
              <Check className="w-8 h-8 text-white stroke-[3.5]" />
            </div>

            {/* Success Title */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3 max-w-xs">
              Access granted to Dr. Ananya Sharma
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
              The patient record has been securely shared. She can now view vitals, medications, and the chief complaint for this consultation.
            </p>

            {/* Medical / Clinic Context Confirmation */}
            <div className="w-full bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-6 text-left flex-shrink-0">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  EHR Transmitted to Doctor
                </span>
                <span className="text-emerald-600 font-mono text-[10px]">Synced {transmittedTime}</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Patient: <strong className="text-slate-900">{selectedPatient.name}</strong> ({selectedPatient.id})
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Doctor: Dr. Ananya Sharma • Clinic Room 4B
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer flex-shrink-0"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitAccess;
