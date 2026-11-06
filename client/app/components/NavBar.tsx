"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function Navbar() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="w-full bg-[#faf9f6] border-b border-[#e8e5df]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/books"
          className="font-bold text-xl tracking-tight text-[#292d28] hover:text-[#55745a] transition-colors"
        >
          book-trader
        </Link>

        <div className="flex items-center gap-6">
          {token && user ? (
            <>
              <Link
                href="/books/create"
                className="text-sm font-medium text-[#faf9f6] bg-[#55745a] hover:bg-[#46624b] px-4 py-2 rounded-md transition-colors"
              >
                Add Book
              </Link>

              <Link
                href="/me/books"
                className="text-sm font-medium text-[#454a43] hover:text-[#55745a] transition-colors"
              >
                My Books
              </Link>

              <div className="flex items-center gap-3 pl-5 border-l border-[#e8e5df]">
                <div className="w-8 h-8 rounded-full bg-[#e5e9df] text-[#4c634d] font-semibold flex items-center justify-center text-sm select-none">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-[#8a5149] hover:text-red-500 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                href="/login"
                className="text-sm font-medium text-[#454a43] hover:text-[#55745a] transition-colors"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="text-sm font-medium text-[#faf9f6] bg-[#55745a] hover:bg-[#46624b] px-4 py-2 rounded-md transition-colors"
              >
                Registration
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
