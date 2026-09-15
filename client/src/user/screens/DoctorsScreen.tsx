import React, { useState, useEffect } from "react";
import { Star, MapPin, Clock, Loader2, UserX } from "lucide-react";
import { TopBar } from "../components/TopBar";
import type { DoctorDirectoryItem } from "../types";
import { getApiUrl } from "../../config/api";

interface DoctorsScreenProps {
  onBack: () => void;
  onBook: (doctor: DoctorDirectoryItem) => void;
}

export const DoctorsScreen: React.FC<DoctorsScreenProps> = ({ onBack, onBook }) => {
  const [doctors, setDoctors] = useState<DoctorDirectoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl("/api/doctors"));
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            const mapped: DoctorDirectoryItem[] = data.map((d: any, idx: number) => ({
              id: idx + 1,
              name: d.name || "Doctor",
              spec: d.specialty || d.department || "Consultant Physician",
              hospital: d.hospital || "MediKiosk Apex Center",
              km: "1.2",
              rating: d.rating || 4.9,
              next: d.room ? `${d.room} · Today` : "Available Today",
            }));
            setDoctors(mapped);
          }
        }
      } catch (err) {
        console.warn("[DoctorsScreen] Could not fetch doctors from database:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDoctors();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: "var(--bg)" }}>
      <TopBar title="Available OPD Doctors & Specialists" onBack={onBack} />
      <div className="flex gap-2 px-5 md:px-10 pb-3 md:pb-6 overflow-x-auto no-scrollbar">
        {["Within 5 km", "Available today", "Highest rated"].map((f) => (
          <span
            key={f}
            className="shrink-0 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[12px] md:text-[14px] shadow-sm font-semibold"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--ink-soft)",
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-bold text-slate-700">Loading Doctors from Database...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <UserX className="w-10 h-10 text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-700">No doctors found in database.</p>
          <p className="text-xs text-slate-400 mt-1">Please ensure doctors are registered in the system.</p>
        </div>
      ) : (
        <div className="px-5 md:px-10 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {doctors.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-5">
                <div
                  className="rounded-full flex items-center justify-center shrink-0 md:w-14 md:h-14 font-black"
                  style={{ width: 46, height: 46, background: "var(--primary-tint)", color: "var(--primary)" }}
                >
                  {d.name.split(" ").slice(-1)[0][0]}
                  {d.name.split(" ")[1] ? d.name.split(" ")[1][0] : ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14.5px] md:text-[17px] font-bold text-slate-900 truncate">{d.name}</p>
                  <p className="text-[12px] md:text-[14px] text-slate-500">
                    {d.spec} · {d.hospital}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 md:gap-1 shrink-0 bg-orange-50 px-2 py-1 rounded-full">
                  <Star size={12} color="#C4622E" fill="#C4622E" className="md:w-3.5 md:h-3.5" />
                  <span className="text-[12px] md:text-[13px] font-bold text-slate-800">{d.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 text-[12px] md:text-[13.5px] text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  <MapPin size={13} /> {d.km} km
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  <Clock size={13} /> {d.next}
                </span>
              </div>
              <button
                onClick={() => onBook(d)}
                className="w-full rounded-full py-2.5 md:py-3.5 hover:bg-[#cde4e1] transition-colors cursor-pointer"
                style={{ background: "var(--primary-tint)" }}
              >
                <span className="text-[13px] md:text-[15px] font-bold" style={{ color: "var(--primary)" }}>
                  Book appointment
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
