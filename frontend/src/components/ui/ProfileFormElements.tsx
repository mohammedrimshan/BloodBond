import React from "react";

export const SectionHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#9b4a35]">
      {label}
    </span>
    <div className="flex-1 h-px bg-[#f0e8e4]" />
  </div>
);

export interface FieldProps {
  label: string;
  icon: React.ReactNode;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Field = ({ label, icon, error, optional, children, className = "" }: FieldProps) => (
  <div className={`space-y-1.5 ${className}`}>
    <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#9e7a6e]">
      <span className="text-[#b07060]">{icon}</span>
      {label}
      {optional && (
        <span className="ml-1 normal-case tracking-normal text-[9px] px-1.5 py-0.5 rounded-full bg-[#f5ece8] text-[#c09080]">
          optional
        </span>
      )}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs italic font-semibold">{error}</p>}
  </div>
);

export interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError: boolean;
}

export const StyledInput = ({ hasError, className = "", ...props }: StyledInputProps) => (
  <input
    {...props}
    className={`w-full h-12 rounded-xl px-4 text-sm border outline-none transition-all ${className} ${
      hasError ? 'border-red-500 text-red-600 focus:ring-red-100' : 'border-[#e5ddd8] focus:border-[#c0392b] focus:ring-red-50'
    }`}
    style={{
      background: "#fdf8f6",
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
    }}
  />
);
