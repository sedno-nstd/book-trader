import { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div
      className={`flex flex-col w-full gap-2 h-full select-none ${className}`}
    >
      {label && (
        <label className="font-semibold text-lg text-black">{label}</label>
      )}
      <input
        type="text"
        className={`border text-gray-700 border-gray-400 w-full rounded-sm p-3 h-full
        focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/30
        hover:border-blue-600 ${error ? "border-red-500" : ""}`}
        {...props}
      />
      {error && (
        <span className="text-sm font-medium text-red-600">{error}</span>
      )}
    </div>
  );
};
