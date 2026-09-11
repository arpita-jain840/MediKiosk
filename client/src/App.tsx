import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Doctor Pages
import Dashboard from './app/Dashboard';
import Patients from './app/Patients';
import PatientDetail from './app/PatientDetail';
import Appointments from './app/Appointments';
import Consultations from './app/Consultations';
import Reports from './app/Reports';
import Profile from './app/Profile';
import Settings from './app/Settings';
import PrescriptionPage from './app/PrescriptionPage';

// Patient Kiosk & Access Submission
import RoughInputTest from './Input_section';
import SubmitAccess from './app/SubmitAccess';

const DoctorLayout = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#f4f6f9]">
      {/* Modern Pill Sidebar & Mobile Floating Pill Bar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Modern Header / Navbar */}
        <Navbar doctorName="Dr. Ananya Sharma" role="Admin" />

        {/* Page Routing Container */}
        <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 pt-1 md:pt-2 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const KioskLayout = () => {
  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">
      <RoughInputTest />
    </main>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Patient Intake Kiosk & QR Access Submission */}
        <Route path="/kiosk" element={<KioskLayout />} />
        <Route path="/submit" element={<SubmitAccess />} />

        {/* Doctor Clinical Suite */}
        <Route element={<DoctorLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/doctor" element={<Navigate to="/" replace />} />
          <Route path="/doctor/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctor/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/doctor/patients/:id" element={<PatientDetail />} />
          <Route path="/prescription/:id" element={<PrescriptionPage />} />
          <Route path="/doctor/prescription/:id" element={<PrescriptionPage />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctor/appointments" element={<Appointments />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/doctor/consultations" element={<Consultations />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/doctor/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/doctor/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/doctor/settings" element={<Settings />} />
          <Route path="/analytics" element={<Reports />} />
          <Route path="/help" element={<Settings />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;