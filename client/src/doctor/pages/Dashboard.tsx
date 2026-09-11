import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  TrendingUp, 
  UserPlus, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Pencil, 
  ChevronRight as ArrowRight,
  QrCode,
  CheckCircle2
} from 'lucide-react';
import PatientQRCard from '../components/PatientQRCard';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'New' | 'Insurance'>('All');
  const [selectedDay, setSelectedDay] = useState<number>(4);
  const [event1Active, setEvent1Active] = useState<boolean>(true);
  const [event2Active, setEvent2Active] = useState<boolean>(false);
  const [syncedAlert, setSyncedAlert] = useState<string | null>(null);

  const [patients, setPatients] = useState([
    {
      id: 'MK-101',
      name: 'Sarah Hosten',
      diagnosis: 'Diagnosis: Bronchitis',
      time: '10:00 am',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'MK-102',
      name: 'Dakota Smith',
      diagnosis: 'Diagnosis: Stroke',
      time: '11:00 am',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'MK-103',
      name: 'John Smith',
      diagnosis: 'Diagnosis: Liver Cirrhosis',
      time: '12:00 pm',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80'
    }
  ]);

  const [lastScannedId, setLastScannedId] = useState<string | null>(null);

  const handlePatientSynced = (patient: any) => {
    const patientId = patient.id || 'MK-9824';
    setLastScannedId(patientId);
    setPatients((prev) => [
      {
        id: patientId,
        name: patient.name,
        diagnosis: `Diagnosis: ${patient.complaint}`,
        time: 'Just now (QR Scanned)',
        avatar: patient.avatar
      },
      ...prev.filter((p) => p.id !== patientId)
    ]);
    setSyncedAlert(`Patient records received for ${patient.name} (${patient.bloodGroup}, BP: ${patient.bp})`);
    setTimeout(() => setSyncedAlert(null), 8000);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Top Greeting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good Morning, Dr, Liza
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Have a great and productive day filled with success
          </p>
        </div>

        {/* Action Controls & QR Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Quick QR Desk Button */}
          <button 
            onClick={() => {
              const qrCard = document.getElementById('patient-qr-section');
              if (qrCard) {
                qrCard.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xs transition-all text-xs font-bold cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Patient QR Pass</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Timeframe Dropdown */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200/80 shadow-xs hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 cursor-pointer">
            <span>Monthly</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Live Synced Toast Alert */}
      {syncedAlert && (
        <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold">{syncedAlert}</span>
          </div>
          <button
            onClick={() => navigate(`/doctor/patients/${lastScannedId || 'MK-9824'}`)}
            className="text-xs font-black bg-white text-emerald-800 px-3 py-1 rounded-xl shadow-xs hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            Open Profile →
          </button>
        </div>
      )}

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Appointment */}
        <div className="bg-white rounded-[1.8rem] p-5 border border-slate-100/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Total Appointment
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              56
            </span>
          </div>
        </div>

        {/* Card 2: Total Report */}
        <div className="bg-white rounded-[1.8rem] p-5 border border-slate-100/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Total Report
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              27
            </span>
          </div>
        </div>

        {/* Card 3: Health Progress */}
        <div className="bg-white rounded-[1.8rem] p-5 border border-slate-100/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Health Progress
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              87.86%
            </span>
          </div>
        </div>

        {/* Card 4: New Patients */}
        <div className="bg-white rounded-[1.8rem] p-5 border border-slate-100/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              New Patients
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              35
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns (Left content 2/3, Right sidebar 1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Chart Section */}
          <div className="bg-white rounded-4xl p-6 border border-slate-100/80 shadow-xs">
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Your patients today
              </h2>

              {/* Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-full self-start">
                {(['All', 'New', 'Insurance'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeTab === tab
                      ? 'bg-slate-950 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats & Graph Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
              {/* Left stats counter */}
              <div className="flex flex-col gap-5 lg:border-r border-slate-100 lg:pr-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-slate-900">56</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 text-[10px] font-bold">
                      +32%
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 mt-1 block">
                    New patients
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-slate-900">23</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">
                      +17%
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 mt-1 block">
                    Insurance patients
                  </span>
                </div>
              </div>

              {/* Smooth Interactive SVG Chart */}
              <div className="lg:col-span-3 relative w-full h-55">
                {/* Horizontal guide lines and Y labels */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] font-semibold text-slate-300">
                  <div className="w-full flex items-center gap-3">
                    <span className="w-6 text-right">50</span>
                    <div className="flex-1 border-b border-dashed border-slate-100"></div>
                  </div>
                  <div className="w-full flex items-center gap-3">
                    <span className="w-6 text-right">40</span>
                    <div className="flex-1 border-b border-dashed border-slate-100"></div>
                  </div>
                  <div className="w-full flex items-center gap-3">
                    <span className="w-6 text-right">30</span>
                    <div className="flex-1 border-b border-dashed border-slate-100"></div>
                  </div>
                  <div className="w-full flex items-center gap-3">
                    <span className="w-6 text-right">20</span>
                    <div className="flex-1 border-b border-dashed border-slate-100"></div>
                  </div>
                  <div className="w-full flex items-center gap-3">
                    <span className="w-6 text-right">10</span>
                    <div className="flex-1 border-b border-slate-100"></div>
                  </div>
                </div>

                {/* SVG Curve Lines */}
                <svg className="absolute inset-0 w-full h-full pl-9 pb-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 180">
                  <defs>
                    <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Vertical dashed indicator line on Thursday */}
                  <line
                    x1="450" y1="20" x2="450" y2="180"
                    stroke="#818cf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Blue Line (New Patients curve) */}
                  <path
                    d="M 10 170 C 80 165, 120 120, 180 120 C 240 120, 270 120, 330 115 C 380 110, 410 100, 480 90 C 550 80, 620 75, 680 75"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Red/Coral Line (Insurance curve) */}
                  <path
                    d="M 10 170 C 90 170, 140 150, 200 145 C 260 140, 280 105, 360 100 C 430 95, 470 50, 560 40 C 620 30, 650 25, 685 25"
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Thu point circle */}
                  <circle cx="450" cy="70" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" />
                </svg>

                {/* Tooltip badge anchored at Thu */}
                <div
                  className="absolute z-10 bg-slate-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg pointer-events-none transform -translate-x-1/2"
                  style={{ left: '68%', top: '35%' }}
                >
                  35 Insurance patients
                </div>

                {/* Weekday Labels */}
                <div className="absolute bottom-0 left-9 right-0 flex justify-between text-xs font-semibold text-slate-400">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span className="text-slate-900 font-bold">Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Split Row: Events & Patient List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Events Card */}
            <div className="bg-white rounded-4xl p-6 border border-slate-100/80 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-5">Events</h3>

                {/* Event item 1 */}
                <div className="p-4 rounded-2xl bg-slate-50/80 mb-3 border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Doctor Team meeting
                      </h4>
                      <span className="text-xs font-medium text-slate-400">
                        10:00 - 12:00
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => setEvent1Active(!event1Active)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${event1Active ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${event1Active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Avatars group */}
                    <div className="flex items-center -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                        alt="Dr."
                        className="w-7 h-7 rounded-full border-2 border-white object-cover"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                        alt="Dr."
                        className="w-7 h-7 rounded-full border-2 border-white object-cover"
                      />
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                        +2
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-full bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200/80 shadow-xs cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center cursor-pointer">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Event item 2 */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        National Nobel Prize
                      </h4>
                      <span className="text-xs font-medium text-slate-400">
                        12:00 - 02:00
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => setEvent2Active(!event2Active)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${event2Active ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${event2Active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Avatars group */}
                    <div className="flex items-center -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                        alt="Dr."
                        className="w-7 h-7 rounded-full border-2 border-white object-cover"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                        alt="Dr."
                        className="w-7 h-7 rounded-full border-2 border-white object-cover"
                      />
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                        +2
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-full bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200/80 shadow-xs cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center cursor-pointer">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patients Today List Card */}
            <div className="bg-white rounded-4xl p-6 border border-slate-100/80 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900">Your patients today</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {patients.length} Registered
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-indigo-50/50 transition-all border border-transparent hover:border-indigo-100 cursor-pointer group"
                    title="Click to view patient EHR profile"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:border-indigo-300 transition-colors"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {patient.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">{patient.diagnosis}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                        {patient.time}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="flex flex-col gap-6">
          {/* Mini Calendar Widget */}
          <div className="bg-white rounded-4xl p-6 border border-slate-100/80 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900">Appointment</h3>
              <button className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Month Navigator */}
            <div className="flex items-center justify-between mb-4 px-1">
              <button className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-800">April 2026</span>
              <button className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days row */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-9 w-9 mx-auto rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    {day < 10 ? `0${day}` : day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient QR Desk Scan Card */}
          <div id="patient-qr-section">
            <PatientQRCard onPatientSynced={handlePatientSynced} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
