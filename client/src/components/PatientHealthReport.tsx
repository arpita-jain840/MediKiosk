import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Download,
  TrendingUp,
  FileText,
  Activity,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Printer,
  Droplets,
  Pill,
} from "lucide-react";
import { getApiUrl } from "../config/api";

export interface PatientHealthReportProps {
  patientId?: string;
  onClose?: () => void;
  showBackToSearch?: boolean;
}

interface TrendPoint {
  label: string;
  value: number;
}

interface TrendData {
  metric: string;
  unit: string;
  values: TrendPoint[];
  statusText: string;
  direction: "up" | "down";
  isAbnormal: boolean;
  color: string;
}

export const PatientHealthReport: React.FC<PatientHealthReportProps> = ({
  patientId = "user1",
  onClose,
  showBackToSearch = false,
}) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reportFilter, setReportFilter] = useState<string>("all");
  const [selectedReportModal, setSelectedReportModal] = useState<any | null>(null);

  // Fetch report data from API
  useEffect(() => {
    let isMounted = true;
    const fetchReport = async () => {
      setLoading(true);
      try {
        const targetId = patientId.trim() || "user1";
        const res = await fetch(getApiUrl(`/api/patient/${encodeURIComponent(targetId)}/health-report`));
        if (!res.ok) {
          throw new Error(`Patient health report not found (${res.status})`);
        }
        const data = await res.json();
        if (isMounted) {
          setReportData(data);
        }
      } catch (err: any) {
        console.warn("[PatientHealthReport] Fallback to demo contract:", err);
        // Fallback to designated patient contract
        if (isMounted) {
          setReportData(getDefaultPatientData(patientId || "user1"));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [patientId]);

  const handlePrintDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-115 bg-white rounded-3xl border border-slate-200/80 p-12 shadow-xs">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Sparkles className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="mt-4 text-base font-bold text-slate-800">Synthesizing Clinical Intelligence...</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
          Analyzing multi-modal physical scans, lab investigations, biomarker trends and active diagnoses via Gemini.
        </p>
      </div>
    );
  }

  const data = reportData || getDefaultPatientData(patientId || "user1");
  const { patient, metrics, reportTypes, aiSummary, detailedReports, medicationSummary, recentDocuments, timeline, disclaimer } = data;

  // Filter detailed reports
  const filteredReports = detailedReports?.filter((rep: any) => {
    if (reportFilter === "all") return true;
    if (reportFilter === "lab") return rep.type === "lab";
    if (reportFilter === "imaging") return rep.type === "imaging";
    return rep.type === "others" || rep.type === "prescription";
  }) || [];

  return (
    <div className="w-full max-w-360 mx-auto flex flex-col gap-5 pb-12 font-sans text-slate-800 animate-fadeIn">
      {/* Optional Top Action Bar */}
      {showBackToSearch && (
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-all cursor-pointer"
          >
            ← Search Another Patient
          </button>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Health Blueprint
            </span>
            <button
              onClick={handlePrintDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/95 transition-all cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / Export</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP PATIENT IDENTIFIER & CLINICAL CONTEXT CARD                         */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Avatar & Basic Details */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-linear-to-tr from-sky-100 to-indigo-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
                  <circle cx="50" cy="40" r="22" fill="#93c5fd" />
                  <path d="M20 92 C20 70, 35 62, 50 62 C65 62, 80 70, 80 92 Z" fill="#3b82f6" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-black" title="Active Patient">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  {patient.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold border border-slate-200">
                  {patient.patientId || patientId}
                </span>
              </div>

              <p className="text-xs md:text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
                <span>Age: <strong className="text-slate-800 font-bold">{patient.age}</strong></span>
                <span className="text-slate-300">|</span>
                <span>{patient.gender}</span>
                <span className="text-slate-300">|</span>
                <span>Patient ID: <strong className="text-slate-800 font-bold">{patient.patientId || patientId}</strong></span>
              </p>

              <div className="flex items-center gap-3 mt-2.5 flex-wrap text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 font-semibold text-slate-700">
                  <Droplets size={13} className="text-rose-500" />
                  <span>Blood Group: <strong>{patient.bloodGroup || "B+"}</strong></span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50/80 border border-rose-200 font-semibold text-rose-700">
                  <AlertCircle size={13} className="text-rose-600" />
                  <span>Allergies: <strong>{(patient.allergies || ["Penicillin"]).join(", ")}</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Context: Known Conditions, Current Medications, Last Updated */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 text-xs">
            {/* Known Conditions */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Activity size={12} className="text-slate-400" />
                Known Conditions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(patient.knownConditions || ["Diabetes Type 2", "Hypertension"]).map((c: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200/80 shadow-2xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Pill size={12} className="text-slate-400" />
                Current Medications
              </span>
              <div className="space-y-1">
                {(patient.currentMedications || ["Metformin 500 mg (BD)", "Amlodipine 10 mg (OD)"]).slice(0, 2).map((m: string, idx: number) => (
                  <span
                    key={idx}
                    className="block text-[11px] font-semibold text-slate-700 truncate"
                  >
                    • {m}
                  </span>
                ))}
                {(patient.currentMedications?.length || 0) > 2 && (
                  <span className="text-[10px] font-bold text-primary block mt-0.5 cursor-pointer hover:underline">
                    +{(patient.currentMedications?.length || 3) - 2} more
                  </span>
                )}
              </div>
            </div>

            {/* Last Updated */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar size={12} className="text-slate-400" />
                Last Updated
              </span>
              <p className="font-bold text-slate-800 text-xs mt-0.5">
                {patient.lastUpdated || "12 Aug 2026"}
              </p>
              <p className="text-[11px] font-medium text-slate-400">by Patient / Kiosk</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TOP 3 METRIC CARDS: Priority Findings, Abnormal Values, Normal Values   */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Priority Findings (Red) */}
        <div className="bg-rose-50/60 rounded-2xl border border-rose-200/90 p-5 flex items-start justify-between shadow-2xs hover:shadow-xs transition-all">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <AlertTriangle size={15} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Priority Findings
              </span>
            </div>
            <div className="pt-2">
              <span className="text-3xl md:text-4xl font-black text-rose-700 tracking-tight leading-none block">
                {metrics?.priorityFindings ?? 4}
              </span>
              <p className="text-xs font-bold text-rose-800 mt-1">
                Require Physician Review
              </p>
            </div>
          </div>
          <button className="text-xs font-bold text-rose-700 hover:text-rose-900 inline-flex items-center gap-0.5 self-end mt-4 cursor-pointer">
            View All →
          </button>
        </div>

        {/* Card 2: Abnormal Values (Amber) */}
        <div className="bg-amber-50/60 rounded-2xl border border-amber-200/90 p-5 flex items-start justify-between shadow-2xs hover:shadow-xs transition-all">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <AlertCircle size={15} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Abnormal Values
              </span>
            </div>
            <div className="pt-2">
              <span className="text-3xl md:text-4xl font-black text-amber-600 tracking-tight leading-none block">
                {metrics?.abnormalValues ?? 6}
              </span>
              <p className="text-xs font-bold text-amber-800 mt-1">
                Out of {metrics?.totalParameters ?? 28} Parameters
              </p>
            </div>
          </div>
          <button className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-0.5 self-end mt-4 cursor-pointer">
            View All →
          </button>
        </div>

        {/* Card 3: Normal Values (Green) */}
        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/90 p-5 flex items-start justify-between shadow-2xs hover:shadow-xs transition-all">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CheckCircle2 size={15} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Normal Values
              </span>
            </div>
            <div className="pt-2">
              <span className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tight leading-none block">
                {metrics?.normalValues ?? 18}
              </span>
              <p className="text-xs font-bold text-emerald-800 mt-1">
                Within Normal Range
              </p>
            </div>
          </div>
          <button className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-0.5 self-end mt-4 cursor-pointer">
            View All →
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT GRID (Left: Types, Center: AI Summary, Right: Reports) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ------------------------------------------------------------- */}
        {/* LEFT COLUMN: Report Types breakdown (Col span 2)              */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Report Types
            </h3>
            <p className="text-[11px] font-medium text-slate-400">Indexed modalities</p>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { label: "Blood Test", count: reportTypes?.bloodTest ?? 3, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "MRI", count: reportTypes?.mri ?? 1, color: "text-sky-600", bg: "bg-sky-50" },
              { label: "CT Scan", count: reportTypes?.ctScan ?? 1, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "X-Ray", count: reportTypes?.xray ?? 2, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "ECG", count: reportTypes?.ecg ?? 1, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Ultrasound", count: reportTypes?.ultrasound ?? 1, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Prescription", count: reportTypes?.prescription ?? 3, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Others", count: reportTypes?.others ?? 2, color: "text-slate-600", bg: "bg-slate-50" },
            ].map((it, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${it.bg} border ${it.color}`} />
                  <span className="font-semibold text-slate-700">{it.label}</span>
                </div>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                  {it.count}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full pt-2 border-t border-slate-100 text-center text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">
            View All Reports →
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CENTER COLUMN: AI Clinical Summary & Trends (Col span 6)      */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-6 space-y-5">
          {/* AI Clinical Summary Header & Key Takeaways Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <Activity size={16} />
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Medical Summary
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Consolidated overview of all reports, trends and important findings.
                </p>
              </div>

              <button
                onClick={handlePrintDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
              >
                <Download size={13} />
                <span>Download Summary</span>
              </button>
            </div>

            {/* Key Takeaways */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-primary font-bold">✦</span>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Key Takeaways
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 leading-relaxed pl-1">
                {(aiSummary?.keyTakeaways || [
                  "Patient has a history of Type 2 Diabetes Mellitus and Hypertension.",
                  "Recent reports show elevated HbA1c, declining hemoglobin levels and increasing creatinine.",
                  "Imaging (CT & MRI) shows a lesion in the liver that requires further evaluation.",
                  "Overall, there is a need for closer monitoring of metabolic parameters and a review of imaging findings by the treating physician.",
                ]).map((bullet: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Side-by-Side: Most Important Findings vs Positive Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Left: Most Important Findings (Red Box) */}
              <div className="bg-rose-50/50 rounded-xl border border-rose-200 p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-rose-700 font-extrabold text-xs">
                  <AlertTriangle size={14} className="text-rose-600 shrink-0" />
                  <span>Most Important Findings</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  {(aiSummary?.mostImportantFindings || [
                    { title: "Elevated HbA1c (8.7%)", detail: "poor glycemic control", source: "Blood Test (12 Aug 2026)" },
                    { title: "Low Hemoglobin (9.2 g/dL)", detail: "possible anemia", source: "Blood Test (12 Aug 2026)" },
                    { title: "Increasing Creatinine (1.4 mg/dL)", detail: "kidney function monitoring needed", source: "Blood Test (10 Aug 2026)" },
                    { title: "CT & MRI: 2.3 cm liver lesion", detail: "requires further evaluation", source: "CT Scan (05 Aug 2026)" },
                  ]).map((item: any, idx: number) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <p className="text-slate-800 leading-snug">
                          <strong className="text-rose-900 font-bold">{item.title}</strong>
                          {item.detail && <span> — {item.detail}</span>}
                        </p>
                      </div>
                      {item.source && (
                        <span className="text-[10px] font-semibold text-slate-400 pl-3.5 block">
                          Source: {item.source}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Positive Highlights (Green Box) */}
              <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Positive Highlights</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  {(aiSummary?.positiveHighlights || [
                    { title: "Platelets within normal range", source: "Blood Test (12 Aug 2026)" },
                    { title: "Liver enzymes (AST/ALT) normal", source: "Blood Test (12 Aug 2026)" },
                    { title: "Thyroid function normal", source: "Thyroid Profile (20 Jul 2026)" },
                  ]).map((item: any, idx: number) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <p className="text-slate-800 leading-snug font-semibold">
                          {item.title}
                        </p>
                      </div>
                      {item.source && (
                        <span className="text-[10px] font-semibold text-slate-400 pl-3.5 block">
                          Source: {item.source}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trends Over Time (Sparklines) */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-primary" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Trends Over Time
                  </h4>
                </div>
                <button className="text-xs font-bold text-primary hover:underline cursor-pointer">
                  View All Trends →
                </button>
              </div>

              {/* 4 Sparkline Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(aiSummary?.trends || []).map((t: TrendData, idx: number) => (
                  <SparklineCard key={idx} trend={t} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* RIGHT COLUMN: Detailed Report Analysis, Meds & Docs (Col span 4) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-5">
          {/* Detailed Report Analysis */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Detailed Report Analysis
                </h3>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "All Reports" },
                { id: "lab", label: "Lab Reports" },
                { id: "imaging", label: "Imaging" },
                { id: "others", label: "Others" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setReportFilter(pill.id)}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
                    reportFilter === pill.id
                      ? "bg-primary text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Report Items */}
            <div className="space-y-2.5">
              {filteredReports.map((rep: any, idx: number) => {
                const isRed = rep.status === "Requires Review" || rep.statusColor === "red";
                const isAmber = rep.status === "Abnormal Values" || rep.statusColor === "amber";
                const isGreen = rep.status === "Normal" || rep.statusColor === "green";

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedReportModal(rep)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all flex items-center justify-between gap-2 cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                        {rep.title}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {rep.date} • {rep.pages || 1} {rep.pages === 1 ? "page" : "pages"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isRed
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : isAmber
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : isGreen
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-sky-50 text-sky-700 border-sky-200"
                        }`}
                      >
                        {rep.status}
                      </span>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full pt-2 border-t border-slate-100 text-center text-xs font-bold text-primary hover:underline cursor-pointer">
              View All Reports →
            </button>
          </div>

          {/* Medication Summary Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Pill size={15} className="text-primary" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Medication Summary
                </h3>
              </div>
              <button className="text-[11px] font-bold text-primary hover:underline cursor-pointer">
                View All Medications →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-wider">
                    <th className="pb-2 font-bold">Medicine</th>
                    <th className="pb-2 font-bold">Dose</th>
                    <th className="pb-2 font-bold">Frequency</th>
                    <th className="pb-2 font-bold text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 font-medium text-slate-700">
                  {(medicationSummary || [
                    { medicine: "Metformin", dose: "500 mg", frequency: "Twice daily", duration: "-" },
                    { medicine: "Amlodipine", dose: "10 mg", frequency: "Once daily", duration: "-" },
                    { medicine: "Atorvastatin", dose: "20 mg", frequency: "Once daily", duration: "-" },
                  ]).map((m: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 font-bold text-slate-900">{m.medicine}</td>
                      <td className="py-2 text-slate-600">{m.dose}</td>
                      <td className="py-2 text-slate-600">{m.frequency}</td>
                      <td className="py-2 text-right text-slate-400">{m.duration || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Documents Previews */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Recent Documents
              </h3>
              <button className="text-[11px] font-bold text-primary hover:underline cursor-pointer">
                View All →
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1 text-center">
              {(recentDocuments || [
                { title: "MRI Report", date: "05 Aug 2026", type: "mri" },
                { title: "CT Scan Report", date: "05 Aug 2026", type: "ct" },
                { title: "Blood Test Report", date: "12 Aug 2026", type: "blood" },
              ]).map((doc: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-2xs transition-all cursor-pointer flex flex-col items-center justify-center group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-2xs">
                    <FileText size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 mt-2 truncate max-w-full">
                    {doc.title}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {doc.date}
                  </span>
                </div>
              ))}
              <div className="p-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/40 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                <span className="text-xs font-bold text-primary">+12 more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MEDICAL TIMELINE (Horizontal connecting line at bottom)                */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Activity size={16} />
            </span>
            <h3 className="text-sm font-extrabold text-slate-900">
              Medical Timeline
            </h3>
          </div>
          <button className="text-xs font-bold text-primary hover:underline cursor-pointer">
            View Full Timeline →
          </button>
        </div>

        {/* Timeline Horizontal Line with Nodes */}
        <div className="relative pt-4 pb-2 overflow-x-auto">
          <div className="min-w-162.5 relative">
            {/* Background Line */}
            <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-indigo-100" />

            <div className="flex items-start justify-between relative z-10 px-2">
              {(timeline || [
                { date: "Jan 2025", title: "Diabetes Diagnosed" },
                { date: "Apr 2025", title: "Blood Test" },
                { date: "Aug 2025", title: "CT Scan" },
                { date: "Nov 2025", title: "Hospitalization" },
                { date: "Feb 2026", title: "MRI" },
                { date: "Apr 2026", title: "Blood Test" },
                { date: "Aug 2026", title: "Prescription" },
              ]).map((node: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center text-center max-w-22.5">
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-primary shadow-xs flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-800 mt-2 block">
                    {node.date}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 mt-0.5 leading-tight block">
                    {node.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DISCLAIMER FOOTER                                                      */}
      {/* ========================================================================= */}
      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 leading-relaxed">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <p>
          {disclaimer ||
            "Note: This medical summary is based on the uploaded reports and may contain uncertainties. Please verify critical findings with the original reports."}
        </p>
      </div>

      {/* Detail Modal if Report Clicked */}
      {selectedReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-extrabold text-slate-900">{selectedReportModal.title}</h4>
              <button
                onClick={() => setSelectedReportModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong className="text-slate-800">Date:</strong> {selectedReportModal.date}</p>
              <p><strong className="text-slate-800">Pages:</strong> {selectedReportModal.pages}</p>
              <p><strong className="text-slate-800">Clinical Status:</strong> {selectedReportModal.status}</p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                {selectedReportModal.summary || "Complete clinical parameters parsed and validated against reference norms."}
              </div>
            </div>
            <button
              onClick={() => setSelectedReportModal(null)}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer hover:bg-primary/95"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Helper Subcomponent: Sparkline Card with SVG Area Chart
// ============================================================================
const SparklineCard: React.FC<{ trend: TrendData }> = ({ trend }) => {
  const isUp = trend.direction === "up";
  const isAbnormal = trend.isAbnormal;
  const strokeColor = trend.color || (isAbnormal ? "#ef4444" : "#10b981");

  // Normalize points into an SVG path (viewBox: 0 0 100 40)
  const values = trend.values?.map((v) => v.value) || [1, 2, 3];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 96 + 2;
    const y = 36 - ((v - min) / range) * 30;
    return { x, y };
  });

  const linePath = points.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
  const areaPath = `${linePath} L ${points[points.length - 1].x} 40 L ${points[0].x} 40 Z`;

  const valuesDisplay = values.join(" → ");

  return (
    <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col justify-between">
      <div>
        <span className="text-[11px] font-bold text-slate-800 block truncate">
          {trend.metric}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 mt-0.5">
          <span>{valuesDisplay}</span>
          <span className={isAbnormal ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
            {isUp ? "↑" : "↓"}
          </span>
        </div>
      </div>

      <div className="my-2 h-10 w-full">
        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`grad-${trend.metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#grad-${trend.metric})`} />
          <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" />
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[10px]">
        <span
          className={`px-2 py-0.5 rounded-md font-extrabold ${
            isAbnormal
              ? "bg-rose-100/80 text-rose-800"
              : "bg-emerald-100/80 text-emerald-800"
          }`}
        >
          {trend.statusText}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// Multi-Patient Fallback Reference Data for designated accounts (user1..user5)
// ============================================================================
function getDefaultPatientData(targetId: string = "user1") {
  const query = (targetId || "").toLowerCase();

  // Patient 2: Emma Watson (Hashimoto Thyroiditis, Anemia)
  if (query.includes("user2") || query.includes("1002") || query.includes("emma")) {
    return {
      patient: {
        id: "dd282916-ac7a-4ca8-a6c0-e63ffc621002",
        patientId: "MK-1002",
        name: "Emma Watson",
        age: 28,
        gender: "Female",
        bloodGroup: "O+",
        allergies: ["Sulfa drugs"],
        knownConditions: ["Hashimoto Thyroiditis", "Microcytic Hypochromic Anemia"],
        currentMedications: ["Levothyroxine 75 mcg (OD morning)", "Iron Bisglycinate 30 mg (OD)"],
        lastUpdated: "10 Aug 2026 by Patient",
      },
      metrics: {
        priorityFindings: 3,
        abnormalValues: 5,
        normalValues: 17,
        totalParameters: 25,
      },
      reportTypes: {
        bloodTest: 3,
        mri: 0,
        ctScan: 0,
        xray: 0,
        ecg: 1,
        ultrasound: 1,
        prescription: 2,
        others: 1,
      },
      aiSummary: {
        keyTakeaways: [
          "Patient has primary hypothyroidism secondary to autoimmune Hashimoto's thyroiditis with Anti-TPO >600 IU/mL.",
          "Lab tests demonstrate inadequate thyroid hormone replacement (TSH elevated at 14.2 mIU/L).",
          "Concomitant iron-deficiency anemia with low serum ferritin (9 ng/mL) and microcytic indices (MCV 72 fL).",
          "Thyroid ultrasound confirms diffusely heterogeneous parenchyma and increased vascularity (thyroid inferno).",
        ],
        mostImportantFindings: [
          {
            id: "f1",
            title: "Elevated TSH (14.2 mIU/L)",
            detail: "inadequate thyroid replacement",
            source: "Thyroid Panel (08 Aug 2026)",
            priority: "critical",
          },
          {
            id: "f2",
            title: "Low Serum Ferritin (9 ng/mL)",
            detail: "depleted iron stores / microcytic anemia",
            source: "Iron Profile (08 Aug 2026)",
            priority: "high",
          },
          {
            id: "f3",
            title: "Elevated Anti-TPO (>600 IU/mL)",
            detail: "active autoimmune thyroiditis",
            source: "Autoantibody Panel (08 Aug 2026)",
            priority: "critical",
          },
          {
            id: "f4",
            title: "Thyroid Ultrasound: Hashimoto Pattern",
            detail: "diffuse micronodular parenchymal changes",
            source: "Ultrasound Neck (15 Jul 2026)",
            priority: "high",
          },
        ],
        positiveHighlights: [
          { id: "p1", title: "Renal profile & electrolytes normal", source: "RFT (08 Aug 2026)" },
          { id: "p2", title: "Fasting glucose normal (88 mg/dL)", source: "Metabolic Panel (08 Aug 2026)" },
          { id: "p3", title: "Resting ECG normal sinus rhythm", source: "12-lead ECG (10 Jul 2026)" },
        ],
        trends: [
          {
            metric: "TSH",
            unit: "mIU/L",
            values: [
              { label: "Dec 25", value: 4.2 },
              { label: "Apr 26", value: 8.6 },
              { label: "Aug 26", value: 14.2 },
            ],
            statusText: "Increasing",
            direction: "up",
            isAbnormal: true,
            color: "#ef4444",
          },
          {
            metric: "Ferritin",
            unit: "ng/mL",
            values: [
              { label: "Dec 25", value: 24 },
              { label: "Apr 26", value: 16 },
              { label: "Aug 26", value: 9 },
            ],
            statusText: "Critically Low",
            direction: "down",
            isAbnormal: true,
            color: "#ef4444",
          },
          {
            metric: "Hemoglobin",
            unit: "g/dL",
            values: [
              { label: "Dec 25", value: 12.1 },
              { label: "Apr 26", value: 11.0 },
              { label: "Aug 26", value: 10.2 },
            ],
            statusText: "Declining",
            direction: "down",
            isAbnormal: true,
            color: "#ef4444",
          },
          {
            metric: "Free T4",
            unit: "ng/dL",
            values: [
              { label: "Dec 25", value: 1.1 },
              { label: "Apr 26", value: 0.9 },
              { label: "Aug 26", value: 0.72 },
            ],
            statusText: "Subnormal",
            direction: "down",
            isAbnormal: true,
            color: "#f59e0b",
          },
        ],
      },
      detailedReports: [
        {
          id: "rep-thyroid",
          title: "Thyroid Function & Autoantibodies",
          type: "lab",
          date: "08 Aug 2026",
          pages: 2,
          status: "Abnormal Values",
          statusColor: "amber",
          summary: "TSH 14.2 mIU/L, FT4 0.72 ng/dL, Anti-TPO >600 IU/mL. High thyroiditis activity.",
        },
        {
          id: "rep-cbc",
          title: "Complete Blood Count & Ferritin",
          type: "lab",
          date: "08 Aug 2026",
          pages: 3,
          status: "Requires Review",
          statusColor: "red",
          summary: "Hemoglobin 10.2 g/dL, MCV 72 fL, Ferritin 9 ng/mL. Marked microcytic hypochromia.",
        },
        {
          id: "rep-usg",
          title: "Thyroid Ultrasound Doppler",
          type: "imaging",
          date: "15 Jul 2026",
          pages: 2,
          status: "Requires Review",
          statusColor: "red",
          summary: "Diffusely heterogeneous echo-texture with hypervascularity indicative of chronic autoimmune thyroiditis.",
        },
        {
          id: "rep-rx-2",
          title: "Endocrinology Prescription",
          type: "prescription",
          date: "08 Aug 2026",
          pages: 1,
          status: "Medications Extracted",
          statusColor: "cyan",
          summary: "Levothyroxine 75 mcg OD, Iron Bisglycinate 30 mg OD.",
        },
      ],
      medicationSummary: [
        { medicine: "Levothyroxine", dose: "75 mcg", frequency: "Once daily (morning empty stomach)", duration: "Continuous" },
        { medicine: "Iron Bisglycinate", dose: "30 mg", frequency: "Once daily", duration: "3 months" },
      ],
      recentDocuments: [
        { id: "doc-tsh", title: "Thyroid Panel", date: "08 Aug 2026", type: "lab" },
        { id: "doc-cbc", title: "CBC & Iron", date: "08 Aug 2026", type: "lab" },
        { id: "doc-usg", title: "Thyroid Doppler", date: "15 Jul 2026", type: "imaging" },
      ],
      timeline: [
        { date: "Dec 2024", title: "Persistent Fatigue" },
        { date: "Apr 2025", title: "TSH & Anti-TPO Test" },
        { date: "Aug 2025", title: "Ultrasound Thyroid" },
        { date: "Jan 2026", title: "Dose Titration" },
        { date: "Aug 2026", title: "Endocrinology Follow-up" },
      ],
      disclaimer: "Note: This medical summary is based on uploaded records and may contain uncertainties. Verify lab norms with the hospital pathology report.",
    };
  }

  // Patient 3: Rajesh Kumar (Coronary Artery Disease, Hyperlipidemia)
  if (query.includes("user3") || query.includes("1003") || query.includes("rajesh")) {
    return {
      patient: {
        id: "e491fa55-6b8f-4cb1-80a4-378aa4921003",
        patientId: "MK-1003",
        name: "Rajesh Kumar",
        age: 59,
        gender: "Male",
        bloodGroup: "AB+",
        allergies: ["None"],
        knownConditions: ["Coronary Artery Disease (CAD)", "Primary Hyperlipidemia", "Grade 1 Hypertension"],
        currentMedications: ["Atorvastatin 40 mg (HS)", "Aspirin 75 mg (OD)", "Telmisartan 40 mg (OD)"],
        lastUpdated: "11 Aug 2026 by Patient",
      },
      metrics: {
        priorityFindings: 3,
        abnormalValues: 5,
        normalValues: 19,
        totalParameters: 27,
      },
      reportTypes: {
        bloodTest: 3,
        mri: 0,
        ctScan: 1,
        xray: 1,
        ecg: 2,
        ultrasound: 1,
        prescription: 3,
        others: 1,
      },
      aiSummary: {
        keyTakeaways: [
          "Patient has confirmed ischemic heart disease and dyslipidemia with exertional angina history.",
          "Resting 12-lead ECG demonstrates lateral T-wave inversions (V5-V6) indicating myocardial ischemia.",
          "Lipid panel demonstrates persistently elevated LDL-C (162 mg/dL) despite statin therapy.",
          "2D Echocardiogram shows mild LV diastolic dysfunction with preserved LVEF of 58%.",
        ],
        mostImportantFindings: [
          {
            id: "f1",
            title: "Elevated LDL-C (162 mg/dL)",
            detail: "atherogenic risk above target (<70 mg/dL)",
            source: "Lipid Profile (09 Aug 2026)",
            priority: "critical",
          },
          {
            id: "f2",
            title: "Resting ECG: Lateral T-wave Inversion",
            detail: "V5-V6 ischemic repolarization changes",
            source: "12-Lead ECG (09 Aug 2026)",
            priority: "critical",
          },
          {
            id: "f3",
            title: "Borderline Elevated hs-CRP (3.8 mg/L)",
            detail: "systemic vascular inflammation",
            source: "Cardiac Biomarkers (09 Aug 2026)",
            priority: "high",
          },
          {
            id: "f4",
            title: "Mild LV Diastolic Dysfunction",
            detail: "E/A ratio 0.7, preserved systolic EF 58%",
            source: "2D Echo (20 Jun 2026)",
            priority: "high",
          },
        ],
        positiveHighlights: [
          { id: "p1", title: "Preserved LV ejection fraction (58%)", source: "2D Echo (20 Jun 2026)" },
          { id: "p2", title: "Serum creatinine within normal range (0.95 mg/dL)", source: "RFT (09 Aug 2026)" },
          { id: "p3", title: "Normal Fasting Blood Sugar (96 mg/dL)", source: "Blood Test (09 Aug 2026)" },
        ],
        trends: [
          {
            metric: "LDL Cholesterol",
            unit: "mg/dL",
            values: [
              { label: "Oct 25", value: 188 },
              { label: "Mar 26", value: 174 },
              { label: "Aug 26", value: 162 },
            ],
            statusText: "Improving but Above Target",
            direction: "down",
            isAbnormal: true,
            color: "#ef4444",
          },
          {
            metric: "BP Systolic",
            unit: "mmHg",
            values: [
              { label: "Oct 25", value: 152 },
              { label: "Mar 26", value: 144 },
              { label: "Aug 26", value: 136 },
            ],
            statusText: "Controlled",
            direction: "down",
            isAbnormal: false,
            color: "#10b981",
          },
          {
            metric: "hs-CRP",
            unit: "mg/L",
            values: [
              { label: "Oct 25", value: 4.6 },
              { label: "Mar 26", value: 4.1 },
              { label: "Aug 26", value: 3.8 },
            ],
            statusText: "Mild Inflammation",
            direction: "down",
            isAbnormal: true,
            color: "#f59e0b",
          },
          {
            metric: "HDL Cholesterol",
            unit: "mg/dL",
            values: [
              { label: "Oct 25", value: 36 },
              { label: "Mar 26", value: 38 },
              { label: "Aug 26", value: 41 },
            ],
            statusText: "Normalizing",
            direction: "up",
            isAbnormal: false,
            color: "#10b981",
          },
        ],
      },
      detailedReports: [
        {
          id: "rep-lipid",
          title: "Comprehensive Lipid & Cardiac Biomarkers",
          type: "lab",
          date: "09 Aug 2026",
          pages: 4,
          status: "Abnormal Values",
          statusColor: "amber",
          summary: "Total Chol 242 mg/dL, LDL-C 162 mg/dL, Triglycerides 195 mg/dL, hs-CRP 3.8 mg/L.",
        },
        {
          id: "rep-ecg-3",
          title: "12-Lead Electrocardiogram",
          type: "others",
          date: "09 Aug 2026",
          pages: 1,
          status: "Requires Review",
          statusColor: "red",
          summary: "Sinus rhythm at 72 bpm. Symmetrical T-wave inversions in lateral leads V5, V6, and aVL.",
        },
        {
          id: "rep-echo",
          title: "2D Echocardiogram Doppler",
          type: "imaging",
          date: "20 Jun 2026",
          pages: 3,
          status: "Requires Review",
          statusColor: "red",
          summary: "Concentric LV remodeling, Grade 1 diastolic dysfunction, preserved global systolic function (LVEF 58%).",
        },
        {
          id: "rep-rx-3",
          title: "Cardiology Prescription",
          type: "prescription",
          date: "09 Aug 2026",
          pages: 2,
          status: "Medications Extracted",
          statusColor: "cyan",
          summary: "Atorvastatin 40 mg HS, Aspirin 75 mg OD, Telmisartan 40 mg OD.",
        },
      ],
      medicationSummary: [
        { medicine: "Atorvastatin", dose: "40 mg", frequency: "Once daily at bedtime", duration: "Ongoing" },
        { medicine: "Aspirin", dose: "75 mg", frequency: "Once daily after food", duration: "Ongoing" },
        { medicine: "Telmisartan", dose: "40 mg", frequency: "Once daily morning", duration: "Ongoing" },
      ],
      recentDocuments: [
        { id: "doc-lipid", title: "Lipid Panel", date: "09 Aug 2026", type: "lab" },
        { id: "doc-ecg", title: "12-Lead ECG", date: "09 Aug 2026", type: "ecg" },
        { id: "doc-echo", title: "Echocardiogram", date: "20 Jun 2026", type: "echo" },
      ],
      timeline: [
        { date: "Sep 2024", title: "Exertional Angina" },
        { date: "Dec 2024", title: "Coronary CTA" },
        { date: "Jun 2025", title: "Echo & Lipid Panel" },
        { date: "Jan 2026", title: "Routine ECG" },
        { date: "Aug 2026", title: "Cardiology Review" },
      ],
      disclaimer: "Note: This medical summary is based on uploaded clinical records and may contain uncertainties. Verify findings with treating cardiologist.",
    };
  }

  // Patient 4: Sarah Hosten (Chronic Migraine with Aura, Cervical Radiculopathy)
  if (query.includes("user4") || query.includes("1004") || query.includes("sarah")) {
    return {
      patient: {
        id: "c83b8602-5c4d-44aa-9c31-64d88e891004",
        patientId: "MK-1004",
        name: "Sarah Hosten",
        age: 34,
        gender: "Female",
        bloodGroup: "A+",
        allergies: ["NSAIDs (Ibuprofen)"],
        knownConditions: ["Chronic Migraine with Visual Aura", "Cervical Radiculopathy (C5-C6)"],
        currentMedications: ["Sumatriptan 50 mg (SOS)", "Propranolol 40 mg (OD)", "Magnesium Glycinate 400 mg (OD)"],
        lastUpdated: "12 Aug 2026 by Patient",
      },
      metrics: {
        priorityFindings: 2,
        abnormalValues: 4,
        normalValues: 18,
        totalParameters: 24,
      },
      reportTypes: {
        bloodTest: 2,
        mri: 2,
        ctScan: 0,
        xray: 1,
        ecg: 1,
        ultrasound: 0,
        prescription: 2,
        others: 1,
      },
      aiSummary: {
        keyTakeaways: [
          "Patient has recurrent disabling migraines with visual aura occurring 8-10 days per month.",
          "Brain MRI is reassuringly negative for intracranial mass lesion, acute infarction, or hemorrhage.",
          "Cervical spine MRI demonstrates C5-C6 posterior disc bulge causing mild neural foraminal narrowing.",
          "Patient has severe sensitivity/allergy to NSAIDs; acute management relies on triptans and antiemetics.",
        ],
        mostImportantFindings: [
          {
            id: "f1",
            title: "Brain MRI: White Matter Hyperintensities",
            detail: "non-specific punctate T2/FLAIR lesions consistent with migraine",
            source: "3T Brain MRI (14 Jul 2026)",
            priority: "high",
          },
          {
            id: "f2",
            title: "Cervical MRI: C5-C6 Disc Protrusion",
            detail: "broad-based bulge with mild right foraminal exit stenosis",
            source: "Cervical Spine MRI (14 Jul 2026)",
            priority: "high",
          },
          {
            id: "f3",
            title: "High HIT-6 Disability Score (68/78)",
            detail: "severe headache impact on quality of life",
            source: "Neurology Assessment (02 Aug 2026)",
            priority: "moderate",
          },
          {
            id: "f4",
            title: "NSAID Allergy Warning",
            detail: "severe bronchospasm history with Ibuprofen",
            source: "Allergy Record (02 Aug 2026)",
            priority: "critical",
          },
        ],
        positiveHighlights: [
          { id: "p1", title: "Intracranial MRA circle of Willis normal", source: "Brain MRA (14 Jul 2026)" },
          { id: "p2", title: "Complete neurological cranial nerve exam normal", source: "Neurology Exam (02 Aug 2026)" },
          { id: "p3", title: "Inflammatory markers (ESR, CRP) negative", source: "Blood Panel (02 Aug 2026)" },
        ],
        trends: [
          {
            metric: "Monthly Headache Days",
            unit: "days",
            values: [
              { label: "Nov 25", value: 14 },
              { label: "Mar 26", value: 11 },
              { label: "Aug 26", value: 8 },
            ],
            statusText: "Improving on Prophylaxis",
            direction: "down",
            isAbnormal: true,
            color: "#f59e0b",
          },
          {
            metric: "HIT-6 Score",
            unit: "pts",
            values: [
              { label: "Nov 25", value: 74 },
              { label: "Mar 26", value: 71 },
              { label: "Aug 26", value: 68 },
            ],
            statusText: "Moderate Impact",
            direction: "down",
            isAbnormal: true,
            color: "#f59e0b",
          },
          {
            metric: "Mean Sleep Duration",
            unit: "hrs",
            values: [
              { label: "Nov 25", value: 5.2 },
              { label: "Mar 26", value: 6.1 },
              { label: "Aug 26", value: 6.8 },
            ],
            statusText: "Optimizing",
            direction: "up",
            isAbnormal: false,
            color: "#10b981",
          },
          {
            metric: "Diastolic BP",
            unit: "mmHg",
            values: [
              { label: "Nov 25", value: 82 },
              { label: "Mar 26", value: 78 },
              { label: "Aug 26", value: 72 },
            ],
            statusText: "Normal",
            direction: "down",
            isAbnormal: false,
            color: "#10b981",
          },
        ],
      },
      detailedReports: [
        {
          id: "rep-mri-brain",
          title: "3T Brain MRI & MR Angiography",
          type: "imaging",
          date: "14 Jul 2026",
          pages: 4,
          status: "Requires Review",
          statusColor: "red",
          summary: "No intracranial acute infarct or mass. Few punctate deep subcortical T2/FLAIR hyperintensities. Normal MRA.",
        },
        {
          id: "rep-mri-cervical",
          title: "Cervical Spine MRI",
          type: "imaging",
          date: "14 Jul 2026",
          pages: 3,
          status: "Requires Review",
          statusColor: "red",
          summary: "C5-C6 broad-based posterior disc protrusion indenting the thecal sac with mild right neuroforaminal compromise.",
        },
        {
          id: "rep-neuro-eval",
          title: "Neurology Headache Assessment",
          type: "others",
          date: "02 Aug 2026",
          pages: 2,
          status: "Abnormal Values",
          statusColor: "amber",
          summary: "Confirmed chronic migraine with aura. Prophylaxis with Propranolol 40mg initiated; NSAIDs strictly avoided.",
        },
        {
          id: "rep-rx-4",
          title: "Neurology Prescription",
          type: "prescription",
          date: "02 Aug 2026",
          pages: 1,
          status: "Medications Extracted",
          statusColor: "cyan",
          summary: "Sumatriptan 50 mg SOS, Propranolol 40 mg OD, Magnesium Glycinate 400 mg OD.",
        },
      ],
      medicationSummary: [
        { medicine: "Sumatriptan", dose: "50 mg", frequency: "SOS at migraine onset", duration: "As needed" },
        { medicine: "Propranolol", dose: "40 mg", frequency: "Once daily morning", duration: "6 months" },
        { medicine: "Magnesium Glycinate", dose: "400 mg", frequency: "Once daily bedtime", duration: "Ongoing" },
      ],
      recentDocuments: [
        { id: "doc-brain-mri", title: "Brain MRI", date: "14 Jul 2026", type: "mri" },
        { id: "doc-spine-mri", title: "C-Spine MRI", date: "14 Jul 2026", type: "mri" },
        { id: "doc-neuro", title: "Neurology Note", date: "02 Aug 2026", type: "note" },
      ],
      timeline: [
        { date: "Jul 2024", title: "Migraine Flare" },
        { date: "Nov 2024", title: "Brain MRI" },
        { date: "Apr 2025", title: "Cervical MRI" },
        { date: "Jun 2025", title: "Propranolol Starter" },
        { date: "Aug 2026", title: "Neurology Follow-up" },
      ],
      disclaimer: "Note: This summary is based on neurology and imaging workup records. Please verify treatment instructions with attending neurologist.",
    };
  }

  // Patient 5: Vikram Malhotra (Type 2 Diabetes, Grade 2 NAFLD)
  if (query.includes("user5") || query.includes("1005") || query.includes("vikram")) {
    return {
      patient: {
        id: "2d7ec55c-1965-4f46-8e14-e53b27b91005",
        patientId: "MK-1005",
        name: "Vikram Malhotra",
        age: 38,
        gender: "Male",
        bloodGroup: "O+",
        allergies: ["Shellfish"],
        knownConditions: ["Type 2 Diabetes Mellitus", "Metabolic Steatotic Liver Disease (Grade 2 NAFLD)"],
        currentMedications: ["Metformin XR 1000 mg (OD dinner)", "Empagliflozin 10 mg (OD morning)"],
        lastUpdated: "12 Aug 2026 by Patient",
      },
      metrics: {
        priorityFindings: 3,
        abnormalValues: 6,
        normalValues: 18,
        totalParameters: 27,
      },
      reportTypes: {
        bloodTest: 4,
        mri: 0,
        ctScan: 0,
        xray: 1,
        ecg: 1,
        ultrasound: 1,
        prescription: 2,
        others: 1,
      },
      aiSummary: {
        keyTakeaways: [
          "Patient has uncontrolled Type 2 Diabetes Mellitus with elevated HbA1c at 8.2%.",
          "Abdominal ultrasound and FibroScan establish Grade 2 Hepatic Steatosis (CAP score 298 dB/m) with F1 liver stiffness (6.1 kPa).",
          "Liver enzymes demonstrate transaminitis (ALT 64 U/L, AST 48 U/L) indicative of active metabolic steatohepatitis.",
          "Early microvascular surveillance shows mild microalbuminuria (UACR 45 mg/g); renal filtration is preserved.",
        ],
        mostImportantFindings: [
          {
            id: "f1",
            title: "Elevated HbA1c (8.2%)",
            detail: "suboptimal glycemic control (target <7.0%)",
            source: "Glycemic Profile (11 Aug 2026)",
            priority: "critical",
          },
          {
            id: "f2",
            title: "Elevated ALT (64 U/L) & AST (48 U/L)",
            detail: "metabolic steatohepatitis activity",
            source: "Liver Function Test (11 Aug 2026)",
            priority: "high",
          },
          {
            id: "f3",
            title: "FibroScan CAP 298 dB/m",
            detail: "Grade 2 diffuse hepatic steatosis",
            source: "Transient Elastography (18 Jul 2026)",
            priority: "critical",
          },
          {
            id: "f4",
            title: "Urine Microalbuminuria (UACR 45 mg/g)",
            detail: "early diabetic nephropathy marker",
            source: "Spot Urine Albumin/Creatinine (11 Aug 2026)",
            priority: "high",
          },
        ],
        positiveHighlights: [
          { id: "p1", title: "Preserved eGFR (>90 mL/min/1.73m²)", source: "Renal Function (11 Aug 2026)" },
          { id: "p2", title: "Platelet count normal (248,000 /mcL)", source: "CBC (11 Aug 2026)" },
          { id: "p3", title: "Resting ECG normal sinus rhythm", source: "ECG (18 Jul 2026)" },
        ],
        trends: [
          {
            metric: "HbA1c",
            unit: "%",
            values: [
              { label: "Dec 25", value: 9.1 },
              { label: "Apr 26", value: 8.7 },
              { label: "Aug 26", value: 8.2 },
            ],
            statusText: "Gradually Improving",
            direction: "down",
            isAbnormal: true,
            color: "#ef4444",
          },
          {
            metric: "ALT (SGPT)",
            unit: "U/L",
            values: [
              { label: "Dec 25", value: 82 },
              { label: "Apr 26", value: 74 },
              { label: "Aug 26", value: 64 },
            ],
            statusText: "Elevated Transaminases",
            direction: "down",
            isAbnormal: true,
            color: "#ef4444",
          },
          {
            metric: "Fasting Glucose",
            unit: "mg/dL",
            values: [
              { label: "Dec 25", value: 184 },
              { label: "Apr 26", value: 162 },
              { label: "Aug 26", value: 148 },
            ],
            statusText: "Above Fasting Target",
            direction: "down",
            isAbnormal: true,
            color: "#f59e0b",
          },
          {
            metric: "Body Weight",
            unit: "kg",
            values: [
              { label: "Dec 25", value: 88.5 },
              { label: "Apr 26", value: 85.0 },
              { label: "Aug 26", value: 82.5 },
            ],
            statusText: "Weight Loss Progress",
            direction: "down",
            isAbnormal: false,
            color: "#10b981",
          },
        ],
      },
      detailedReports: [
        {
          id: "rep-cmp",
          title: "Comprehensive Metabolic & Glycemic Panel",
          type: "lab",
          date: "11 Aug 2026",
          pages: 4,
          status: "Abnormal Values",
          statusColor: "amber",
          summary: "HbA1c 8.2%, Fasting Glucose 148 mg/dL, ALT 64 U/L, AST 48 U/L, Triglycerides 210 mg/dL.",
        },
        {
          id: "rep-fibro",
          title: "Liver Ultrasound & Transient Elastography (FibroScan)",
          type: "imaging",
          date: "18 Jul 2026",
          pages: 3,
          status: "Requires Review",
          statusColor: "red",
          summary: "Increased hepatic acoustic attenuation. CAP score 298 dB/m (S2 steatosis). Liver stiffness 6.1 kPa (F1 mild fibrosis).",
        },
        {
          id: "rep-uacr",
          title: "Urine Albumin-to-Creatinine Ratio (UACR)",
          type: "lab",
          date: "11 Aug 2026",
          pages: 1,
          status: "Requires Review",
          statusColor: "red",
          summary: "UACR 45 mg/g creatinine. Consistent with persistent microalbuminuria; SGLT2i renoprotection indicated.",
        },
        {
          id: "rep-rx-5",
          title: "Diabetology Prescription",
          type: "prescription",
          date: "11 Aug 2026",
          pages: 2,
          status: "Medications Extracted",
          statusColor: "cyan",
          summary: "Metformin XR 1000 mg OD dinner, Empagliflozin 10 mg OD morning.",
        },
      ],
      medicationSummary: [
        { medicine: "Metformin XR", dose: "1000 mg", frequency: "Once daily with dinner", duration: "Ongoing" },
        { medicine: "Empagliflozin", dose: "10 mg", frequency: "Once daily morning", duration: "Ongoing" },
      ],
      recentDocuments: [
        { id: "doc-hba1c", title: "Glycemic Panel", date: "11 Aug 2026", type: "lab" },
        { id: "doc-fibroscan", title: "FibroScan Report", date: "18 Jul 2026", type: "imaging" },
        { id: "doc-uacr", title: "Microalbuminuria Test", date: "11 Aug 2026", type: "lab" },
      ],
      timeline: [
        { date: "Jan 2025", title: "Incidental High Glucose" },
        { date: "May 2025", title: "T2D Confirmed" },
        { date: "Oct 2025", title: "Abdominal Ultrasound" },
        { date: "Feb 2026", title: "Liver FibroScan" },
        { date: "Aug 2026", title: "Diabetology Review" },
      ],
      disclaimer: "Note: This clinical report is synthesized from patient laboratory data. Confirm clinical management plans with the consulting endocrinologist.",
    };
  }

  // Default Fallback: Patient 1: Priya Sharma (Bronchial Asthma, Allergic Rhinitis)
  return {
    patient: {
      id: "7047ac9d-9586-42fb-8728-acb9b52a1001",
      patientId: "MK-1001",
      name: "Priya Sharma",
      age: 34,
      gender: "Female",
      bloodGroup: "B+",
      allergies: ["Penicillin", "Dust Mites"],
      knownConditions: ["Bronchial Asthma", "Allergic Rhinitis", "Sinusitis"],
      currentMedications: ["Budecort Inhaler 200 mcg (BD)", "Levocetirizine 5 mg (OD)", "Montelukast 10 mg (HS)"],
      lastUpdated: "12 Aug 2026 by Patient",
    },
    metrics: {
      priorityFindings: 2,
      abnormalValues: 4,
      normalValues: 16,
      totalParameters: 22,
    },
    reportTypes: {
      bloodTest: 2,
      mri: 0,
      ctScan: 0,
      xray: 1,
      ecg: 0,
      ultrasound: 0,
      prescription: 2,
      others: 2,
    },
    aiSummary: {
      keyTakeaways: [
        "Patient has documented history of persistent bronchial asthma and perennial allergic rhinitis.",
        "Recent spirometry reveals moderate airflow limitation responding to bronchodilators.",
        "Serum total IgE is elevated at 380 IU/mL with positive reactivity to indoor dust mites.",
        "Chest radiograph confirms hyperinflated lung fields without focal consolidation or pneumothorax.",
      ],
      mostImportantFindings: [
        {
          id: "f1",
          title: "Elevated Total Serum IgE (380 IU/mL)",
          detail: "severe allergic atopic sensitization",
          source: "Allergy Blood Panel (10 Aug 2026)",
          priority: "critical",
        },
        {
          id: "f2",
          title: "Reduced FEV1/FVC Ratio (64%)",
          detail: "moderate obstructive airway limitation",
          source: "Spirometry / PFT (10 Aug 2026)",
          priority: "critical",
        },
        {
          id: "f3",
          title: "CT Paranasal Sinuses: Mucosal Thickening",
          detail: "bilateral maxillary sinus mucosal disease",
          source: "PNS CT Scan (15 Jul 2026)",
          priority: "high",
        },
        {
          id: "f4",
          title: "Eosinophil Count Elevated (7.2%)",
          detail: "active allergic airway inflammation",
          source: "Complete Blood Count (10 Aug 2026)",
          priority: "high",
        },
      ],
      positiveHighlights: [
        { id: "p1", title: "Resting pulse oximetry normal (SpO2 98% on room air)", source: "Clinical Vitals (12 Aug 2026)" },
        { id: "p2", title: "Chest X-Ray shows no parenchymal consolidation", source: "CXR PA View (28 Jul 2026)" },
        { id: "p3", title: "Normal renal function and electrolyte balance", source: "RFT (10 Aug 2026)" },
      ],
      trends: [
        {
          metric: "FEV1",
          unit: "L",
          values: [
            { label: "Oct 25", value: 1.85 },
            { label: "Mar 26", value: 2.10 },
            { label: "Aug 26", value: 1.92 },
          ],
          statusText: "Fluctuating Airflow",
          direction: "down",
          isAbnormal: true,
          color: "#ef4444",
        },
        {
          metric: "Total IgE",
          unit: "IU/mL",
          values: [
            { label: "Oct 25", value: 290 },
            { label: "Mar 26", value: 340 },
            { label: "Aug 26", value: 380 },
          ],
          statusText: "Increasing",
          direction: "up",
          isAbnormal: true,
          color: "#ef4444",
        },
        {
          metric: "Eosinophils",
          unit: "%",
          values: [
            { label: "Oct 25", value: 5.4 },
            { label: "Mar 26", value: 6.1 },
            { label: "Aug 26", value: 7.2 },
          ],
          statusText: "Elevated",
          direction: "up",
          isAbnormal: true,
          color: "#ef4444",
        },
        {
          metric: "SpO2",
          unit: "%",
          values: [
            { label: "Oct 25", value: 97 },
            { label: "Mar 26", value: 98 },
            { label: "Aug 26", value: 98 },
          ],
          statusText: "Stable",
          direction: "up",
          isAbnormal: false,
          color: "#10b981",
        },
      ],
    },
    detailedReports: [
      {
        id: "rep-pft",
        title: "Spirometry / Pulmonary Function Test (PFT)",
        type: "others",
        date: "10 Aug 2026",
        pages: 2,
        status: "Requires Review",
        statusColor: "red",
        summary: "Pre-bronchodilator FEV1 62% predicted, improving to 76% post-salbutamol (14% reversibility, confirms asthma).",
      },
      {
        id: "rep-allergy",
        title: "Serum IgE & Inhalant Allergen Panel",
        type: "lab",
        date: "10 Aug 2026",
        pages: 3,
        status: "Abnormal Values",
        statusColor: "amber",
        summary: "Serum total IgE 380 IU/mL. Specific IgE Class 4 positive for Dermatophagoides pteronyssinus (House Dust Mite).",
      },
      {
        id: "rep-cxr",
        title: "Chest X-Ray PA View",
        type: "imaging",
        date: "28 Jul 2026",
        pages: 1,
        status: "Normal",
        statusColor: "green",
        summary: "Mild hyperinflation consistent with chronic reactive airway disease. No focal consolidation, effusion, or pneumothorax.",
      },
      {
        id: "rep-rx-1",
        title: "Pulmonology Prescription",
        type: "prescription",
        date: "10 Aug 2026",
        pages: 2,
        status: "Medications Extracted",
        statusColor: "cyan",
        summary: "Budecort Inhaler 200 mcg 2 puffs BD, Levocetirizine 5 mg OD, Montelukast 10 mg HS.",
      },
    ],
    medicationSummary: [
      { medicine: "Budecort Inhaler", dose: "200 mcg", frequency: "Twice daily with spacer", duration: "Continuous" },
      { medicine: "Levocetirizine", dose: "5 mg", frequency: "Once daily at night", duration: "30 days" },
      { medicine: "Montelukast", dose: "10 mg", frequency: "Once daily at night", duration: "90 days" },
    ],
    recentDocuments: [
      { id: "doc-pft", title: "PFT Spirometry", date: "10 Aug 2026", type: "lab" },
      { id: "doc-allergy", title: "Allergen Panel", date: "10 Aug 2026", type: "lab" },
      { id: "doc-cxr", title: "Chest X-Ray", date: "28 Jul 2026", type: "imaging" },
    ],
    timeline: [
      { date: "Oct 2024", title: "Asthma Initial Diagnosis" },
      { date: "Mar 2025", title: "Allergy Panel" },
      { date: "Nov 2025", title: "Sinus CT Scan" },
      { date: "Mar 2026", title: "PFT Spirometry" },
      { date: "Aug 2026", title: "Pulmonology Review" },
    ],
    disclaimer: "Note: This medical summary is based on uploaded respiratory and allergy records. Please verify treatment instructions with treating pulmonologist.",
  };
}

export default PatientHealthReport;
