"use client";
import { useEffect, useState } from "react";
import { Book } from "../types/book";
import { Input } from "../components/ui/Input";
import { BookList } from "../components/BookList";
import { useAuthStore } from "@/store/useAuthStore";

export default function Page() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const { token } = useAuthStore();

  useEffect(() => {
    const getBooks = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/books?search=${query}`,
        );

        if (!res.ok) throw new Error("Failed request");

        const data = await res.json();

        setBooks(data.books || []);
      } catch (err) {
        console.log(err);
      }
    };

    const timer = setTimeout(() => {
      getBooks();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-10">
      <div className="w-full flex justify-center items-center">
        <Input
          placeholder="search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-[400px]"
        />
      </div>
      <BookList books={books} onDelete={handleDelete} />
    </div>
  );
}
