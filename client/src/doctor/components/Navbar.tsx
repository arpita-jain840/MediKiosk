import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Sparkles, ArrowLeft, Settings, QrCode } from 'lucide-react';
import { QRScanModal } from './QRScanModal';

interface NavbarProps {
  doctorName?: string;
  role?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNotDashboard = location.pathname !== '/' && location.pathname !== '/doctor' && location.pathname !== '/doctor/dashboard';
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-4 bg-transparent">
      
      <div className="flex items-center gap-2 sm:gap-3">
       
        {isNotDashboard && (
          <button
            onClick={() => navigate(-1)}
            title="Go Back"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black shadow-md">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-wider text-slate-900 uppercase">
            MEDIKIOSK
          </span>
        </div>
      </div>

    
      <div className="flex items-center gap-2 sm:gap-3">
  
        <button
          onClick={() => setIsQRModalOpen(true)}
          title="Scan Patient QR Code"
          className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-primary text-white shadow-xs flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer"
        >
          <QrCode size={14} />
          <span className="hidden xs:inline">Scan QR</span>
        </button>
   
        <button
          title="Open Patient Intake Kiosk"
          onClick={() => navigate('/patient')}
          className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white border border-teal-200 shadow-xs flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Patient App</span>
        </button>

  
        <button
          title="Settings"
          onClick={() => navigate('/doctor/settings')}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          title="Notifications"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all relative cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>
      </div>

      <QRScanModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </header>
  );
};

export default Navbar;
