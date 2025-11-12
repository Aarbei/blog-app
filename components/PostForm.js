"use client";
import { useState } from "react";

export default function PostForm() {
  const [content, setContent] = useState("");

  const submitTweet = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, author: "Aliona" }),
      });

      if (res.ok) setContent("");
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="p-4 border border-gray-600 rounded shadow-sm">
      <textarea
        className="w-full border border-gray-500 p-2 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
      />
      <button
        onClick={submitTweet}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
      >
        Post
      </button>
    </div>
  );
}
