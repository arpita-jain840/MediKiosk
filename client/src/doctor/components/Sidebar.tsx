import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  FileText,
  CalendarDays,
  MessageSquareText,
  FolderLock,
  Settings,
  LogOut,
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const mainNavItems: NavItem[] = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
  { to: '/doctor/patients', label: 'Patients', icon: <FileText className="w-5 h-5" /> },
  { to: '/doctor/appointments', label: 'Appointments', icon: <CalendarDays className="w-5 h-5" /> },
  { to: '/doctor/consultations', label: 'Consultations', icon: <MessageSquareText className="w-5 h-5" /> },
  { to: '/doctor/reports', label: 'Reports', icon: <FolderLock className="w-5 h-5" /> },
];

export const Sidebar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('medikiosk_role');
    localStorage.removeItem('medikiosk_token');
    localStorage.removeItem('medikiosk_user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-18 lg:w-20 bg-white text-slate-500 rounded-[2.5rem] flex flex-col items-center py-7 px-2.5 my-3 ml-4 shadow-sm shrink-0 justify-between select-none h-[calc(100vh-24px)] sticky top-3 border border-slate-100">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-5 w-full">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/doctor' || item.to === '/doctor/dashboard'}
            title={item.label}
            className={({ isActive }) =>
              `relative group p-3 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                : 'text-slate-400 hover:text-primary hover:bg-primary-tint/50'
              }`
            }
          >
            {item.icon}

            {/* Hover Tooltip */}
            <span className="absolute left-[calc(100%+14px)] bg-slate-800 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 w-full pt-4 border-t border-slate-100">
        <NavLink
          to="/doctor/settings"
          title="Settings"
          className={({ isActive }) =>
            `relative group p-3 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-400 hover:text-primary hover:bg-primary-tint/50'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="absolute left-[calc(100%+14px)] bg-slate-800 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
            Settings
          </span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="relative group p-3 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="absolute left-[calc(100%+14px)] bg-slate-800 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
