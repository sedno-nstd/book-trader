"use client";
import { FormEvent, useState } from "react";
import { FormWrapper } from "../ui/FormWrapper";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [error, setError] = useState<string | boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || password.trim() === "") {
      setError("Fill all fields");
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setAuth(data.token, data.user);
      router.push("/books");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper
      onSubmit={handleRegister}
      title="Log in"
      footerLink={{
        href: "/register",
        linkText: "Register",
        text: "Don't have an account? ",
      }}
    >
      {error && (
        <p className="text-red-600 font-medium text-sm text-center">{error}</p>
      )}
      <Input
        label="Emal"
        placeholder="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="password"
        placeholder="password"
        type="password"
        required
        value={password}
        onChange={(e) => SetPassword(e.target.value)}
      />
      <Button variant="primary" type="submit" isLoading={isLoading}>
        Log in
      </Button>
    </FormWrapper>
  );
}
