"use client";
import { LoginForm } from "../components/auth/LoginForm";
import { useGuestGuard } from "../hooks/useGuestGuard";

export default function Page() {
  const { isChecking } = useGuestGuard();

  if (isChecking) return null;

  return <LoginForm />;
}
