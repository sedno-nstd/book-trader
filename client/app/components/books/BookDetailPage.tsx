"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Book } from "@/app/types/book";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/app/components/ui/Button";

export function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    const getBook = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/books/${id}`);
        if (!res.ok) throw new Error("Failed to load book");

        const data = await res.json();
        setBook(data);
      } catch (err: any) {
        console.error(err);
        setStatus({ type: "error", text: "Failed to load book details" });
      } finally {
        setIsLoading(false);
      }
    };

    getBook();
  }, [id]);

  const handleSendRequest = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}/trade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send trade request");
      }

      setStatus({
        type: "success",
        text: `Trade request successfully sent to ${data.ownerEmail || "the owner"}!`,
      });
    } catch (err: any) {
      console.error(err);
      setStatus({
        type: "error",
        text: err.message || "Something went wrong",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-16 text-[#777b73] font-medium">
        Loading book details...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="w-full text-center py-16">
        <h2 className="text-xl font-bold text-[#292d28] mb-4">
          Book not found
        </h2>
        <Link
          href="/books"
          className="text-sm font-semibold text-[#55745a] hover:underline"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === book.ownerId;
  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <Link
        href="/books"
        className="text-sm font-medium text-[#777b73] hover:text-[#508658] transition-colors inline-block w-fit"
      >
        Back to Catalog
      </Link>

      {status && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            status.type === "success"
              ? "bg-[#edf0e9] border border-[#d8ddd3] text-[#4c634d]"
              : "bg-[#f8eeeb] border border-[#ead5ce] text-[#96594e]"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="w-full bg-[#faf9f6] border border-[#e8e5df] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 shadow-sm">
        <div className="w-full md:w-80 h-96 bg-slate-100 rounded-xl overflow-hidden border border-[#e8e5df] flex-shrink-0">
          <img
            src={book.photo || "/no-avatar.jpg"}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292d28] leading-tight">
                {book.title}
              </h1>
              <p className="text-lg text-[#55745a] font-semibold mt-1">
                Author:{" "}
                <span className="text-[#292d28] font-normal">
                  {book.author}
                </span>
              </p>
            </div>

            <div className="text-sm font-semibold text-[#777b73]">
              Created at:{" "}
              <span className="font-medium text-[#454a43]">
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#e8e5df]">
            {isOwner ? (
              <div className="w-full text-center py-3 px-4 rounded-xl text-sm font-semibold text-[#55745a] bg-[#edf0e9] border border-[#d8ddd3]">
                This is your book
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={handleSendRequest}
                disabled={isSending}
                className="w-full py-3 rounded-lg"
              >
                {isSending ? "Sending Request..." : "Request Trade"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
