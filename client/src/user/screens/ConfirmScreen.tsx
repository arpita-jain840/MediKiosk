import React from "react";
import { CheckCircle2 } from "lucide-react";
import type { DoctorDirectoryItem } from "../types";

interface ConfirmScreenProps {
  doctor: DoctorDirectoryItem | null;
  onDone: () => void;
}

export const ConfirmScreen: React.FC<ConfirmScreenProps> = ({ doctor, onDone }) => {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 text-center"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="rounded-full flex items-center justify-center mb-5 md:mb-8 shadow-sm"
        style={{ width: 68, height: 68, background: "var(--primary-tint)" }}
      >
        <CheckCircle2 size={32} color="var(--primary)" className="md:w-10 md:h-10" />
      </div>
      <p className="text-[18px] md:text-[24px] font-extrabold text-slate-900 mb-1.5 md:mb-3">
        Appointment & Token Confirmed
      </p>
      <p className="text-[13.5px] md:text-[16px] mb-6 md:mb-10 text-slate-500 leading-relaxed">
        {doctor ? `${doctor.name} · ${doctor.next}` : "Dr. John Smith · Today, 11:30 AM"}
        <br />
        {doctor ? doctor.hospital : "City Care Hospital · Room 4B"}
      </p>
      <button
        onClick={onDone}
        className="w-full md:w-auto md:px-12 rounded-full py-3.5 md:py-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        style={{ background: "var(--primary)" }}
      >
        <span className="text-[14px] md:text-[16px] font-bold text-white">Back to Home</span>
      </button>
    </div>
  );
};
