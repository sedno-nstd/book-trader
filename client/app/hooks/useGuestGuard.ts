"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const subscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function useGuestGuard() {
  const { token } = useAuthStore();
  const router = useRouter();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted && token) {
      router.replace("/books");
    }
  }, [isMounted, token, router]);

  return {
    isChecking: !isMounted || Boolean(token),
  };
}
