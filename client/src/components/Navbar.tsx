import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, Sparkles, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  doctorName?: string;
  role?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNotDashboard = location.pathname !== '/';

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-transparent">
      {/* Brand & Windows Back Button */}
      <div className="flex items-center gap-3">
        {/* Simple Windows-style Back button on all tabs except Dashboard */}
        {isNotDashboard && (
          <button
            onClick={() => navigate(-1)}
            title="Go Back"
            className="w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black shadow-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-black tracking-wider text-slate-900 uppercase">
            MEDIX
          </span>
        </div>
      </div>

      {/* Action Controls & Doctor Profile */}
      <div className="flex items-center gap-4">
        {/* Patient Kiosk Terminal button */}
        <button
          title="Open Patient Intake Kiosk"
          onClick={() => navigate('/kiosk')}
          className="px-3.5 py-2 rounded-full bg-white border border-indigo-200 shadow-xs flex items-center gap-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Patient Kiosk
        </button>

        {/* Settings button */}
        <button
          title="Settings"
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Notifications button */}
        <button
          title="Notifications"
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
