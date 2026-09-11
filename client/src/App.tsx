import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './doctor/components/Sidebar';
import Navbar from './doctor/components/Navbar';

// Doctor Pages
import Dashboard from './doctor/pages/Dashboard';
import Patients from './doctor/pages/Patients';
import PatientDetail from './doctor/pages/PatientDetail';
import Appointments from './doctor/pages/Appointments';
import Consultations from './doctor/pages/Consultations';
import Reports from './doctor/pages/Reports';
import Profile from './doctor/pages/Profile';
import Settings from './doctor/pages/Settings';
import PrescriptionPage from './doctor/pages/PrescriptionPage';

// Patient App
import PatientApp from './user/PatientApp';

// Auth
import Login from './auth/Login';

const DoctorLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-warm font-sans">
      {/* Modern Pill Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Modern Header / Navbar */}
        <Navbar doctorName="Dr. John Smith" role="Admin" />

        {/* Page Routing Container */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-8 pt-2">
          <Outlet />
        </main>
      </div>
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
        {/* Keep kiosk as alias or redirect */}
        <Route path="/kiosk" element={<Navigate to="/patient" replace />} />
        
        {/* Direct patient detail route aliases */}
        <Route path="/patients/:id" element={<Navigate to="/doctor/patients/:id" replace />} />

        {/* Doctor Clinical Suite */}
        <Route path="/doctor" element={
          userRole === 'doctor' ? <DoctorLayout /> : <Navigate to="/login" replace />
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
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