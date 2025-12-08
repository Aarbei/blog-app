"use client";
import { useState } from "react";

export default function PostForm() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const submitTweet = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content!");
      return;
    }

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          author: "Aliona",
          tags: tagsArray,
        }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setTags("");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="p-4 border border-gray-600 rounded shadow-sm">
      <input
        className="w-full border border-gray-500 p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        className="w-full border border-gray-500 p-2 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
      />
      <input
        className="w-full border border-gray-500 p-2 rounded"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />
      <button
        onClick={submitTweet}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Post
      </button>
    </div>
  );
}
