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
  MonitorSmartphone
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const mainNavItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
  { to: '/patients', label: 'Patients', icon: <FileText className="w-5 h-5" /> },
  { to: '/appointments', label: 'Appointments', icon: <CalendarDays className="w-5 h-5" /> },
  { to: '/consultations', label: 'Consultations', icon: <MessageSquareText className="w-5 h-5" /> },
  { to: '/reports', label: 'Reports', icon: <FolderLock className="w-5 h-5" /> },
];

const bottomNavItems: NavItem[] = [
  { to: '/kiosk', label: 'Patient Kiosk', icon: <MonitorSmartphone className="w-5 h-5 text-emerald-400" /> },
  { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  { to: '/profile', label: 'Logout', icon: <LogOut className="w-5 h-5" /> },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-18 lg:w-20 bg-white text-slate-500 rounded-[2.5rem] flex flex-col items-center py-7 px-2.5 my-3 ml-4 shadow-sm shrink-0 justify-between select-none h-[calc(100vh-24px)] sticky top-3 border border-slate-100">
      {/* Top Section */}
      <div className="flex flex-col items-center gap-5 w-full">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
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
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              `relative group p-3 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive
                ? 'bg-primary text-white shadow-md shadow-primary/20'
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
    </aside>
  );
};

export default Sidebar;
