import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="mb-4 md:mb-6">
      <p
        className="text-[12.5px] md:text-[14px] mb-2 md:mb-3 font-bold"
        style={{ color: "var(--ink-soft)" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
};
