"use client";

import Link from "next/link";

export default function AuthModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-gray-900 p-6 rounded-lg w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Log in</h2>
        <p className="text-gray-600 mb-4">
          To be able to interract with posts, you need to log in
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>

          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
