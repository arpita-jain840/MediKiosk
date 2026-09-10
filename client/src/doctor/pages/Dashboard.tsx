import React, { useEffect, useState } from 'react';
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
  CheckCircle2,
  X,
  HeartPulse,
  Thermometer,
  Activity,
  ShieldAlert,
  Stethoscope,
  Clock3,
} from 'lucide-react';
import PatientQRCard from '../components/PatientQRCard';

/* ------------------------------------------------------------------ */
/*  One-time global styles: keyframes used across the dashboard.       */
/*  Kept in a single injected block so every transition is defined     */
/*  in one place instead of scattered inline animations.               */
/* ------------------------------------------------------------------ */
const DashboardStyles = () => (
  <style>{`
    @keyframes dashFadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes dashToastIn {
      from { opacity: 0; transform: translateY(-14px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes dashToastOut {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to   { opacity: 0; transform: translateY(-10px) scale(0.98); }
    }
    @keyframes dashRowIn {
      from { opacity: 0; transform: translateX(-6px); background-color: rgba(15,124,107,0.08); }
      to   { opacity: 1; transform: translateX(0); background-color: transparent; }
    }
    @keyframes dashPing {
      0%   { transform: scale(0.9); opacity: 0.55; }
      100% { transform: scale(1.9); opacity: 0; }
    }
    .dash-stagger > * { opacity: 0; animation: dashFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
    .dash-stagger > *:nth-child(1) { animation-delay: 0ms; }
    .dash-stagger > *:nth-child(2) { animation-delay: 60ms; }
    .dash-stagger > *:nth-child(3) { animation-delay: 120ms; }
    .dash-stagger > *:nth-child(4) { animation-delay: 180ms; }
  `}</style>
);

type Triage = 'Stable' | 'Guarded' | 'Critical';

interface Patient {
  id: string;
  name: string;
  mrn: string;
  chiefComplaint: string;
  attending: string;
  triage: Triage;
  time: string;
  avatar: string;
  vitals?: { bp: string; hr: string; spo2: string; temp: string };
  allergies?: string;
}

const triageStyles: Record<Triage, string> = {
  Stable: 'bg-emerald-50 text-emerald-700',
  Guarded: 'bg-amber-50 text-amber-700',
  Critical: 'bg-rose-50 text-rose-600',
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'New' | 'Insurance'>('All');
  const [selectedDay, setSelectedDay] = useState<number>(4);
  const [event1Active, setEvent1Active] = useState<boolean>(true);
  const [event2Active, setEvent2Active] = useState<boolean>(false);

  // Toast is mounted/unmounted separately from its animation state so the
  // exit transition can play before the node is removed.
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastLeaving, setToastLeaving] = useState(false);

  const [drawerPatient, setDrawerPatient] = useState<Patient | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'PAT-1001',
      mrn: 'MRN 88213',
      name: 'Aarav Sharma',
      chiefComplaint: 'Fever, cough & severe fatigue for 3 days',
      attending: 'Dr. Ananya Sharma',
      triage: 'Stable',
      time: '10:00 am',
      avatar:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
      vitals: { bp: '120/78', hr: '76', spo2: '98%', temp: '99.0°F' },
      allergies: 'None',
    },
    {
      id: 'PAT-1002',
      mrn: 'MRN 77452',
      name: 'Priyanshi Gupta',
      chiefComplaint: 'Acute migraine with photophobia & nausea',
      attending: 'Dr. Ananya Sharma',
      triage: 'Guarded',
      time: '11:00 am',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      vitals: { bp: '112/74', hr: '82', spo2: '99%', temp: '98.4°F' },
      allergies: 'Sulfa drugs',
    },
    {
      id: 'PAT-1003',
      mrn: 'MRN 65310',
      name: 'Rishabh Verma',
      chiefComplaint: 'Chest tightness, palpitations & mild dyspnea',
      attending: 'Dr. Rohan Mehta',
      triage: 'Critical',
      time: '12:00 pm',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      vitals: { bp: '138/88', hr: '94', spo2: '96%', temp: '98.6°F' },
      allergies: 'Penicillin',
    },
  ]);

  const [lastScannedId, setLastScannedId] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastLeaving(false);
    setToastMessage(message);
    setTimeout(() => setToastLeaving(true), 6200);
    setTimeout(() => setToastMessage(null), 6600);
  };

  const handlePatientSynced = (patient: any) => {
    const patientId = patient.id || 'PAT-1001';
    setLastScannedId(patientId);
    setPatients((prev) => [
      {
        id: patientId,
        mrn: patient.mrn || `MRN ${Math.floor(10000 + Math.random() * 89999)}`,
        name: patient.name,
        chiefComplaint: patient.complaint,
        attending: patient.attending || 'Dr. Ananya Sharma',
        triage: patient.triage || 'Stable',
        time: 'Just now · QR sync',
        avatar: patient.avatar,
        vitals: patient.vitals,
        allergies: patient.allergies,
      },
      ...prev.filter((p) => p.id !== patientId),
    ]);
    showToast(`Patient record received for ${patient.name} (${patient.bloodGroup || 'O+'}, BP ${patient.bp})`);
  };

  const openDrawer = (patient: Patient) => {
    setDrawerPatient(patient);
    // Mount, then flip the transform on the next frame so the transition runs.
    requestAnimationFrame(() => setDrawerOpen(true));
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setDrawerPatient(null), 300);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex flex-col gap-5 md:gap-6 pb-6">
      <DashboardStyles />

      {/* Top Greeting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, Dr. Ananya
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5 sm:mt-1">
            {patients.length} patients on today's list · 1 flagged critical
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => {
              const qrCard = document.getElementById('patient-qr-section');
              if (qrCard) qrCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-sm transition-all duration-200 text-xs font-bold cursor-pointer active:scale-[0.97]"
          >
            <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Patient QR pass</span>
            <span className="relative flex w-2 h-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-300"
                style={{ animation: 'dashPing 1.6s cubic-bezier(0,0,0.2,1) infinite' }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
            </span>
          </button>

          <button className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-white rounded-full border border-slate-200/80 shadow-xs hover:bg-slate-50 transition-colors duration-200 text-xs font-semibold text-slate-700 cursor-pointer">
            <span>Monthly</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="bg-teal-700 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3"
          style={{ animation: `${toastLeaving ? 'dashToastOut' : 'dashToastIn'} 0.28s cubic-bezier(0.16,1,0.3,1) forwards` }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-xs font-bold truncate">{toastMessage}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate(`/patients/${lastScannedId || 'PAT-1001'}`)}
              className="text-[11px] sm:text-xs font-black bg-white text-teal-800 px-2.5 sm:px-3 py-1 rounded-xl shadow-xs hover:bg-teal-50 transition-colors cursor-pointer"
            >
              Open profile
            </button>
            <button
              onClick={() => setToastLeaving(true)}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4 Stat Overview Cards - Hidden on Mobile/Phone screens as requested */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 dash-stagger">
        {[
          { label: 'Total appointments', value: '56', delta: '+12% wk', icon: Calendar, tint: 'bg-teal-50 text-teal-700' },
          { label: 'Total reports', value: '27', delta: '+4 today', icon: FileText, tint: 'bg-rose-50 text-rose-500' },
          { label: 'Health progress', value: '87.9%', delta: '+2.3 pts', icon: TrendingUp, tint: 'bg-amber-50 text-amber-600' },
          { label: 'New patients', value: '35', delta: '+8 wk', icon: UserPlus, tint: 'bg-emerald-50 text-emerald-600' },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-[1.8rem] p-5 border border-slate-100/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${card.tint}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">{card.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</span>
                <span className="text-[10px] font-bold text-slate-400">{card.delta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Responsive Layout:
          On Desktop (xl): 2-col left, 1-col right
          On Phone / Mobile (< xl):
            1. Patient QR Desk Scan Card (Top)
            2. "Your patients today" list (Forward / at top)
            3. "Your patients today" chart
            4. Events card
            5. Appointment Calendar
      */}
      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-6">
        
        {/* Mobile First: QR Section (Desktop Right Column) */}
        <div className="order-1 xl:order-2 flex flex-col gap-6">
          {/* Patient QR Desk Scan Card */}
          <div id="patient-qr-section" className="order-1 xl:order-2">
            <PatientQRCard onPatientSynced={handlePatientSynced} />
          </div>

          {/* Mini Calendar (Order 5 on Mobile, Order 1 in Right Col on Desktop) */}
          <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100/80 shadow-xs order-5 xl:order-1">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Appointment</h3>
              <button className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mb-4 px-1">
              <button className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-800">April 2026</span>
              <button className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-8 w-8 sm:h-9 sm:w-9 mx-auto rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer ${
                      isSelected ? 'bg-teal-700 text-white shadow-md shadow-teal-700/30 scale-100' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {day < 10 ? `0${day}` : day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Column (Left on Desktop, Order 2 on Mobile) */}
        <div className="order-2 xl:order-1 xl:col-span-2 flex flex-col gap-6">
          
          {/* Patients Today List - Forward / At the Top on Mobile */}
          <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100/80 shadow-xs order-1 xl:order-2">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Your patients today</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Active queue & verified intake</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {patients.length} registered
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => openDrawer(patient)}
                  style={patient.id === lastScannedId ? { animation: 'dashRowIn 0.6s ease-out' } : undefined}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-teal-50/50 transition-colors duration-200 border border-transparent hover:border-teal-100 cursor-pointer group bg-slate-50/40"
                  title="Click for a quick view"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-slate-200 group-hover:border-teal-300 transition-colors flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors truncate">
                          {patient.name}
                        </h4>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${triageStyles[patient.triage]}`}>
                          {patient.triage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{patient.chiefComplaint}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    <span className="text-xs font-semibold text-slate-400 whitespace-nowrap font-mono hidden sm:inline">{patient.time}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Section - Responsive graph */}
          <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100/80 shadow-xs order-2 xl:order-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Patient analytics</h2>
                <p className="text-xs text-slate-400">Weekly consultation & insurance volume</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-full self-start">
                {(['All', 'New', 'Insurance'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      activeTab === tab ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
              <div className="flex sm:flex-row lg:flex-col justify-between sm:justify-start gap-4 sm:gap-8 lg:gap-5 lg:border-r border-slate-100 lg:pr-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">56</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 text-[10px] font-bold">+32%</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 mt-0.5 block">New patients</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">23</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold">+17%</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 mt-0.5 block">Insurance patients</span>
                </div>
              </div>

              <div className="lg:col-span-3 relative w-full h-[180px] sm:h-[220px]">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] sm:text-[11px] font-semibold text-slate-300">
                  {[50, 40, 30, 20, 10].map((n) => (
                    <div key={n} className="w-full flex items-center gap-2 sm:gap-3">
                      <span className="w-5 sm:w-6 text-right">{n}</span>
                      <div className={`flex-1 border-b ${n === 10 ? 'border-slate-100' : 'border-dashed border-slate-100'}`}></div>
                    </div>
                  ))}
                </div>

                <svg className="absolute inset-0 w-full h-full pl-7 sm:pl-9 pb-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 180">
                  <line x1="450" y1="20" x2="450" y2="180" stroke="#0f766e" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
                  <path
                    d="M 10 170 C 80 165, 120 120, 180 120 C 240 120, 270 120, 330 115 C 380 110, 410 100, 480 90 C 550 80, 620 75, 680 75"
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 170 C 90 170, 140 150, 200 145 C 260 140, 280 105, 360 100 C 430 95, 470 50, 560 40 C 620 30, 650 25, 685 25"
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="450" cy="70" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" />
                </svg>

                <div
                  className="hidden sm:block absolute z-10 bg-slate-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg pointer-events-none transform -translate-x-1/2"
                  style={{ left: '68%', top: '35%' }}
                >
                  35 insurance patients
                </div>

                <div className="absolute bottom-0 left-7 sm:left-9 right-0 flex justify-between text-[10px] sm:text-xs font-semibold text-slate-400">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <span key={d} className={d === 'Thu' ? 'text-slate-900 font-bold' : ''}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Events Card */}
          <div className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100/80 shadow-xs order-3">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Upcoming Events & Rounds</h3>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">2 today</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { title: 'Clinical doctor team meeting', time: '10:00 - 12:00', active: event1Active, toggle: () => setEvent1Active(!event1Active) },
                  { title: 'Cardiology case symposium', time: '12:00 - 02:00', active: event2Active, toggle: () => setEvent2Active(!event2Active) },
                ].map((ev) => (
                  <div key={ev.title} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">{ev.title}</h4>
                        <span className="text-xs font-medium text-slate-400">{ev.time}</span>
                      </div>
                      <button
                        onClick={ev.toggle}
                        className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer flex-shrink-0 ${ev.active ? 'bg-teal-700' : 'bg-slate-300'}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${ev.active ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center -space-x-2">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover" />
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover" />
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">+2</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 rounded-full bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200/80 shadow-xs cursor-pointer transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-100 flex items-center justify-center cursor-pointer transition-colors">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Quick-view Drawer / Responsive Sheet */}
      {drawerPatient && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={closeDrawer}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            style={{ opacity: drawerOpen ? 1 : 0 }}
          />
          <div
            className="relative w-full sm:max-w-md bg-white h-full shadow-2xl p-5 sm:p-6 overflow-y-auto transition-transform duration-300 ease-out flex flex-col justify-between"
            style={{ transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div>
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Quick View</span>
                <button 
                  onClick={closeDrawer} 
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer" 
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-6">
                <img src={drawerPatient.avatar} alt={drawerPatient.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200" />
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">{drawerPatient.name}</h2>
                  <p className="text-xs font-mono font-semibold text-slate-400">{drawerPatient.mrn}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${triageStyles[drawerPatient.triage]}`}>
                    {drawerPatient.triage}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <Stethoscope className="w-3.5 h-3.5" /> Chief complaint
                  </div>
                  <p className="text-slate-800 font-medium text-xs sm:text-sm">{drawerPatient.chiefComplaint}</p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                    <Clock3 className="w-3.5 h-3.5" /> Attending physician
                  </div>
                  <p className="text-slate-800 font-medium text-xs sm:text-sm">{drawerPatient.attending}</p>
                </div>

                {drawerPatient.vitals && (
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[11px] font-semibold mb-0.5">
                        <HeartPulse className="w-3.5 h-3.5" /> Blood pressure
                      </div>
                      <p className="text-slate-900 font-mono font-bold text-xs sm:text-sm">{drawerPatient.vitals.bp}</p>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[11px] font-semibold mb-0.5">
                        <Activity className="w-3.5 h-3.5" /> Heart rate
                      </div>
                      <p className="text-slate-900 font-mono font-bold text-xs sm:text-sm">{drawerPatient.vitals.hr} bpm</p>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[11px] font-semibold mb-0.5">
                        <Activity className="w-3.5 h-3.5" /> SpO2
                      </div>
                      <p className="text-slate-900 font-mono font-bold text-xs sm:text-sm">{drawerPatient.vitals.spo2}</p>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-[11px] font-semibold mb-0.5">
                        <Thermometer className="w-3.5 h-3.5" /> Temperature
                      </div>
                      <p className="text-slate-900 font-mono font-bold text-xs sm:text-sm">{drawerPatient.vitals.temp}</p>
                    </div>
                  </div>
                )}

                {drawerPatient.allergies && (
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                    <div className="flex items-center gap-2 text-rose-500 text-xs font-semibold mb-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Allergies
                    </div>
                    <p className="text-rose-700 font-semibold text-xs sm:text-sm">{drawerPatient.allergies}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => { closeDrawer(); navigate(`/patients/${drawerPatient.id}`); }}
              className="mt-6 w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer shadow-md"
            >
              Open full EHR profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;