"use client";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useGuestGuard } from "../hooks/useGuestGuard";

export default function Page() {
  const { isChecking } = useGuestGuard();

  if (isChecking) return null;

  return <RegisterForm />;
}
