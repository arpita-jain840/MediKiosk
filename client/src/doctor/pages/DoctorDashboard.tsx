import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileSignature,
  ListChecks,
  Play,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientQRCard from "../components/PatientQRCard";

interface QueuePatient {
  id: string;
  token: string;
  name: string;
  age: number;
  gender: string;
  complaint: string;
  wait: string;
  priority: "Routine" | "Priority" | "Urgent";
}

const queuePatients: QueuePatient[] = [
  {
    id: "PAT-1001",
    token: "A-01",
    name: "Aarav Sharma",
    age: 24,
    gender: "Male",
    complaint: "Fever, cough and fatigue",
    wait: "2 min",
    priority: "Routine",
  },
  {
    id: "PAT-1002",
    token: "A-02",
    name: "Priyanshi Gupta",
    age: 31,
    gender: "Female",
    complaint: "Acute migraine and nausea",
    wait: "8 min",
    priority: "Priority",
  },
  {
    id: "PAT-1003",
    token: "A-03",
    name: "Rishabh Verma",
    age: 47,
    gender: "Male",
    complaint: "Chest tightness and palpitations",
    wait: "14 min",
    priority: "Urgent",
  },
];

const pendingTasks = [
  {
    label: "Prescription signatures",
    detail: "3 prescriptions waiting for e-signature",
    icon: FileSignature,
    action: "Review",
  },
  {
    label: "Lab reports",
    detail: "5 new reports need clinical review",
    icon: ListChecks,
    action: "Open reports",
  },
];

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const doctorId = "DOC-1001";
  const [submittedPatientId, setSubmittedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    let detected = false;
    let intervalId: number | undefined;

    const poll = async () => {
      if (detected) return;
      try {
        const response = await fetch(`http://localhost:8000/doctor/${doctorId}/patient`);
        if (!response.ok || !mounted) return;

        const data: { success: boolean; patient_id: string | null } = await response.json();
        if (data.success && data.patient_id) {
          detected = true;
          if (intervalId !== undefined) window.clearInterval(intervalId);
          setSubmittedPatientId(data.patient_id);
        }
      } catch (error) {
        console.warn("[DoctorDashboard] Patient notification polling failed:", error);
      }
    };

    void poll();
    intervalId = window.setInterval(poll, 1000);

    return () => {
      mounted = false;
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [doctorId]);

  useEffect(() => {
    if (submittedPatientId) navigate(`/doctor/patients/${submittedPatientId}`);
  }, [navigate, submittedPatientId]);

  const visiblePatients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return queuePatients;

    return queuePatients.filter((patient) =>
      `${patient.name} ${patient.id} ${patient.token}`.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-5 md:gap-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
            Doctor portal
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome, Dr. Ananya
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {dateLabel} · Your OPD workspace is ready.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          On duty
        </span>
      </section>

      {/* Hero / live clinic board */}
      <section className="rounded-2xl bg-primary p-5 sm:p-7 text-white shadow-sm overflow-hidden relative">
        <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full border-[24px] border-white/10" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70 mb-2">
              Live clinic board
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Today&apos;s OPD
            </h2>
            <p className="text-sm text-white/80 mt-2">
              Keep consultations moving with the live patient queue and clinical tasks in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(`/doctor/patient/${queuePatients[0].id}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-primary shadow-sm hover:bg-slate-50 cursor-pointer"
            >
              <Play size={15} />
              Start next consult
            </button>

            <button
              type="button"
              onClick={() => document.getElementById("patient-queue")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-white/10 cursor-pointer"
            >
              <ListChecks size={15} />
              View queue
            </button>

            <button
              type="button"
              onClick={() => navigate("/doctor/prescription/PAT-1001")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-white/10 cursor-pointer"
            >
              <FileSignature size={15} />
              Sign prescriptions
            </button>
          </div>
        </div>
      </section>

      {/* Live handoff + QR card */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] gap-5 items-start">
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-800">
              Live patient handoff
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Keep the desk QR visible so patients can securely send their existing case to this doctor.
          </p>
        </div>

        <PatientQRCard />
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Patients waiting",
            value: "12",
            detail: "+3 since 9 AM",
            icon: Clock3,
            tint: "bg-sky-50 text-sky-700",
          },
          {
            label: "Consults completed",
            value: "18",
            detail: "+4 today",
            icon: CheckCircle2,
            tint: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Pending signatures",
            value: "3",
            detail: "Needs attention",
            icon: FileSignature,
            tint: "bg-amber-50 text-amber-700",
          },
          {
            label: "Avg. consult time",
            value: "12m",
            detail: "2m faster today",
            icon: Stethoscope,
            tint: "bg-rose-50 text-rose-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.tint}`}>
              <stat.icon size={19} />
            </div>
            <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
            <div className="flex items-end justify-between gap-2 mt-1">
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 text-right">{stat.detail}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Queue + tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] gap-5">
        {/* Patient queue */}
        <section
          id="patient-queue"
          className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Patient Queue</h2>
              <p className="text-xs text-slate-400 mt-1">Next patients waiting for consultation</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search queue"
                className="w-full sm:w-36 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => navigate("/doctor/patients")}
                className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
              >
                Full queue
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {visiblePatients.map((patient) => (
              <div key={patient.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-tint text-primary flex items-center justify-center font-extrabold text-sm shrink-0">
                  {patient.token}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-slate-900">{patient.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        patient.priority === "Urgent"
                          ? "bg-rose-50 text-rose-700"
                          : patient.priority === "Priority"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {patient.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {patient.id} · {patient.age} yrs · {patient.gender}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-2 truncate">
                    {patient.complaint}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-xs font-bold text-slate-400">{patient.wait}</span>
                  <button
                    type="button"
                    onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-extrabold text-white hover:opacity-90 cursor-pointer"
                  >
                    <span>Start</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pending tasks */}
        <section className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-900">Pending Tasks</h2>
            <p className="text-xs text-slate-400 mt-1">Keep your clinical workspace clear</p>
          </div>

          <div className="p-4 space-y-3">
            {pendingTasks.map((task) => (
              <button
                key={task.label}
                type="button"
                onClick={() =>
                  navigate(task.label.startsWith("Prescription") ? "/doctor/prescription/PAT-1001" : "/doctor/reports")
                }
                className="w-full flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:border-primary/40 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="w-9 h-9 rounded-lg bg-primary-tint text-primary flex items-center justify-center shrink-0">
                  <task.icon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-extrabold text-slate-800">{task.label}</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">{task.detail}</span>
                </span>
                <span className="text-[11px] font-extrabold text-primary">{task.action}</span>
              </button>
            ))}
          </div>

          <div className="mx-4 mb-4 rounded-xl bg-slate-50 p-3 flex items-center gap-3">
            <CalendarDays size={17} className="text-primary" />
            <p className="text-xs font-semibold text-slate-600">
              Next appointment starts in 20 minutes.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;