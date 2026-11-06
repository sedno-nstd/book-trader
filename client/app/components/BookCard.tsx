import { useAuthStore } from "@/store/useAuthStore";
import { Book } from "../types/book";
import Link from "next/link";
import Image from "next/image";

interface BookCardProps {
  book: Book;
  onDelete: (id: number) => void;
}

export function BookCard({ book, onDelete }: BookCardProps) {
  const { user } = useAuthStore();
  const isOwner = user && (user?.id === book.ownerId || user?.role === "ADMIN");

  return (
    <div className="w-full rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row h-auto sm:h-48">
      <div className="relative w-full sm:w-40 h-48 sm:h-full bg-slate-100 flex-shrink-0">
        <Image
          src={book.photo || "/no-avatar.jpg"}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 160px"
          unoptimized
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-1">
            {book.title}
          </h3>
          <p className="text-slate-500 text-sm font-medium">{book.author}</p>
        </div>

        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 flex justify-between items-center">
          <span>
            Owner: {""}
            <strong className="text-slate-600">
              {book.owner?.name || "Unknown"}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/books/${book.id}`}
            className="flex-1 text-center py-2 px-3 text-sm font-medium text-white bg-[#55745a] rounded-md hover:bg-[#46624b] transition-colors"
          >
            Details
          </Link>

          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(book.id)}
              className="py-2 px-3 text-sm font-medium text-[#96594e] border border-[#ead5ce] rounded-md hover:bg-[#f8eeeb] hover:border-[#d9b8ae] transition-colors cursor-pointer"
              title="Delete book"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
