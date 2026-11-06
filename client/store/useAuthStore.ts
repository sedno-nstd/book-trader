import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  avatar?: string | null;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: "auth-storage" },
  ),
);
