import { BookDetailPage } from "@/app/components/books/BookDetailPage";
import { Suspense } from "react";

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full text-center py-16 text-[#777b73] font-medium">
          Loading book...
        </div>
      }
    >
      {" "}
      <BookDetailPage />
    </Suspense>
  );
}
