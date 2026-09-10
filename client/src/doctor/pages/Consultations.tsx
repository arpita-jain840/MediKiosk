import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialPatients } from '../data/patientsData';
import {
  CheckCircle2,
  Stethoscope,
  Activity,
  Search
} from 'lucide-react';

export const Consultations: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const activePatients = initialPatients.filter((p) => p.status === 'In Consultation' || p.status === 'Waiting');
  const completedPatients = initialPatients.filter((p) => p.status === 'Done');

  const filteredPatients = initialPatients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'active') return p.status === 'In Consultation' || p.status === 'Waiting';
    if (filter === 'completed') return p.status === 'Done';
    return true;
  });

  return (
    <div className="flex flex-col gap-5 md:gap-6 max-w-6xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Clinical Consultations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Active patient diagnosis sessions, triage history, and prescription handoffs.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>{activePatients.length} Active in Queue</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{completedPatients.length} Completed Today</span>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name, ID, or diagnosis..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Sessions
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filter === 'active' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({activePatients.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filter === 'completed' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedPatients.length})
          </button>
        </div>
      </div>

      {/* Consultations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {patient.id} • {patient.gender}, {patient.age} yrs • Blood {patient.bloodGroup}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                    patient.status === 'In Consultation'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse'
                      : patient.status === 'Waiting'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {patient.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs mb-3">
                <span className="font-semibold text-slate-400 block mb-0.5">Chief Complaint:</span>
                <p className="text-slate-800 font-medium">{patient.complaint}</p>
              </div>

              {/* Vitals summary */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-700">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">BP</span>
                  {patient.bp.split(' ')[0]}
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Pulse</span>
                  {patient.pulse}
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">SpO2</span>
                  {patient.spO2}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => navigate(`/patients/${patient.id}`)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors text-center cursor-pointer"
              >
                View EHR Profile
              </button>
              <button
                onClick={() => navigate(`/prescription/${patient.id}`)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Prescribe</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Consultations;
