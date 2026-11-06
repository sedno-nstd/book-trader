"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Book } from "@/app/types/book";
import { BookList } from "@/app/components/BookList";
import { useAuthStore } from "@/store/useAuthStore";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export default function MyBooksPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const isMounted = useIsMounted();
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isMounted || !token || !user) return;

    let isCancelled = false;

    const fetchMyBooks = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/books?ownerId=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.books || [];

        if (!isCancelled) {
          setMyBooks(list);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to fetch books:", err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchMyBooks();

    return () => {
      isCancelled = true;
    };
  }, [isMounted, token, user]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMyBooks((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!isMounted || !token) return null;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#292d28]">My Books</h1>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Loading your books...</p>
      ) : (
        <BookList books={myBooks} onDelete={handleDelete} />
      )}
    </div>
  );
}
