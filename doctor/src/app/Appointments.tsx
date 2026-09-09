import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Settings,
  ChevronDown,
  Plus,
  Bell,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  X,
  UserCheck,
  Stethoscope,
  AlertTriangle,
  User,
  CheckCircle2,
  CalendarClock,
  Eye,
  HeartPulse
} from 'lucide-react';

export type AppointmentStatus =
  | 'Registered'
  | 'Confirmed'
  | 'Checked In'
  | 'In Consultation'
  | 'Completed'
  | 'Cancelled'
  | 'No-show'
  | 'Rescheduled';

export type PriorityLevel = 'Normal' | 'Urgent' | 'Emergency';

export type AppointmentType =
  | 'General Checkup'
  | 'Follow-up'
  | 'Consultation'
  | 'Emergency Visit'
  | 'Lab Review';

export type StaffRole = 'Doctor' | 'Nurse' | 'Receptionist' | 'Clinic Admin';

export interface AppointmentRecord {
  id: string;
  patientName: string;
  patientId: string;
  dob: string;
  age: number;
  gender: string;
  phone: string;
  timeSlot: string; // "09:00"
  timeRange: string; // "09:00 - 09:45"
  duration: string; // "45 mins"
  type: AppointmentType;
  status: AppointmentStatus;
  priority: PriorityLevel;
  doctorId: string;
  room: string;
  paymentStatus: 'Insured (BPJS)' | 'Self-Pay (Paid)' | 'Pending Verification' | 'Direct Billing';
  vitalRequired?: boolean;
  formsCompleted: boolean;
  waitingMinutes?: number;
  reason: string;
  allergies: string[];
  medications: string[];
  history: string;
  notes: string;
  vitals?: {
    bp: string;
    pulse: string;
    temp: string;
    spO2: string;
    bmi: string;
  };
  activityLog: {
    timestamp: string;
    staffName: string;
    action: string;
  }[];
}

export interface DoctorSchedule {
  id: string;
  name: string;
  specialty: string;
  room: string;
  avatar: string;
  status: 'Available' | 'Break Time' | 'In Consultation' | 'On Leave';
  notAvailableSlots?: string[];
}

export const Appointments: React.FC = () => {
  // Staff role selector
  const [activeRole, setActiveRole] = useState<StaffRole>('Clinic Admin');

  // Search and date navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [formattedDate, setFormattedDate] = useState('Monday, 26 August 2026');
  const [timeView, setTimeView] = useState<'Day' | 'Week' | 'Month'>('Day');

  // Filter states
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Modals and Drawers
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<AppointmentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Doctors list
  const doctors: DoctorSchedule[] = [
    {
      id: 'doc-1',
      name: 'Dr. Melvin Suharjo',
      specialty: 'General Physician',
      room: 'Room 101',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
      status: 'Available',
      notAvailableSlots: []
    },
    {
      id: 'doc-2',
      name: 'Dr. Budi Darmawan',
      specialty: 'Internal Medicine',
      room: 'Room 102',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
      status: 'Available',
      notAvailableSlots: []
    },
    {
      id: 'doc-3',
      name: 'Dr. Selvi Chandra',
      specialty: 'Dermatologist',
      room: 'Room 103',
      avatar: 'https://images.unsplash.com/photo-1594824813589-3221bf9a888c?w=120&auto=format&fit=crop&q=80',
      status: 'Available',
      notAvailableSlots: ['09:00', '10:00']
    }
  ];

  // Appointments master state
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([
    {
      id: 'APT-1001',
      patientName: 'Wayan Aditya',
      patientId: 'MRN-88219',
      dob: '1992-05-14',
      age: 34,
      gender: 'Male',
      phone: '+62 812-3456-7890',
      timeSlot: '09:00',
      timeRange: '09:00 - 09:45',
      duration: '45 mins',
      type: 'General Checkup',
      status: 'Completed',
      priority: 'Normal',
      doctorId: 'doc-1',
      room: 'Room 101',
      paymentStatus: 'Insured (BPJS)',
      formsCompleted: true,
      reason: 'Routine annual biometric health checkup',
      allergies: ['Penicillin'],
      medications: ['Multivitamins'],
      history: 'No chronic illnesses. Mild hypertension in 2023.',
      notes: 'Patient clear. Vitals normal. Advised standard diet maintenance.',
      vitals: {
        bp: '118/78 mmHg',
        pulse: '72 bpm',
        temp: '98.4 °F',
        spO2: '99%',
        bmi: '23.4'
      },
      activityLog: [
        { timestamp: '08:50 AM', staffName: 'Nurse Sarah', action: 'Patient checked in at reception' },
        { timestamp: '09:05 AM', staffName: 'Nurse Sarah', action: 'Recorded vitals and biometric panel' },
        { timestamp: '09:40 AM', staffName: 'Dr. Melvin', action: 'Consultation completed and record signed' }
      ]
    },
    {
      id: 'APT-1002',
      patientName: 'Adi Gunawan',
      patientId: 'MRN-44102',
      dob: '1985-11-20',
      age: 40,
      gender: 'Male',
      phone: '+62 813-9876-5432',
      timeSlot: '10:00',
      timeRange: '10:00 - 10:45',
      duration: '45 mins',
      type: 'Follow-up',
      status: 'Completed',
      priority: 'Normal',
      doctorId: 'doc-1',
      room: 'Room 101',
      paymentStatus: 'Self-Pay (Paid)',
      formsCompleted: true,
      reason: 'Post-gastritis medication response check',
      allergies: ['Aspirin', 'Ibuprofen'],
      medications: ['Omeprazole 20mg'],
      history: 'Acute gastritis treated 2 weeks ago.',
      notes: 'Gastric discomfort resolved. Omeprazole tapered to PRN.',
      vitals: {
        bp: '122/80 mmHg',
        pulse: '76 bpm',
        temp: '98.6 °F',
        spO2: '98%',
        bmi: '25.1'
      },
      activityLog: [
        { timestamp: '09:55 AM', staffName: 'Receptionist Maya', action: 'Patient arrival confirmed' },
        { timestamp: '10:42 AM', staffName: 'Dr. Melvin', action: 'Completed review and discharged' }
      ]
    },
    {
      id: 'APT-1003',
      patientName: 'Dewi Kartika',
      patientId: 'MRN-77301',
      dob: '1998-03-22',
      age: 28,
      gender: 'Female',
      phone: '+62 821-4455-6677',
      timeSlot: '11:00',
      timeRange: '11:00 - 11:30',
      duration: '30 mins',
      type: 'Consultation',
      status: 'Checked In',
      priority: 'Urgent',
      doctorId: 'doc-2',
      room: 'Room 102',
      paymentStatus: 'Insured (BPJS)',
      vitalRequired: true,
      formsCompleted: false,
      waitingMinutes: 14,
      reason: 'Acute lower abdominal discomfort and intermittent low-grade fever',
      allergies: ['Sulfa drugs'],
      medications: ['Paracetamol 500mg'],
      history: 'Appendectomy in 2019.',
      notes: 'Fast-track vitals and urine dipstick requested before doctor examination.',
      vitals: {
        bp: '128/84 mmHg',
        pulse: '88 bpm',
        temp: '99.4 °F',
        spO2: '98%',
        bmi: '21.8'
      },
      activityLog: [
        { timestamp: '10:46 AM', staffName: 'Receptionist Maya', action: 'Patient arrived & checked in' },
        { timestamp: '10:50 AM', staffName: 'Nurse Sarah', action: 'Flagged as Urgent priority due to pain score 6/10' }
      ]
    },
    {
      id: 'APT-1004',
      patientName: 'Indah Permata',
      patientId: 'MRN-65209',
      dob: '1995-09-08',
      age: 30,
      gender: 'Female',
      phone: '+62 856-1122-3344',
      timeSlot: '13:00',
      timeRange: '13:00 - 13:45',
      duration: '45 mins',
      type: 'General Checkup',
      status: 'Registered',
      priority: 'Normal',
      doctorId: 'doc-1',
      room: 'Room 101',
      paymentStatus: 'Pending Verification',
      vitalRequired: true,
      formsCompleted: true,
      reason: 'Pre-employment health screening & chest radiograph review',
      allergies: ['None'],
      medications: ['None'],
      history: 'No significant past medical history.',
      notes: 'Ensure laboratory blood panel and audiometry records are attached.',
      activityLog: [
        { timestamp: '08:30 AM', staffName: 'System', action: 'Appointment booked via MediKiosk Desk' },
        { timestamp: '09:00 AM', staffName: 'Admin Lisa', action: 'Confirmed slot allocation' }
      ]
    },
    {
      id: 'APT-1005',
      patientName: 'Rina Kusuma',
      patientId: 'MRN-90134',
      dob: '1990-12-15',
      age: 35,
      gender: 'Female',
      phone: '+62 878-3344-5566',
      timeSlot: '14:00',
      timeRange: '14:00 - 14:30',
      duration: '30 mins',
      type: 'Consultation',
      status: 'Confirmed',
      priority: 'Normal',
      doctorId: 'doc-3',
      room: 'Room 103',
      paymentStatus: 'Direct Billing',
      formsCompleted: true,
      reason: 'Recurrent facial contact dermatitis evaluation',
      allergies: ['Fragrance mix', 'Nickel'],
      medications: ['Hydrocortisone 1% cream'],
      history: 'Chronic eczema history.',
      notes: 'Patch test results ready for review.',
      activityLog: [
        { timestamp: '09:15 AM', staffName: 'System', action: 'SMS Reminder dispatched' },
        { timestamp: '10:00 AM', staffName: 'Receptionist Maya', action: 'Patient confirmed attendance' }
      ]
    },
    {
      id: 'APT-1006',
      patientName: 'Bambang Wijaya',
      patientId: 'MRN-33821',
      dob: '1978-04-02',
      age: 48,
      gender: 'Male',
      phone: '+62 811-9988-7766',
      timeSlot: '15:00',
      timeRange: '15:00 - 15:45',
      duration: '45 mins',
      type: 'Lab Review',
      status: 'Registered',
      priority: 'Normal',
      doctorId: 'doc-2',
      room: 'Room 102',
      paymentStatus: 'Insured (BPJS)',
      formsCompleted: true,
      reason: 'Quarterly HbA1c and lipid panel review',
      allergies: ['Latex'],
      medications: ['Metformin 500mg', 'Atorvastatin 10mg'],
      history: 'Type 2 Diabetes Mellitus diagnosed in 2018.',
      notes: 'Latest HbA1c is 6.7%.',
      activityLog: [
        { timestamp: '08:00 AM', staffName: 'System', action: 'Scheduled automated check-in prompt' }
      ]
    },
    {
      id: 'APT-1007',
      patientName: 'Siti Nurhaliza',
      patientId: 'MRN-11928',
      dob: '2001-07-19',
      age: 25,
      gender: 'Female',
      phone: '+62 819-2233-4455',
      timeSlot: '15:00',
      timeRange: '15:00 - 15:30',
      duration: '30 mins',
      type: 'General Checkup',
      status: 'Registered',
      priority: 'Normal',
      doctorId: 'doc-1',
      room: 'Room 101',
      paymentStatus: 'Self-Pay (Paid)',
      formsCompleted: true,
      reason: 'Vaccination booster & international travel certification',
      allergies: ['Eggs'],
      medications: ['None'],
      history: 'Asthma in childhood.',
      notes: 'Typhoid booster requested.',
      activityLog: [
        { timestamp: '08:45 AM', staffName: 'System', action: 'Created appointment' }
      ]
    }
  ]);

  // Add Appointment form state
  const [formPatientName, setFormPatientName] = useState('');
  const [formPatientId, setFormPatientId] = useState('');
  const [formDoctorId, setFormDoctorId] = useState('doc-1');
  const [formSpecialty, setFormSpecialty] = useState('General Physician');
  const [formTimeSlot, setFormTimeSlot] = useState('11:00');
  const [formDuration, setFormDuration] = useState('30 mins');
  const [formType, setFormType] = useState<AppointmentType>('General Checkup');
  const [formPriority, setFormPriority] = useState<PriorityLevel>('Normal');
  const [formReason, setFormReason] = useState('');
  const [formPayment, setFormPayment] = useState<'Insured (BPJS)' | 'Self-Pay (Paid)' | 'Pending Verification' | 'Direct Billing'>('Insured (BPJS)');
  const [formSendConfirmation, setFormSendConfirmation] = useState(true);
  const [formSendReminder, setFormSendReminder] = useState(true);

  // Time slots for schedule grid
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Status Badge Helper
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Registered':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Confirmed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Checked In':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Consultation':
        return 'bg-indigo-900 text-white border-indigo-950 shadow-sm';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'No-show':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      case 'Rescheduled':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusDotColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Registered':
        return 'bg-blue-600';
      case 'Confirmed':
        return 'bg-purple-600';
      case 'Checked In':
        return 'bg-amber-500';
      case 'In Consultation':
        return 'bg-indigo-300';
      case 'Completed':
        return 'bg-emerald-500';
      case 'Cancelled':
        return 'bg-rose-500';
      case 'No-show':
        return 'bg-slate-400';
      case 'Rescheduled':
        return 'bg-yellow-500';
    }
  };
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {

      const matchesSearch =
        searchQuery === '' ||
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.type.toLowerCase().includes(searchQuery.toLowerCase());

      // Filters
      const matchesDoc = filterDoctor === 'all' || apt.doctorId === filterDoctor;
      const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
      const matchesType = filterType === 'all' || apt.type === filterType;
      const matchesPriority = filterPriority === 'all' || apt.priority === filterPriority;

      return matchesSearch && matchesDoc && matchesStatus && matchesType && matchesPriority;
    });
  }, [appointments, searchQuery, filterDoctor, filterStatus, filterType, filterPriority]);


  const getDoctorAppointmentCount = (docId: string) => {
    return appointments.filter((a) => a.doctorId === docId).length;
  };

  const availableSlotsForDoctor = useMemo(() => {
    const booked = appointments
      .filter((a) => a.doctorId === formDoctorId && a.status !== 'Cancelled')
      .map((a) => a.timeSlot);
    const doctorObj = doctors.find((d) => d.id === formDoctorId);
    const notAvailable = doctorObj?.notAvailableSlots || [];

    return timeSlots.filter((slot) => slot !== '12:00' && !booked.includes(slot) && !notAvailable.includes(slot));
  }, [formDoctorId, appointments, timeSlots, doctors]);

  const handleUpdateStatus = (aptId: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === aptId) {
          const updated = {
            ...apt,
            status: newStatus,
            activityLog: [
              {
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                staffName: `${activeRole} (Current User)`,
                action: `Status updated from ${apt.status} to ${newStatus}`
              },
              ...apt.activityLog
            ]
          };
          if (selectedAppointment?.id === aptId) {
            setSelectedAppointment(updated);
          }
          return updated;
        }
        return apt;
      })
    );
    setToastMessage(`Appointment ${aptId} status updated to ${newStatus}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientName.trim()) return;

    const startH = parseInt(formTimeSlot.split(':')[0]);
    const endH = startH + (formDuration.includes('45') ? 1 : 1);
    const timeRange = `${formTimeSlot} - ${endH < 10 ? '0' + endH : endH}:00`;

    const selectedDoc = doctors.find((d) => d.id === formDoctorId);

    const newApt: AppointmentRecord = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: formPatientName.trim(),
      patientId: formPatientId.trim() || `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      dob: '1996-01-01',
      age: 30,
      gender: 'Unspecified',
      phone: '+62 812-0000-0000',
      timeSlot: formTimeSlot,
      timeRange,
      duration: formDuration,
      type: formType,
      status: 'Registered',
      priority: formPriority,
      doctorId: formDoctorId,
      room: selectedDoc?.room || 'Room 101',
      paymentStatus: formPayment,
      vitalRequired: formType === 'General Checkup' || formType === 'Emergency Visit',
      formsCompleted: true,
      reason: formReason.trim() || 'General medical consultation',
      allergies: ['None documented'],
      medications: ['None documented'],
      history: 'New intake file created.',
      notes: 'Appointment booked through reception management system.',
      activityLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          staffName: `${activeRole} (Reception)`,
          action: 'New appointment created'
        }
      ]
    };

    setAppointments((prev) => [...prev, newApt]);
    setShowAddModal(false);
    setFormPatientName('');
    setFormPatientId('');
    setFormReason('');
    setToastMessage(`Appointment created successfully for ${newApt.patientName}`);
    setTimeout(() => setToastMessage(null), 3500);
  };


  const handleSaveNotes = (aptId: string, notesText: string) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === aptId) {
          const updated = {
            ...apt,
            notes: notesText,
            activityLog: [
              {
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                staffName: `${activeRole} (Clinical)`,
                action: 'Clinical consultation notes updated'
              },
              ...apt.activityLog
            ]
          };
          setSelectedAppointment(updated);
          return updated;
        }
        return apt;
      })
    );
    setToastMessage('Clinical notes saved to patient record');
    setTimeout(() => setToastMessage(null), 3000);
  };


  const handleSendAllReminders = () => {
    setToastMessage(`Dispatched automated SMS & WhatsApp reminders to ${appointments.filter((a) => a.status === 'Registered' || a.status === 'Confirmed').length} pending patients.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto pb-24 space-y-5 text-slate-800">

      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 bg-slate-900/95 backdrop-blur text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}


      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Doctor Appointment Schedule
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Internal clinical operational dashboard for scheduling, patient throughput, and multi-doctor coordination.
          </p>
        </div>


        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-xs self-start sm:self-auto">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-bold text-slate-500">Active Role:</span>
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as StaffRole)}
            className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="Clinic Admin">Clinic Admin (Full Access)</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse (Triage & Vitals)</option>
            <option value="Receptionist">Receptionist (Check-in)</option>
          </select>
        </div>
      </div>



      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient name, ID, or appointment"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white rounded-full border border-slate-200/90 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs font-bold text-slate-500 whitespace-nowrap bg-white px-3.5 py-2 rounded-full border border-slate-200/80 shadow-xs">
            {filteredAppointments.length} Active Appointments
          </span>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          {/* Filter button with active indicator */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border shadow-xs cursor-pointer transition-all ${filterDoctor !== 'all' || filterStatus !== 'all' || filterType !== 'all'
              ? 'bg-blue-50 text-blue-700 border-blue-300'
              : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50'
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            {(filterDoctor !== 'all' || filterStatus !== 'all' || filterType !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={() => alert('Appointment Schedule Settings:\n- Time block increment: 15 mins\n- Auto-refresh: 30s\n- Double-booking prevention: Enabled')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Settings</span>
          </button>

          {/* Time View Dropdown (Day / Week / Month) */}
          <div className="relative">
            <select
              value={timeView}
              onChange={(e) => setTimeView(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200/90 rounded-2xl px-4 py-2.5 pr-8 text-xs font-bold text-slate-700 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Day">Day View</option>
              <option value="Week">Week View</option>
              <option value="Month">Month View</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Primary + Add Appointment Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-600/25 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Appointment</span>
          </button>
        </div>
      </div>

      {/* Sub-header: Send All Reminders & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        {/* Send All Reminders Button */}
        <button
          onClick={handleSendAllReminders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer transition-colors self-start"
        >
          <Bell className="w-3.5 h-3.5 text-blue-600" />
          <span>Send All Reminders</span>
        </button>

        {/* Date Navigator */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
          <button
            onClick={() => setFormattedDate('Monday, 26 August 2026')}
            className="px-3.5 py-1.5 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-xl p-0.5 shadow-xs">
            <button
              title="Previous Day"
              className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              title="Next Day"
              className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm font-black text-slate-900 ml-1">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FILTER DRAWER EXPANSION (When toggled)                   */}
      {/* ======================================================== */}
      {showFilterDrawer && (
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor</label>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="all">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="Registered">Registered</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="In Consultation">In Consultation</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-show">No-show</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Appointment Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="all">All Types</option>
              <option value="General Checkup">General Checkup</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Consultation">Consultation</option>
              <option value="Emergency Visit">Emergency Visit</option>
              <option value="Lab Review">Lab Review</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="all">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MULTI-DOCTOR TIMETABLE SCHEDULE GRID                  */}
      {/* ======================================================== */}
      <div className="bg-white rounded-[2rem] border border-slate-200/90 shadow-xs overflow-x-auto relative">
        {/* Table Header: GMT Timezone & Doctor Columns */}
        <div className="grid grid-cols-12 min-w-[950px] border-b border-slate-200/90 bg-slate-50/60 sticky top-0 z-10">
          {/* Timezone Col */}
          <div className="col-span-2 p-4 sm:p-5 flex items-center justify-center border-r border-slate-200/90 text-center">
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">GMT</span>
              <span className="text-sm font-black text-slate-900">+08.00</span>
            </div>
          </div>

          {/* Doctor Headers */}
          {doctors.map((doc, idx) => {
            const count = getDoctorAppointmentCount(doc.id);
            const isLast = idx === doctors.length - 1;

            return (
              <div
                key={doc.id}
                className={`col-span-3 or col-span-3.3 p-4 sm:p-5 flex items-center gap-3.5 ${!isLast ? 'border-r border-slate-200/90' : ''
                  }`}
              >
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      {doc.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      {doc.room}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 leading-tight mt-0.5">
                    {doc.specialty}
                  </span>
                  {/* Total appointment count on doctor tab */}
                  <span className="text-[11px] font-medium text-slate-500 mt-1">
                    Today's Appointment:{' '}
                    <strong className="text-slate-900 font-bold">{count} patient(s)</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Time Slot Rows */}
        <div className="relative min-w-[950px]">
          {timeSlots.map((slot) => {
            const isBreak = slot === '12:00';

            return (
              <div
                key={slot}
                className={`grid grid-cols-12 min-h-[125px] border-b border-slate-200/70 relative ${isBreak ? 'bg-slate-50/70' : 'bg-white'
                  }`}
              >
                {/* Time Label Column */}
                <div className="col-span-2 p-4 flex items-start justify-center border-r border-slate-200/90">
                  <span className="text-xs font-black text-slate-600 tracking-wide mt-1">{slot}</span>
                </div>

                {/* Break Time Row */}
                {isBreak ? (
                  <div className="col-span-10 flex items-center justify-around py-8 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50/80">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Staff Break Time</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Staff Break Time</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Staff Break Time</span>
                  </div>
                ) : (
                  /* Doctor Slot Columns */
                  doctors.map((doc, idx) => {
                    const isLast = idx === doctors.length - 1;
                    const isNotAvailable = doc.notAvailableSlots?.includes(slot);

                    // Find appointment matching doctor and slot
                    const apt = filteredAppointments.find(
                      (a) => a.doctorId === doc.id && a.timeSlot === slot
                    );

                    return (
                      <div
                        key={doc.id}
                        className={`col-span-3 or flex-1 p-2.5 sm:p-3 relative ${!isLast ? 'border-r border-slate-200/70' : ''
                          } ${isNotAvailable ? 'bg-rose-50/40' : ''}`}
                      >
                        {isNotAvailable ? (
                          /* Not Available Block (Pink / Light-Red as requested) */
                          <div className="h-full min-h-[95px] rounded-2xl flex flex-col items-center justify-center text-xs font-bold text-rose-500 bg-rose-50/60 border border-rose-100 border-dashed select-none">
                            <span>Not Available</span>
                            <span className="text-[10px] text-rose-400 font-medium">Department Meeting</span>
                          </div>
                        ) : apt ? (
                          /* APPOINTMENT CARD */
                          <div
                            onClick={() => setSelectedAppointment(apt)}
                            className="h-full min-h-[95px] rounded-2xl p-3 flex flex-col justify-between transition-all shadow-xs hover:shadow-md border border-slate-200/90 bg-white hover:border-blue-300 cursor-pointer group relative overflow-hidden"
                          >
                            {/* Urgent Priority Left Accent Line */}
                            {apt.priority === 'Urgent' && (
                              <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500" />
                            )}
                            {apt.priority === 'Emergency' && (
                              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-600 animate-pulse" />
                            )}

                            {/* Card Top: Patient Name, MRN & Status Badge */}
                            <div className="flex items-start justify-between gap-1 pl-1">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                    {apt.patientName}
                                  </h4>
                                  {apt.priority === 'Urgent' && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black">
                                      URGENT
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                                  {apt.patientId} · {apt.timeRange}
                                </span>
                              </div>

                              {/* Status Pill with explicit color-coding */}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${getStatusBadge(
                                  apt.status
                                )}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(apt.status)}`} />
                                {apt.status}
                              </span>
                            </div>

                            {/* Card Middle: Clinical Indicators & Waiting Time */}
                            <div className="flex items-center gap-1.5 flex-wrap pl-1 my-1">
                              {apt.vitalRequired && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[9px] font-black border border-rose-100 flex items-center gap-1">
                                  <HeartPulse className="w-2.5 h-2.5" /> Vital Sign Required
                                </span>
                              )}
                              {apt.status === 'Checked In' && apt.waitingMinutes && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-200">
                                  Wait: {apt.waitingMinutes}m
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold">
                                {apt.type}
                              </span>
                            </div>

                            {/* Card Bottom: Payment & Quick Action Buttons */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 pl-1">
                              <span className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">
                                {apt.paymentStatus}
                              </span>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1">
                                {apt.status === 'Registered' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(apt.id, 'Checked In');
                                    }}
                                    title="Check In Patient"
                                    className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                                  >
                                    <UserCheck className="w-3 h-3" /> Check In
                                  </button>
                                )}

                                {apt.status === 'Checked In' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(apt.id, 'In Consultation');
                                    }}
                                    title="Start Consultation"
                                    className="px-2 py-1 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                                  >
                                    <Stethoscope className="w-3 h-3" /> Start
                                  </button>
                                )}

                                {apt.status === 'In Consultation' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateStatus(apt.id, 'Completed');
                                    }}
                                    title="Complete Checkup"
                                    className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" /> Complete
                                  </button>
                                )}

                                {apt.status === 'Completed' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedAppointment(apt);
                                    }}
                                    title="View Record Summary"
                                    className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Empty Slot */
                          <div
                            onClick={() => {
                              setFormDoctorId(doc.id);
                              setFormTimeSlot(slot);
                              setShowAddModal(true);
                            }}
                            className="h-full min-h-[95px] rounded-2xl flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-blue-50/30 border border-transparent hover:border-blue-200 transition-all group cursor-pointer"
                          >
                            <span className="text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-xs border border-blue-200">
                              <Plus className="w-3 h-3" /> Book Slot
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}

          {/* Current Time Red Horizontal Line Marker (at 11:00) */}
          <div
            className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
            style={{ top: '375px' }}
          >
            <div className="w-3 h-3 rounded-full bg-rose-500 -ml-1.5 shadow-md ring-4 ring-rose-300/80" />
            <div className="flex-1 h-[2px] bg-rose-500 shadow-sm relative flex items-center justify-center">
              <div className="bg-slate-950 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-lg transform -translate-y-0.5">
                11:00
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. APPOINTMENT DETAIL DRAWER (Slide-Over Right Panel)    */}
      {/* ======================================================== */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between animate-in slide-in-from-right duration-250 border-l border-slate-200">
            <div className="space-y-6">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-base shadow-xs">
                    {selectedAppointment.patientName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">
                      {selectedAppointment.patientName}
                    </h2>
                    <span className="text-xs font-bold text-slate-400">
                      {selectedAppointment.patientId} · {selectedAppointment.gender}, {selectedAppointment.age} yrs
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Update Quick Switcher */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Status</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border mt-1 ${getStatusBadge(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>

                {/* Change Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Change:</span>
                  <select
                    value={selectedAppointment.status}
                    onChange={(e) => handleUpdateStatus(selectedAppointment.id, e.target.value as AppointmentStatus)}
                    className="text-xs font-bold p-2 bg-white rounded-xl border border-slate-200 shadow-xs cursor-pointer"
                  >
                    <option value="Registered">Registered</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Checked In">Checked In</option>
                    <option value="In Consultation">In Consultation</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="No-show">No-show</option>
                    <option value="Rescheduled">Rescheduled</option>
                  </select>
                </div>
              </div>

              {/* Appointment Overview Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Scheduled Slot</span>
                  <span className="font-extrabold text-slate-900 block mt-0.5">{selectedAppointment.timeRange}</span>
                  <span className="text-slate-500 text-[11px]">{selectedAppointment.duration}</span>
                </div>

                <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Doctor</span>
                  <span className="font-extrabold text-slate-900 block mt-0.5">
                    {doctors.find((d) => d.id === selectedAppointment.doctorId)?.name}
                  </span>
                  <span className="text-blue-600 font-bold text-[11px]">{selectedAppointment.room}</span>
                </div>
              </div>

              {/* Vitals Panel (If Recorded) */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-500" /> Triage Vitals
                  </h4>
                  {selectedAppointment.vitalRequired && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100">
                      Pending Triage
                    </span>
                  )}
                </div>

                {selectedAppointment.vitals ? (
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 block">BP</span>
                      <strong className="text-slate-800">{selectedAppointment.vitals.bp}</strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 block">HR</span>
                      <strong className="text-slate-800">{selectedAppointment.vitals.pulse}</strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 block">SpO2</span>
                      <strong className="text-slate-800">{selectedAppointment.vitals.spO2}</strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 block">Temp</span>
                      <strong className="text-slate-800">{selectedAppointment.vitals.temp}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Vitals not yet recorded for this slot.</p>
                )}
              </div>

              {/* Reason for Visit & Clinical History */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-black text-slate-900 mb-1">Reason for Visit</h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedAppointment.reason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900 mb-1">Allergies</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedAppointment.allergies.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100">
                          ⚠️ {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 mb-1">Current Medications</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedAppointment.medications.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                          💊 {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Consultation Notes Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-black text-slate-900">Clinical Consultation Notes</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Auto-saves to EHR</span>
                </div>
                <textarea
                  defaultValue={selectedAppointment.notes}
                  rows={3}
                  onBlur={(e) => handleSaveNotes(selectedAppointment.id, e.target.value)}
                  placeholder="Type examination findings, diagnosis, or prescription instructions..."
                  className="w-full text-xs p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed"
                />
              </div>

              {/* Activity Audit Trail Log */}
              <div>
                <h4 className="text-xs font-black text-slate-900 mb-2">Activity Audit Trail</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedAppointment.activityLog.map((log, i) => (
                    <div key={i} className="text-[11px] p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{log.action}</span>
                        <span className="block text-[10px] text-slate-400">By {log.staffName}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-5 border-t border-slate-200 mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowCancelConfirm(selectedAppointment)}
                className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel Appointment
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedAppointment.id, 'Completed');
                    setSelectedAppointment(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ADD APPOINTMENT MODAL (With Double-Booking Prevention) */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-7 max-w-lg w-full shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Schedule New Appointment</h3>
                <p className="text-xs font-medium text-slate-400">Double-booking prevention active</p>
              </div>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              {/* Patient Name & MRN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siti Nurhaliza"
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient ID / MRN</label>
                  <input
                    type="text"
                    placeholder="e.g. MRN-90122 (Auto if empty)"
                    value={formPatientId}
                    onChange={(e) => setFormPatientId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </div>

              {/* Doctor & Specialty Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Doctor *</label>
                  <select
                    value={formDoctorId}
                    onChange={(e) => {
                      setFormDoctorId(e.target.value);
                      const docObj = doctors.find((d) => d.id === e.target.value);
                      if (docObj) setFormSpecialty(docObj.specialty);
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.room})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    readOnly
                    value={formSpecialty}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 font-semibold text-slate-600 select-none"
                  />
                </div>
              </div>

              {/* Available Time Slot & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Time Slot *</label>
                  <select
                    value={formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    {availableSlotsForDoctor.length > 0 ? (
                      availableSlotsForDoctor.map((s) => (
                        <option key={s} value={s}>
                          {s} - Available
                        </option>
                      ))
                    ) : (
                      <option disabled value="">
                        No slots available for this doctor
                      </option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  >
                    <option value="15 mins">15 mins (Brief Consultation)</option>
                    <option value="30 mins">30 mins (Standard Checkup)</option>
                    <option value="45 mins">45 mins (Comprehensive Exam)</option>
                    <option value="60 mins">60 mins (Specialist Procedure)</option>
                  </select>
                </div>
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Appointment Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as AppointmentType)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  >
                    <option value="General Checkup">General Checkup</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Emergency Visit">Emergency Visit</option>
                    <option value="Lab Review">Lab Review</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as PriorityLevel)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent (Fast-track)</option>
                    <option value="Emergency">Emergency (Immediate)</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method / Insurance</label>
                <select
                  value={formPayment}
                  onChange={(e) => setFormPayment(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                >
                  <option value="Insured (BPJS)">Insured (BPJS Kesehatan)</option>
                  <option value="Direct Billing">Private Insurance (Direct Billing)</option>
                  <option value="Self-Pay (Paid)">Self-Pay (Cash / Credit Card)</option>
                  <option value="Pending Verification">Pending Coverage Verification</option>
                </select>
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Visit & Symptoms</label>
                <textarea
                  rows={2}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Primary complaint or clinical referral details..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Notification Checkboxes */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSendConfirmation}
                    onChange={(e) => setFormSendConfirmation(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">Send WhatsApp / SMS booking confirmation</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSendReminder}
                    onChange={(e) => setFormSendReminder(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-slate-700">Schedule automated reminder (2 hours before visit)</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer mt-2"
              >
                Confirm & Create Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. CANCEL CONFIRMATION DIALOG MODAL                      */}
      {/* ======================================================== */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-7 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">Cancel Appointment?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel the appointment for <strong>{showCancelConfirm.patientName}</strong>? This slot will be opened for other patients.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowCancelConfirm(null)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(showCancelConfirm.id, 'Cancelled');
                  setShowCancelConfirm(null);
                  setSelectedAppointment(null);
                }}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
