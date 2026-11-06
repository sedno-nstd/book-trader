import Link from "next/link";
import { FormEvent, ReactNode } from "react";

interface FormWrapperProps {
  className?: string;
  title: string;
  children: ReactNode;
  onSubmit: (e: FormEvent) => void;
  footerLink: {
    text: string;
    href: string;
    linkText: string;
  };
}

export function FormWrapper({
  className,
  onSubmit,
  title,
  footerLink,
  children,
}: FormWrapperProps) {
  return (
    <div
      className={`flex flex-col w-full max-w-md mx-auto justify-center items-center p-6 bg-white rounded-lg shadow-sm border border-slate-100 ${className}`}
    >
      <h1 className="text-2xl font-bold mb-6 text-slate-800">{title}</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
        {children}
      </form>
      <div className="mt-4 text-center text-sm text-slate-600">
        {footerLink.text}
        <Link
          href={footerLink.href}
          className="text-indigo-600 hover:underline font-semibold"
        >
          {footerLink.linkText}
        </Link>
      </div>
    </div>
  );
}
