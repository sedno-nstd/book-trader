"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreateBookForm } from "@/app/components/books/CreateBookForm";
import { useAuthStore } from "@/store/useAuthStore";

export default function CreateBookPage() {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const handleBookCreated = () => {
    router.push("/me/books");
  };

  if (!token) return null;

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      <Link
        href="/me/books"
        className="text-sm font-semibold text-slate-500 hover:text-blue-600 mb-6 inline-block"
      >
        Back to My Books
      </Link>

      <CreateBookForm onBookAdded={handleBookCreated} />
    </div>
  );
}
