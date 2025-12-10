"use client";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setUser(null); // clear user context
        setMenuOpen(false);
        router.push("/login"); // rodirect to login page
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-black text-white p-4 shadow-md">
      <nav className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/twitter_logo.png" className="w-6 mb-0.5" alt="logo" />
          <h1 className="text-xl font-bold">
            <Link href="/">Postly</Link>
          </h1>
        </div>

        <ul className="flex space-x-6 items-center">
          <li>
            <Link href="/" className="hover:text-gray-300 transition">
              Blog
            </Link>
          </li>

          <li>
            {user ? (
              <div className="relative">
                <button
                  className="hover:text-gray-300 transition"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {user.nickname}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-50">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hover:text-gray-300 transition">
                My Profile
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
