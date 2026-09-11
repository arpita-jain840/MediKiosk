import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Sparkles, ArrowLeft, QrCode } from 'lucide-react';
import { QRScanModal } from './QRScanModal';

interface NavbarProps {
  doctorName?: string;
  role?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNotDashboard = location.pathname !== '/';
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

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
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black shadow-md">
            <Sparkles className="w-4 h-4 text-primary-tint" />
          </div>
          <span className="text-xl font-black tracking-wider text-primary uppercase">
            MEDIX
          </span>
        </div>
      </div>

      {/* Action Controls & Doctor Profile */}
      <div className="flex items-center gap-3">
        {/* Scan QR Code Button */}
        <button
          onClick={() => setIsQRModalOpen(true)}
          title="Scan Patient QR Code"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white shadow-md hover:bg-primary/95 transition-all text-xs font-bold cursor-pointer"
        >
          <QrCode size={15} />
          <span>Scan Patient QR</span>
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

      {/* QR Code Scanner / Token Modal */}
      <QRScanModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </header>
  );
};


export default Navbar;
