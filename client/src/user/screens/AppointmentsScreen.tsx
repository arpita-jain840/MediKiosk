import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  Plus,
  Printer,
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { DOCTORS } from "../data/patientData";
import { getTranslations } from "../utils/i18n";
import type { DoctorDirectoryItem } from "../types";

interface AppointmentsScreenProps {
  currentLang?: string;
  onOpenLangModal?: () => void;
  onOpenProfile?: () => void;
  onBookSuccess?: (doc: DoctorDirectoryItem) => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({
  currentLang = "en",
  onOpenLangModal,
  onOpenProfile,
  onBookSuccess,
}) => {
  const t = getTranslations(currentLang);
  const [selectedDept, setSelectedDept] = useState("all");
  const [bookedDoctor, setBookedDoctor] = useState<DoctorDirectoryItem | null>(null);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [activeTokenNumber, setActiveTokenNumber] = useState<number>(2);

  const departments = [
    { id: "all", label: t.appointments.depts.all || "All Departments" },
    { id: "kayachikitsa", label: t.appointments.depts.kayachikitsa || "General Medicine" },
    { id: "panchakarma", label: t.appointments.depts.panchakarma || "Panchakarma" },
    { id: "cardio", label: t.appointments.depts.cardio || "Cardiology" },
    { id: "shalya", label: t.appointments.depts.shalya || "Surgery" },
    { id: "pediatrics", label: t.appointments.depts.pediatrics || "Pediatrics" },
  ];

  const pastVisits = [
    {
      id: "v-101",
      date: "28 Aug 2026",
      doctor: "Dr. Ananya Sharma",
      dept: "General Medicine · Room 2A",
      token: "#14",
      diagnosis: "Hyperacidity - Prescribed Avipattikar Churna",
      status: "Completed",
    },
    {
      id: "v-102",
      date: "12 Jul 2026",
      doctor: "Dr. Rajesh Kulkarni",
      dept: "Panchakarma · Room 5B",
      token: "#8",
      diagnosis: "Joint Pain - 7 Days Therapy",
      status: "Completed",
    },
  ];

  const handleBook = (doctor: DoctorDirectoryItem) => {
    const newToken = Math.floor(Math.random() * 20) + 3;
    setActiveTokenNumber(newToken);
    setBookedDoctor(doctor);
    setShowBookingSuccess(true);
    if (onBookSuccess) onBookSuccess(doctor);
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      <TopBar
        title={t.appointments.title}
        currentLang={currentLang}
        onOpenLangModal={onOpenLangModal}
        onOpenProfile={onOpenProfile}
        right={
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            title="Print Active Token Slip"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">{t.appointments.printSlip}</span>
          </button>
        }
      />

      <div className="px-5 md:px-10 py-5 md:py-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
        
        {/* ========================================================== */}
        {/* 1. TODAY'S ACTIVE TOKEN & REAL-TIME QUEUE TRACKER          */}
        {/* ========================================================== */}
        <div className="rounded-3xl p-6 bg-white border border-primary/20 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-sm"
              style={{ background: "var(--primary)" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                {t.appointments.tokenLabel}
              </span>
              <span className="text-3xl font-black">#{activeTokenNumber}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {t.appointments.nextInLine}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {bookedDoctor ? bookedDoctor.name : "Dr. John Smith"}
              </h2>
              <p className="text-xs text-slate-500">
                {bookedDoctor ? `${bookedDoctor.spec} · ${bookedDoctor.hospital}` : "Cardiology · Room 4B"}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1 text-primary">
                  <Clock size={13} />
                  <span>{t.appointments.estWait}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin size={13} />
                  <span>{t.appointments.roomPrefix} 4B, {t.appointments.floorInfo}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
            >
              {t.appointments.printSlip}
            </button>
            <button
              onClick={() => {
                setActiveTokenNumber(1);
                alert("Queue refreshed! Token verified.");
              }}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-primary hover:bg-[#204b77] text-white text-xs font-bold transition-colors cursor-pointer text-center shadow-xs"
            >
              {t.appointments.refresh}
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* 2. OPD DEPARTMENT SELECTOR                                 */}
        {/* ========================================================== */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              {t.appointments.deptTitle}
            </h3>
            <span className="text-xs text-slate-400">{t.home.aiiaTag}</span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {departments.map((dept) => {
              const active = selectedDept === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-primary text-white shadow-xs"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:bg-slate-50"
                  }`}
                >
                  {dept.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================== */}
        {/* 3. AVAILABLE DOCTORS & ROOM DIRECTORY                      */}
        {/* ========================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              {t.appointments.doctorsTitle}
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {DOCTORS.length} {t.appointments.operationalBadge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCTORS.map((d) => (
              <div
                key={d.id}
                className="rounded-3xl p-5 bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0"
                        style={{ background: "var(--primary-tint)", color: "var(--primary)" }}
                      >
                        {d.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm md:text-base font-bold text-slate-900 truncate">
                          {d.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {d.spec} · {d.hospital}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 shrink-0">
                      <Star size={12} className="text-amber-600 fill-amber-600" />
                      <span className="text-xs font-bold text-slate-800">{d.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                      <MapPin size={13} className="text-primary" />
                      <span className="truncate">{t.appointments.roomPrefix} {d.id === 1 ? "4B" : "2A"}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                      <Clock size={13} className="text-primary" />
                      <span className="truncate">{d.next}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBook(d)}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-[#204b77] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{t.appointments.getToken}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================== */}
        {/* 4. PAST VISITS & CONSULTATION HISTORY                      */}
        {/* ========================================================== */}
        <div className="rounded-3xl p-6 bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t.appointments.pastVisitsTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.profile.abhaLinked}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {pastVisits.length} {t.appointments.recordsCount}
            </span>
          </div>

          <div className="space-y-3">
            {pastVisits.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{v.doctor}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-md">
                      {t.appointments.tokenLabel} {v.token}
                    </span>
                    <span className="text-[11px] text-slate-400">• {v.date}</span>
                  </div>
                  <p className="text-xs text-slate-500">{v.dept}</p>
                  <p className="text-xs font-medium text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70 inline-block">
                    {v.diagnosis}
                  </p>
                </div>

                <button
                  onClick={() => alert(`Prescription: ${v.doctor}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                >
                  {t.appointments.viewPrescription}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Booking Confirmation Modal */}
      {showBookingSuccess && bookedDoctor && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">
                {t.appointments.modalTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.appointments.modalSubtitle}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.appointments.tokenLabel}:</span>
                <span className="font-black text-primary text-base">#{activeTokenNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.appointments.modalDoctor}:</span>
                <span className="font-bold text-slate-900">{bookedDoctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.appointments.modalDept}:</span>
                <span className="font-bold text-slate-900">{bookedDoctor.spec}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.appointments.modalRoom}:</span>
                <span className="font-bold text-emerald-700">{t.appointments.roomPrefix} 4B ({t.appointments.floorInfo})</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                {t.appointments.printSlip}
              </button>
              <button
                onClick={() => setShowBookingSuccess(false)}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-[#204b77] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {t.appointments.modalDone}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
