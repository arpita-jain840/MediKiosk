import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Calendar, 
  MoreVertical, 
  Users, 
  Stethoscope, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Search, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  ChevronDown, 
  Eye, 
  Printer, 
  X,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface ClinicalReport {
  id: string;
  patientName: string;
  patientId: string;
  reportType: string;
  doctorName: string;
  generatedDate: string;
  status: 'Generated' | 'Pending';
  fileSize: string;
  summary: string;
}

export const Reports: React.FC = () => {
  // Filters and Control States
  const [dateRange, setDateRange] = useState<'Today' | 'This Week' | 'This Month' | 'Last 3 Months' | 'Custom Range'>('This Week');
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('All Reports');
  const [chartView, setChartView] = useState<'line' | 'bar'>('line');
  const [reportSearch, setReportSearch] = useState('');
  const [activeReportModal, setActiveReportModal] = useState<ClinicalReport | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  // Section 2: Consultation Activity Data
  const activityDataWeek = [
    { day: 'Monday', label: 'Mon', total: 18, completed: 14, pending: 4 },
    { day: 'Tuesday', label: 'Tue', total: 24, completed: 19, pending: 5 },
    { day: 'Wednesday', label: 'Wed', total: 29, completed: 23, pending: 6 },
    { day: 'Thursday', label: 'Thu', total: 21, completed: 16, pending: 5 },
    { day: 'Friday', label: 'Fri', total: 26, completed: 21, pending: 5 },
    { day: 'Saturday', label: 'Sat', total: 14, completed: 11, pending: 3 },
    { day: 'Sunday', label: 'Sun', total: 8, completed: 6, pending: 2 }
  ];

  const activityDataMonth = [
    { day: 'Week 1', label: 'W1', total: 112, completed: 94, pending: 18 },
    { day: 'Week 2', label: 'W2', total: 138, completed: 118, pending: 20 },
    { day: 'Week 3', label: 'W3', total: 154, completed: 132, pending: 22 },
    { day: 'Week 4', label: 'W4', total: 140, completed: 120, pending: 20 }
  ];

  const currentActivityData = dateRange === 'This Month' ? activityDataMonth : activityDataWeek;

  // Section 3: Consultation Status Donut Data
  const statusDistribution = [
    { name: 'Completed', value: 72, count: 36, color: '#10b981' },
    { name: 'Pending', value: 12, count: 6, color: '#f59e0b' },
    { name: 'Cancelled', value: 10, count: 5, color: '#ef4444' },
    { name: 'No Show', value: 6, count: 3, color: '#64748b' }
  ];

  // Section 4: Common Patient Complaints Data
  const complaintsData = [
    { name: 'Fever', count: 32, percentage: 85, color: '#2563eb' },
    { name: 'Headache', count: 24, percentage: 64, color: '#3b82f6' },
    { name: 'Cough & Cold', count: 21, percentage: 56, color: '#60a5fa' },
    { name: 'Stomach Pain', count: 16, percentage: 42, color: '#93c5fd' },
    { name: 'Body Pain', count: 12, percentage: 32, color: '#bfdbfe' },
    { name: 'Other', count: 18, percentage: 48, color: '#cbd5e1' }
  ];

  // Section 5: Patient Outcomes Data
  const outcomesData = [
    { label: 'Improved', percentage: 72, count: 31, color: 'bg-emerald-500', text: 'text-emerald-700' },
    { label: 'Stable', percentage: 20, count: 9, color: 'bg-blue-600', text: 'text-blue-700' },
    { label: 'Follow-up Required', percentage: 8, count: 3, color: 'bg-amber-500', text: 'text-amber-700' }
  ];

  // Section 6: Recent Reports
  const [reportsList, setReportsList] = useState<ClinicalReport[]>([
    {
      id: 'REP-9021',
      patientName: 'Wayan Aditya',
      patientId: 'MRN-88219',
      reportType: 'Consultation Report',
      doctorName: 'Dr. Melvin Suharjo',
      generatedDate: '08 Sep 2026',
      status: 'Generated',
      fileSize: '1.4 MB PDF',
      summary: 'Annual biometric health checkup complete. Vitals within normal limits. Blood panel and resting pulse confirmed optimal.'
    },
    {
      id: 'REP-9022',
      patientName: 'Dewi Kartika',
      patientId: 'MRN-77301',
      reportType: 'Clinical Summary',
      doctorName: 'Dr. Budi Darmawan',
      generatedDate: '07 Sep 2026',
      status: 'Generated',
      fileSize: '2.1 MB PDF',
      summary: 'Abdominal ultrasound and urine analysis summary. Acute discomfort managed. Follow-up scheduled in 10 days.'
    },
    {
      id: 'REP-9023',
      patientName: 'Adi Gunawan',
      patientId: 'MRN-44102',
      reportType: 'Follow-up Report',
      doctorName: 'Dr. Melvin Suharjo',
      generatedDate: '05 Sep 2026',
      status: 'Pending',
      fileSize: 'Draft',
      summary: 'Post-gastritis medication evaluation in progress. Awaiting final laboratory confirmation of mucosal recovery.'
    },
    {
      id: 'REP-9024',
      patientName: 'Indah Permata',
      patientId: 'MRN-65209',
      reportType: 'Prescription Report',
      doctorName: 'Dr. Melvin Suharjo',
      generatedDate: '04 Sep 2026',
      status: 'Generated',
      fileSize: '840 KB PDF',
      summary: 'Pre-employment screening certificate and approved vaccination booster log.'
    },
    {
      id: 'REP-9025',
      patientName: 'Rina Kusuma',
      patientId: 'MRN-90134',
      reportType: 'Diagnostic Lab Report',
      doctorName: 'Dr. Selvi Chandra',
      generatedDate: '02 Sep 2026',
      status: 'Generated',
      fileSize: '3.2 MB PDF',
      summary: 'Contact dermatitis allergen sensitivity panel. Nickel sensitivity identified. Topical regimen recommended.'
    }
  ]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reportsList.filter((r) => {
      const matchesSearch = 
        reportSearch === '' ||
        r.patientName.toLowerCase().includes(reportSearch.toLowerCase()) ||
        r.patientId.toLowerCase().includes(reportSearch.toLowerCase()) ||
        r.reportType.toLowerCase().includes(reportSearch.toLowerCase()) ||
        r.doctorName.toLowerCase().includes(reportSearch.toLowerCase());

      const matchesType = 
        reportTypeFilter === 'All Reports' || r.reportType.toLowerCase().includes(reportTypeFilter.toLowerCase().replace(' report', ''));

      return matchesSearch && matchesType;
    });
  }, [reportsList, reportSearch, reportTypeFilter]);

  const handleExport = (format: string) => {
    setToastMessage(`Exporting MEDIX Clinical Analytics (${format})... Download will start immediately.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGeneratePending = (id: string) => {
    setReportsList(prev => prev.map(r => r.id === id ? { ...r, status: 'Generated', fileSize: '1.1 MB PDF' } : r));
    setToastMessage('Report generated successfully and saved to patient EHR archive.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto pb-24 space-y-6 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 bg-slate-900/95 backdrop-blur text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* PAGE HEADER                                              */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Review patient trends, consultation activity, outcomes, and clinical reports.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-400">Last updated just now</span>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
          {/* Date Range Dropdown */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200/90 rounded-2xl px-4 py-2.5 pr-8 text-xs font-bold text-slate-700 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Custom Range">Custom Range</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Report Type Dropdown */}
          <div className="relative">
            <select
              value={reportTypeFilter}
              onChange={(e) => setReportTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-2xl px-4 py-2.5 pr-8 text-xs font-bold text-slate-700 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Reports">All Reports</option>
              <option value="Consultation Report">Consultation Report</option>
              <option value="Clinical Summary">Clinical Summary</option>
              <option value="Follow-up Report">Follow-up Report</option>
              <option value="Patient History">Patient History</option>
              <option value="Prescription Report">Prescription Report</option>
              <option value="Diagnostic Report">Diagnostic Report</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Report CTA */}
          <button
            onClick={() => handleExport('PDF & CSV')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-600/20 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>

          {/* More Actions Menu */}
          <button
            onClick={() => alert('Quick Actions:\n- Schedule automated monthly digest\n- Share dashboard view with Medical Board\n- Print high-resolution clinical audit')}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: OVERVIEW SUMMARY CARDS                        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Patients */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">Total Patients</span>
              <span className="text-3xl font-black text-slate-900 tracking-tight">128</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Unique patients treated</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-100 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
        </div>

        {/* Card 2: Consultations */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">Consultations</span>
              <span className="text-3xl font-black text-slate-900 tracking-tight">42</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Total consultations handled</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black border border-indigo-100 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8%
            </span>
          </div>
        </div>

        {/* Card 3: Completed Consultations */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">Completed Consultations</span>
              <span className="text-3xl font-black text-slate-900 tracking-tight">36</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Successfully completed visits</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100">
              86% completion
            </span>
          </div>
        </div>

        {/* Card 4: Reports Generated */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">Reports Generated</span>
              <span className="text-3xl font-black text-slate-900 tracking-tight">18</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Clinical reports created</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black border border-purple-100">
              +4 reports
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: CONSULTATION ACTIVITY (Interactive Area/Line) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Consultation Activity
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Track the volume of consultations over time.
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Period Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
              {(['This Week', 'This Month'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setDateRange(p)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    dateRange === p ? 'bg-white text-slate-900 shadow-xs font-black' : 'hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Line / Bar Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
              <button
                onClick={() => setChartView('line')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  chartView === 'line' ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:text-slate-900'
                }`}
              >
                Line Chart
              </button>
              <button
                onClick={() => setChartView('bar')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  chartView === 'bar' ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:text-slate-900'
                }`}
              >
                Bar Chart
              </button>
            </div>

            <button
              onClick={() => handleExport('Activity Chart Data')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Download Data"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Insight Header Badge */}
        <div className="flex flex-wrap items-center gap-3 bg-blue-50/70 border border-blue-100/80 p-3.5 rounded-2xl text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Peak activity: Wednesday, 29 consultations</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-blue-700 font-semibold">
            8% higher than the previous period
          </span>
        </div>

        {/* Recharts Visualization */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'line' ? (
              <AreaChart data={currentActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="consultationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 35]} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', fontSize: 12 }}
                  formatter={(value: any) => [`${value} consultations`, 'Total']}
                  labelStyle={{ fontWeight: 800, color: '#0f172a' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#consultationGradient)"
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#ffffff', strokeWidth: 3 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={currentActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 35]} />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', fontSize: 12 }}
                  formatter={(value: any) => [`${value} consultations`, 'Total']}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTIONS 3 & 4: CONSULTATION OVERVIEW & COMPLAINTS GRID   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 3: Consultation Overview (Donut Chart) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Consultation Overview
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Appointment and consultation status distribution.
            </p>

            {/* Donut Chart with Center Percentage */}
            <div className="relative w-full h-56 flex items-center justify-center my-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={65}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 11 }}
                    formatter={(val: any, name: any) => [`${val}% (${statusDistribution.find(s => s.name === name)?.count} visits)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">72%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {item.value}% <span className="text-[10px] font-medium text-slate-400">({item.count})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight Callout */}
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-xs font-bold text-emerald-900">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Completion rate improved by 6% compared with the previous period.</span>
          </div>
        </div>

        {/* Section 4: Common Patient Complaints (Horizontal Bars) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Common Patient Complaints
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Most frequently recorded reasons for consultation.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                {dateRange}
              </span>
            </div>

            {/* Horizontal Bar Visuals */}
            <div className="space-y-3.5 my-4">
              {complaintsData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{item.name}</span>
                    <span className="text-slate-900 font-black">{item.count} patients</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              💡 Fever-related consultations represent the highest complaint category this month.
            </span>
            <button
              onClick={() => alert('All Patient Complaints List:\n1. Fever (32)\n2. Headache (24)\n3. Cough & Cold (21)\n4. Stomach Pain (16)\n5. Body Pain (12)\n6. Dermatitis (9)\n7. Hypertension review (8)\n8. Others (18)')}
              className="text-blue-600 font-bold hover:underline self-start sm:self-auto cursor-pointer"
            >
              View all complaints →
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTIONS 5 & 6: PATIENT OUTCOMES & RECENT REPORTS TABLE  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 5: Patient Outcomes Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Patient Outcomes
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Clinical outcome recorded after consultation.
            </p>

            {/* Outcome Progress Bars */}
            <div className="space-y-4 my-5">
              {outcomesData.map((item) => (
                <div key={item.label} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-black ${item.text}`}>{item.percentage}%</span>
                      <span className="text-slate-400 font-normal">({item.count} patients)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Clinical Note Callout */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>3 patients require a follow-up appointment within the next 7 days.</span>
            </div>
          </div>

          <button
            onClick={() => setShowFollowUpModal(true)}
            className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            View Follow-ups (3)
          </button>
        </div>

        {/* Section 6: Recent Reports Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Recent Reports
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Recently generated consultation and clinical reports.
                </p>
              </div>

              {/* Search in Reports */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reports or patient..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modern Table Container */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-3.5">Patient</th>
                    <th className="py-3 px-3.5">Report Type</th>
                    <th className="py-3 px-3.5">Doctor</th>
                    <th className="py-3 px-3.5">Generated Date</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredReports.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5">
                        <span className="font-extrabold text-slate-900 block">{row.patientName}</span>
                        <span className="text-[10px] text-slate-400">{row.patientId}</span>
                      </td>
                      <td className="py-3 px-3.5 text-slate-700 font-semibold">{row.reportType}</td>
                      <td className="py-3 px-3.5 text-slate-600">{row.doctorName}</td>
                      <td className="py-3 px-3.5 text-slate-500">{row.generatedDate}</td>
                      <td className="py-3 px-3.5">
                        {row.status === 'Generated' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                            Generated
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-200">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveReportModal(row)}
                            title="View Summary"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {row.status === 'Generated' ? (
                            <button
                              onClick={() => handleExport(`${row.reportType} for ${row.patientName}`)}
                              title="Download PDF"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleGeneratePending(row.id)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[10px] font-bold cursor-pointer"
                            >
                              Generate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium mt-3">
            <span>Showing {filteredReports.length} clinical records</span>
            <button
              onClick={() => alert('Opening Full Hospital Archive: 1,420 historical clinical documents indexed.')}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              View All Reports in Archive →
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* REPORT SUMMARY MODAL                                     */}
      {/* ======================================================== */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 relative">
            <button
              onClick={() => setActiveReportModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">{activeReportModal.reportType}</h3>
                <span className="text-xs text-slate-400">{activeReportModal.id} · {activeReportModal.fileSize}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Patient</span>
                <strong className="text-slate-800">{activeReportModal.patientName} ({activeReportModal.patientId})</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Attending Physician</span>
                <strong className="text-slate-800">{activeReportModal.doctorName}</strong>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Clinical Findings & Summary</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 font-medium">
                {activeReportModal.summary}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                onClick={() => {
                  handleExport(activeReportModal.reportType);
                  setActiveReportModal(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FOLLOW-UPS MODAL                                         */}
      {/* ======================================================== */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 relative">
            <button
              onClick={() => setShowFollowUpModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Follow-up Patients (7 Days)</h3>
                <span className="text-xs text-slate-400">3 patients scheduled for clinical review</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Dewi Kartika</strong>
                  <span className="text-slate-400 text-[11px]">Abdominal follow-up review · Dr. Budi</span>
                </div>
                <span className="px-2 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-[10px]">Due in 3 days</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Adi Gunawan</strong>
                  <span className="text-slate-400 text-[11px]">Gastritis lab review · Dr. Melvin</span>
                </div>
                <span className="px-2 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-[10px]">Due in 5 days</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block">Rina Kusuma</strong>
                  <span className="text-slate-400 text-[11px]">Dermatology patch test check · Dr. Selvi</span>
                </div>
                <span className="px-2 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-[10px]">Due in 7 days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
