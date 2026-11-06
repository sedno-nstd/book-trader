import { Book } from "../types/book";
import { BookCard } from "./BookCard";

interface BookListProps {
  books: Book[];
  onDelete: (id: number) => void;
}

export function BookList({ books, onDelete }: BookListProps) {
  if (!books || books.length === 0) {
    return (
      <div className="w-full text-center py-12 bg-white/60 rounded-xl border border-slate-200">
        <p className="text-slate-500 font-medium text-sm">No books found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {books.map((b) => (
        <BookCard key={b.id} book={b} onDelete={onDelete} />
      ))}
    </div>
  );
}
