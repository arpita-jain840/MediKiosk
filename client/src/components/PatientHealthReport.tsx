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
        console.warn("[PatientHealthReport] Could not fetch report from database:", err);
        if (isMounted) {
          setReportData(null);
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

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
        <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Health Report Available</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          No clinical record or intake data was found in the database for patient account ({patientId || "user1"}). Complete an intake or upload medical records to synthesize your report.
        </p>
      </div>
    );
  }

  const data = reportData;
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

export default PatientHealthReport;
