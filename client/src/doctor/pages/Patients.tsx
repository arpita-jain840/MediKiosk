import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLivePatients } from '../../data/patientsData';
import type { PatientRecord } from '../../data/patientsData';
import { ArrowRight, QrCode, Clock, Activity, CheckCircle2 } from 'lucide-react';

export const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');

  useEffect(() => {
    setPatients(getLivePatients());
  }, []);

  const waitingOrConsulting = patients.filter((p) => p.status === 'Waiting' || p.status === 'In Consultation');
  const completedPatients = patients.filter((p) => p.status === 'Done');

  const displayedPatients =
    activeTab === 'active'
      ? waitingOrConsulting
      : activeTab === 'completed'
      ? completedPatients
      : patients;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time queue of waiting, consulting, and completed patient prescriptions.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Queue ({waitingOrConsulting.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedPatients.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({patients.length})
          </button>
        </div>
      </div>

      {/* Patients Table / Card List */}
      <div className="bg-white rounded-[2rem] p-6 border border-slate-100/80 shadow-xs overflow-hidden">
        {displayedPatients.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Patients in this Queue</h3>
            <p className="text-xs text-slate-400 mt-1">
              All patients in this category have been attended to or checked out.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {displayedPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => navigate(`/patients/${patient.id}`)}
                className="py-4.5 px-3 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 rounded-2xl transition-all cursor-pointer group"
              >
                {/* Patient Basic Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 group-hover:border-indigo-300 transition-colors"
                  />
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {patient.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        {patient.id}
                      </span>
                      {patient.id === 'MK-9824' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          <QrCode className="w-2.5 h-2.5" />
                          Live QR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {patient.gender}, {patient.age} yrs • Blood {patient.bloodGroup} • {patient.insurance}
                    </p>
                  </div>
                </div>

                {/* Vitals Summary */}
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <span className="bg-slate-100/80 px-2.5 py-1 rounded-lg">
                    BP: <strong className="text-slate-800">{patient.bp.split(' ')[0]}</strong>
                  </span>
                  <span className="bg-slate-100/80 px-2.5 py-1 rounded-lg">
                    HR: <strong className="text-slate-800">{patient.pulse}</strong>
                  </span>
                  <span className="bg-slate-100/80 px-2.5 py-1 rounded-lg">
                    SpO2: <strong className="text-slate-800">{patient.spO2}</strong>
                  </span>
                </div>

                {/* Status & Action */}
                <div className="flex items-center justify-between md:justify-end gap-3">
                  {patient.status === 'Waiting' && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold flex items-center gap-1 border border-amber-200">
                      <Clock className="w-3 h-3" />
                      Waiting
                    </span>
                  )}
                  {patient.status === 'In Consultation' && (
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1 border border-indigo-200 animate-pulse">
                      <Activity className="w-3 h-3" />
                      Consulting
                    </span>
                  )}
                  {patient.status === 'Done' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Done
                    </span>
                  )}

                  <button className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
