import React from "react";

interface SummaryRowProps {
  label: string;
  value: string;
  warn?: boolean;
}

export const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, warn }) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[12.5px] md:text-[14px] shrink-0" style={{ color: "var(--ink-soft)" }}>
        {label}
      </span>
      <span
        className="text-[12.5px] md:text-[14px] text-right font-semibold"
        style={{ color: warn ? "#C23B3B" : "var(--ink)" }}
      >
        {value}
      </span>
    </div>
  );
};
