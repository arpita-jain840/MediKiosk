import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DoctorNavBar from './doctor/components/DoctorNavBar';
import DoctorTopBar from './doctor/components/DoctorTopBar';

// Doctor Pages
import DoctorDashboard from './doctor/pages/DoctorDashboard';
import Patients from './doctor/pages/Patients';
import PatientDetail from './doctor/pages/PatientDetail';
import Appointments from './doctor/pages/Appointments';
import Consultations from './doctor/pages/Consultations';
import Reports from './doctor/pages/Reports';
import Profile from './doctor/pages/Profile';
import Settings from './doctor/pages/Settings';
import PrescriptionPage from './doctor/pages/PrescriptionPage';

// Patient App & Access Submission
import PatientApp from './user/PatientApp';
import SubmitAccess from './app/SubmitAccess';
import { LanguageModal } from './user/components/LanguageModal';

// Auth
import Login from './auth/Login';

const DoctorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState('en');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentTab = location.pathname.includes('/patients')
    ? 'queue'
    : location.pathname.includes('/appointments')
      ? 'appointments'
      : location.pathname.includes('/prescription')
        ? 'prescriptions'
        : location.pathname.includes('/reports')
          ? 'records'
          : 'dashboard';

  const pageHeader = location.pathname.includes('/appointments')
    ? {
        title: 'Doctor Appointment Schedule',
        subtitle: 'Internal clinical operational dashboard for scheduling, patient throughput, and multi-doctor coordination.',
      }
    : location.pathname.includes('/reports')
      ? {
          title: 'Reports & Analytics',
          subtitle: 'Review patient trends, consultation activity, outcomes, and clinical reports.',
        }
      : location.pathname === '/doctor/patients'
        ? {
            title: 'Patient Directory',
            subtitle: 'Real-time queue of waiting, consulting, and completed patient prescriptions.',
          }
        : {
            title: 'MediKiosk OPD',
            subtitle: 'Cardiology · On Duty',
          };

  const setTab = (tab: string) => {
    const paths: Record<string, string> = {
      dashboard: '/doctor/dashboard',
      queue: '/doctor/patients',
      appointments: '/doctor/appointments',
      prescriptions: '/doctor/prescription/PAT-1001',
      records: '/doctor/reports',
      'ai-assistant': '/doctor/consultations',
    };
    navigate(paths[tab] || paths.dashboard);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen w-screen overflow-hidden bg-[var(--bg)]">
      <DoctorNavBar tab={currentTab} setTab={setTab} currentLang={currentLang} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DoctorTopBar
          title={pageHeader.title}
          subtitle={pageHeader.subtitle}
          doctorName="Dr. Ananya Sharma"
          currentLang={currentLang}
          onOpenLangModal={() => setIsLangModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBack={location.pathname === '/doctor/dashboard' ? undefined : () => navigate(-1)}
          onOpenProfile={() => navigate('/doctor/profile')}
        />

        <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 pt-1 md:pt-2 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {isLangModalOpen && (
        <LanguageModal
          currentLang={currentLang}
          onSelectLanguage={(language) => {
            setCurrentLang(language);
            setIsLangModalOpen(false);
          }}
          onClose={() => setIsLangModalOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  // Role-based authentication persisted in localStorage
  const [userRole, setUserRole] = useState<'doctor' | 'patient' | null>(() => {
    return (localStorage.getItem('medikiosk_role') as 'doctor' | 'patient') || null;
  });

  const handleSetRole = (role: 'doctor' | 'patient' | null) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('medikiosk_role', role);
    } else {
      localStorage.removeItem('medikiosk_role');
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login onLogin={handleSetRole} />} />

        {/* Access Submission from QR */}
        <Route path="/submit" element={<SubmitAccess />} />

        {/* Base Route handles redirects based on auth */}
        <Route path="/" element={
          !userRole ? <Navigate to="/login" replace /> :
          userRole === 'doctor' ? <Navigate to="/doctor/dashboard" replace /> :
          <Navigate to="/patient" replace />
        } />

        {/* Patient Route */}
        <Route path="/patient" element={
          userRole === 'patient' ? <PatientApp /> : <Navigate to="/login" replace />
        } />
        <Route path="/patient/:id" element={
          userRole === 'doctor' ? <PatientDetail /> : <Navigate to="/login" replace />
        } />
        {/* Keep kiosk as alias */}
        <Route path="/kiosk" element={<Navigate to="/patient" replace />} />

        {/* Direct patient detail route aliases */}
        <Route path="/patients/:id" element={<Navigate to="/doctor/patients/:id" replace />} />

        {/* Doctor Clinical Suite */}
        <Route path="/doctor" element={
          userRole === 'doctor' ? <DoctorLayout /> : <Navigate to="/login" replace />
        }>
          <Route index element={<DoctorDashboard />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="prescription/:id" element={<PrescriptionPage />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="consultations" element={<Consultations />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Reports />} />
          <Route path="help" element={<Settings />} />
          {/* Catch-all fallback inside doctor */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Global Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;