import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import PatientHealthReport from "../../components/PatientHealthReport";

interface QueuePatient {
  id: string;
  code: string;
  name: string;
  age: number;
  gender: string;
  complaint: string;
  wait: string;
  priority: "Routine" | "Priority" | "Urgent";
  flag?: string;
}

const OPD_QUEUE: QueuePatient[] = [
  {
    id: "7047ac9d-9586-42fb-8728-acb9b52a1001",
    code: "user1",
    name: "Priya Sharma",
    age: 34,
    gender: "Female",
    complaint: "Persistent bronchial asthma, allergic rhinitis, and inhaler titration",
    wait: "Just arrived",
    priority: "Priority",
    flag: "Serum IgE 380 IU/mL & Peak Flow 320 L/min",
  },
  {
    id: "dd282916-ac7a-4ca8-a6c0-e63ffc621002",
    code: "user2",
    name: "Emma Watson",
    age: 28,
    gender: "Female",
    complaint: "Chronic fatigue, severe cold intolerance, and Hashimoto thyroiditis",
    wait: "3 min",
    priority: "Urgent",
    flag: "TSH 8.4 mIU/L & Ferritin 9 ng/mL (Severe)",
  },
  {
    id: "34808a5f-e712-4fbc-8e22-501c4b4e1003",
    code: "user3",
    name: "Rajesh Kumar",
    age: 59,
    gender: "Male",
    complaint: "Coronary artery disease, exertional heaviness, and dyslipidemia",
    wait: "7 min",
    priority: "Urgent",
    flag: "ECG T-wave inversion (V5-V6) & Contrast Allergy",
  },
  {
    id: "89f13786-8f6b-4063-bbfa-9beec5341004",
    code: "user4",
    name: "Sarah Hosten",
    age: 34,
    gender: "Female",
    complaint: "Recurrent episodic migraines with scintillating visual aura",
    wait: "11 min",
    priority: "Routine",
    flag: "C5-C6 disc bulge & Sulfa drug allergy",
  },
  {
    id: "84759d82-b1bf-48d7-9cb8-ee41518d1005",
    code: "user5",
    name: "Vikram Malhotra",
    age: 38,
    gender: "Male",
    complaint: "Type 2 diabetes mellitus, metabolic syndrome, and Grade 2 NAFLD",
    wait: "15 min",
    priority: "Priority",
    flag: "HbA1c 8.2% & ALT 64 U/L (Steatohepatitis)",
  },
];

export const DoctorDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPatientId = searchParams.get("patientId");

  const [inputQuery, setInputQuery] = useState(urlPatientId || "");
  const [activePatientId, setActivePatientId] = useState<string | null>(urlPatientId || null);

  // Sync state if URL search param changes
  useEffect(() => {
    if (urlPatientId) {
      setActivePatientId(urlPatientId);
      setInputQuery(urlPatientId);
    }
  }, [urlPatientId]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim();
    if (query) {
      setActivePatientId(query);
      setSearchParams({ patientId: query });
    }
  };

  const handleSelectPatient = (idOrCode: string) => {
    setInputQuery(idOrCode);
    setActivePatientId(idOrCode);
    setSearchParams({ patientId: idOrCode });
  };

  const handleClearPatient = () => {
    setActivePatientId(null);
    setInputQuery("");
    setSearchParams({});
  };

  return (
    <div className="w-full max-w-360 mx-auto flex flex-col gap-6 pb-12 animate-fadeIn font-sans">
      {/* ========================================================================= */}
      {/* 1. MINIMALIST SEARCH HERO SECTION                                         */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-2xs relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-sky-50/70 via-indigo-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-[11px] font-extrabold text-indigo-700 tracking-wide uppercase">
              <Sparkles size={13} className="text-indigo-600" />
              Clinical Decision Support
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Instant AI Health Synthesis
            </span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Patient Health Intelligence
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
              Enter a Patient ID or Name to generate the comprehensive, prioritized Clinical Health Report in seconds.
            </p>
          </div>

          {/* Clean High-Affordance Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Type User ID (e.g. user1, user2, user3), Name, or Condition..."
                  className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-extrabold text-slate-400 shadow-2xs">
                    ↵ Enter
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>Generate Report</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {/* Minimalist Quick-Access Patient Chips */}
          <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-bold text-[11px]">Quick Access:</span>
            {OPD_QUEUE.map((p) => {
              const isSelected = activePatientId === p.code || activePatientId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPatient(p.code)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                  }`}
                >
                  <span className="opacity-75 font-mono">{p.code}</span>
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC CONTENT: Active Health Report OR Minimalist Queue               */}
      {/* ========================================================================= */}
      {activePatientId ? (
        <div className="space-y-4">
          <PatientHealthReport
            patientId={activePatientId}
            showBackToSearch={true}
            onClose={handleClearPatient}
          />
        </div>
      ) : (
        /* Minimalist Unchaotic Queue List */
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                AIIA OPD Consultation Queue
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any patient or enter their Patient ID above to review their full multi-modal clinical report.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {OPD_QUEUE.length} Patients Waiting
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {OPD_QUEUE.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handleSelectPatient(patient.code)}
                className="py-4 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 rounded-2xl px-3 transition-colors cursor-pointer group"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary font-mono font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                    {patient.code.replace("MK-", "")}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-primary transition-colors">
                        {patient.name}
                      </h3>
                      <span className="text-xs text-slate-400 font-semibold">
                        {patient.age}y · {patient.gender}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                          patient.priority === "Urgent"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : patient.priority === "Priority"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {patient.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {patient.complaint}
                    </p>

                    {patient.flag && (
                      <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-0.5">
                        <AlertTriangle size={12} className="shrink-0" />
                        <span>{patient.flag}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    {patient.wait}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPatient(patient.code);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 group-hover:bg-primary group-hover:text-white text-slate-700 text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>View Report</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DoctorDashboard;