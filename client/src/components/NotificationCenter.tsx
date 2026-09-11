import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  FileText,
  Image,
  MessageCircle,
  Ticket,
  UserRound,
  X,
} from "lucide-react";

type NotificationRole = "patient" | "doctor";
type NotificationFilter = "all" | "unread";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  icon: React.ElementType;
  tone: string;
  unread: boolean;
  person?: string;
  action?: string;
  preview?: boolean;
};

const patientNotifications: NotificationItem[] = [
  { id: "patient-prescription", title: "Your prescription is ready", message: "Dr. Ananya Sharma has uploaded your prescription.", time: "5 min ago", date: "11 September 2026, 10:42 AM", icon: FileText, tone: "bg-sky-50 text-sky-700", unread: true, person: "Dr. Ananya Sharma", action: "View Prescription" },
  { id: "patient-reminder", title: "Appointment reminder", message: "Your appointment is scheduled for today at 11:30 AM.", time: "1 hour ago", date: "11 September 2026, 9:42 AM", icon: CalendarDays, tone: "bg-amber-50 text-amber-700", unread: true, person: "Dr. Ananya Sharma", action: "View Appointment" },
  { id: "patient-message", title: "New message from your doctor", message: "Dr. Rajesh Kumar sent you a message regarding your consultation.", time: "2 hours ago", date: "11 September 2026, 8:42 AM", icon: MessageCircle, tone: "bg-indigo-50 text-indigo-700", unread: false, person: "Dr. Rajesh Kumar", action: "Open Message" },
  { id: "patient-document", title: "New document uploaded", message: "Your doctor uploaded a new prescription/document.", time: "Yesterday", date: "10 September 2026, 4:10 PM", icon: Image, tone: "bg-violet-50 text-violet-700", unread: false, person: "Dr. Ananya Sharma", action: "View Document", preview: true },
  { id: "patient-confirmed", title: "Appointment confirmed", message: "Your OPD appointment with Dr. Priya Mehta has been confirmed.", time: "Yesterday", date: "10 September 2026, 1:20 PM", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700", unread: false, person: "Dr. Priya Mehta", action: "View Appointment" },
  { id: "patient-token", title: "Your OPD token is approaching", message: "Your token number is 18. Please be ready for your consultation.", time: "Today", date: "11 September 2026, 10:00 AM", icon: Ticket, tone: "bg-teal-50 text-teal-700", unread: false, action: "View Queue" },
];

const doctorNotifications: NotificationItem[] = [
  { id: "doctor-critical", title: "Critical patient alert", message: "Patient Rahul Sharma has been flagged with a critical symptom.", time: "2 min ago", date: "11 September 2026, 10:41 AM", icon: AlertTriangle, tone: "bg-rose-50 text-rose-700", unread: true, person: "Rahul Sharma", action: "View Patient" },
  { id: "doctor-new-patient", title: "New patient submitted", message: "A patient has shared their medical information with you.", time: "5 min ago", date: "11 September 2026, 10:38 AM", icon: UserRound, tone: "bg-sky-50 text-sky-700", unread: true, action: "View Patient" },
  { id: "doctor-message", title: "New message from patient", message: "Patient Priya Singh sent you a message.", time: "15 min ago", date: "11 September 2026, 10:28 AM", icon: MessageCircle, tone: "bg-indigo-50 text-indigo-700", unread: false, person: "Priya Singh", action: "Open Message" },
  { id: "doctor-event", title: "New OPD event", message: "Your department has a new OPD schedule update.", time: "1 hour ago", date: "11 September 2026, 9:42 AM", icon: CalendarDays, tone: "bg-amber-50 text-amber-700", unread: false, action: "View Event" },
  { id: "doctor-upload", title: "Prescription uploaded", message: "A prescription/document has been uploaded for patient Rahul Sharma.", time: "2 hours ago", date: "11 September 2026, 8:42 AM", icon: FileText, tone: "bg-violet-50 text-violet-700", unread: false, person: "Rahul Sharma", action: "View Document", preview: true },
  { id: "doctor-appointment", title: "Upcoming appointment", message: "Patient Amit Verma is scheduled for consultation at 12:30 PM.", time: "Today", date: "11 September 2026, 12:30 PM", icon: CalendarDays, tone: "bg-emerald-50 text-emerald-700", unread: false, person: "Amit Verma", action: "View Appointment" },
  { id: "doctor-case", title: "Patient case updated", message: "New clinical information has been added to a patient's case.", time: "Yesterday", date: "10 September 2026, 5:10 PM", icon: FileText, tone: "bg-slate-100 text-slate-700", unread: false, action: "View Case" },
];

interface NotificationCenterProps {
  role: NotificationRole;
  mobile?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ role, mobile = false }) => {
  const [items, setItems] = useState(() => (role === "patient" ? patientNotifications : doctorNotifications));
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const unreadCount = items.filter((item) => item.unread).length;
  const visibleItems = filter === "unread" ? items.filter((item) => item.unread) : items;

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSelected(null);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const openNotification = (item: NotificationItem) => {
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, unread: false } : entry));
    setSelected({ ...item, unread: false });
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${mobile ? "flex-1 flex flex-col items-center justify-center" : "hidden md:block"}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        title="Notifications"
        className={`${mobile ? "w-10 h-10 text-slate-500 hover:text-primary hover:bg-slate-50" : "w-8 h-8 sm:w-10 sm:h-10 bg-white border border-slate-200/80 shadow-2xs text-slate-600 hover:text-primary hover:bg-slate-50"} rounded-full flex items-center justify-center transition-all relative cursor-pointer`}
      >
        <Bell className={`${mobile ? "w-4 h-4" : "w-3.5 h-3.5 sm:w-4 sm:h-4"}`} />
        {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center border-2 border-[var(--bg)]">{unreadCount}</span>}
      </button>
      {mobile && <span className="text-[10.5px] font-medium text-slate-500">Notifications</span>}

      {open && (
        <div className={`fixed md:absolute ${mobile ? "bottom-[4.5rem] top-auto" : "top-[4.5rem] md:top-[calc(100%+10px)]"} right-3 md:right-0 z-50 w-[calc(100vw-24px)] max-w-[400px] rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150`}>
          <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
            <div><h2 className="text-sm font-extrabold text-slate-900">Notifications</h2><p className="text-[11px] text-slate-400 mt-1">Your latest updates and reminders</p></div>
            <button type="button" onClick={() => setItems((current) => current.map((item) => ({ ...item, unread: false })))} className="text-[10px] font-bold text-primary hover:underline whitespace-nowrap cursor-pointer">Mark all as read</button>
          </div>
          <div className="px-3 pt-3 flex items-center gap-1">
            {(["all", "unread"] as NotificationFilter[]).map((option) => <button key={option} type="button" onClick={() => setFilter(option)} className={`px-3 py-1 rounded-full text-[10px] font-bold capitalize cursor-pointer ${filter === option ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-50"}`}>{option}</button>)}
          </div>
          <div className="max-h-[min(62vh,440px)] overflow-y-auto p-3 space-y-1">
            {visibleItems.length === 0 ? <p className="py-8 text-center text-xs text-slate-400">All notifications are read.</p> : visibleItems.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} type="button" onClick={() => openNotification(item)} className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer ${item.unread ? "bg-sky-50/70 hover:bg-sky-50" : "hover:bg-slate-50"}`}>
                <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${item.tone}`}><Icon size={16} /></span>
                <span className="min-w-0 flex-1"><span className={`block text-xs ${item.unread ? "font-extrabold text-slate-900" : "font-bold text-slate-700"}`}>{item.title}</span><span className="block text-[11px] text-slate-500 truncate mt-0.5">{item.message}</span><span className="block text-[10px] text-slate-400 mt-1">{item.time}</span></span>
                {item.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </button>;
            })}
          </div>
        </div>
      )}

      {selected && <div className="fixed inset-0 z-[60] bg-slate-950/35 backdrop-blur-[1px] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100"><div className="flex items-center gap-3"><span className={`w-10 h-10 rounded-full flex items-center justify-center ${selected.tone}`}><selected.icon size={18} /></span><div><h2 className="text-sm font-extrabold text-slate-900">{selected.title}</h2><p className="text-[11px] text-slate-400">{selected.date}</p></div></div><button type="button" onClick={() => setSelected(null)} aria-label="Close" className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"><X size={15} /></button></div>
          <div className="p-5 space-y-4"><p className="text-sm leading-relaxed text-slate-700">{selected.message}</p>{selected.person && <div className="rounded-xl bg-slate-50 border border-slate-200 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{role === "patient" ? "Doctor" : "Patient"}</p><p className="text-sm font-extrabold text-slate-900 mt-1">{selected.person}</p></div>}{selected.preview && <div className="h-28 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1"><Image size={22} /><span className="text-[11px] font-semibold">Document preview</span></div>}<div className="flex items-center justify-between gap-3 pt-1"><span className="text-[11px] text-slate-400">Received {selected.date}</span><button type="button" onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-extrabold text-white hover:opacity-90 cursor-pointer"><Check size={14} />{selected.action || "Close"}</button></div></div>
        </div>
      </div>}
    </div>
  );
};

export default NotificationCenter;
