"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    if (user) {
      router.replace("/books");
    } else {
      router.replace("/register");
    }
  }, [user, isClient, router]);

  return (
    <div className="flex h-full">
      <p className="text-slate-500 font-medium">Redirecting...</p>
    </div>
  );
}
