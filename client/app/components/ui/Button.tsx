import { FC, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLElement> {
  variant: ButtonVariant;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 hover:text-gray-100",
  secondary:
    "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400",
};

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`w-full h-full transition-colors cursor-pointer py-3 px-2  font-medium ${disabled} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? "Loading..." : `${children}`}{" "}
    </button>
  );
};
