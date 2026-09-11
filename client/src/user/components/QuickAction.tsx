import React from "react";
import type { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon: Icon,
  label,
  onClick,
  danger,
}) => {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl md:rounded-3xl py-4 md:py-6 flex flex-col items-center gap-2 md:gap-3 tap-target transition-all hover:shadow-md cursor-pointer"
      style={{
        background: danger ? "#FAEAEA" : "var(--surface)",
        border: "1px solid " + (danger ? "#F0D3D3" : "var(--border)"),
      }}
    >
      <Icon size={19} color={danger ? "#C23B3B" : "var(--primary)"} className="md:w-6 md:h-6" />
      <span
        className="text-[12px] md:text-[14px]"
        style={{ color: danger ? "#C23B3B" : "var(--ink)", fontWeight: 600 }}
      >
        {label}
      </span>
    </button>
  );
};
