import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Dashboard from './app/Dashboard';
import Patients from './app/Patients';
import PatientDetail from './app/PatientDetail';
import Appointments from './app/Appointments';
import Consultations from './app/Consultations';
import Reports from './app/Reports';
import Profile from './app/Profile';
import Settings from './app/Settings';
import PrescriptionPage from './app/PrescriptionPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-[#f4f6f9]">
        {/* Modern Pill Sidebar */}
        <Sidebar />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Modern Header / Navbar */}
          <Navbar doctorName="Dr. John Smith" role="Admin" />

          {/* Page Routing Container */}
          <main className="flex-1 overflow-y-auto px-6 lg:px-8 pt-2">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/prescription/:id" element={<PrescriptionPage />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/consultations" element={<Consultations />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              {/* Fallback routes */}
              <Route path="/analytics" element={<Reports />} />
              <Route path="/help" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
