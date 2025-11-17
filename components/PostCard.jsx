"use client";
import Link from "next/link";
import { useState } from "react";
import { BsHeart } from "react-icons/bs";
import { BsHeartbreak } from "react-icons/bs";
import { BsChat } from "react-icons/bs";
import { BsBarChartLineFill } from "react-icons/bs";

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.reactions.likes);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();

    const newLikes = likes + 1;
    setLikes(newLikes);

    try {
      setLoading(true);
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: newLikes }),
      });

      if (!res.ok) {
        throw new Error("Failed to update likes");
      }
    } catch (err) {
      console.error(err);
      setLikes((prev) => prev - 1); // откат при ошибке
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-card p-4 border-[0.5] border-gray-600 shadow-sm mb-4">
      <Link
        key={post.id}
        href={`/post/${post._id}`}
        className="block p-4 hover:bg-gray-950"
      >
        <h3 className="font-bold text-lg">{post.title}</h3>
        <p className="text-gray-700">{post.content || post.body}</p>
      </Link>
      <p className="text-sm text-gray-500 mt-2 ml-4 flex items-center gap-6">
        <button className="flex items-center gap-1">
          {" "}
          <BsChat />
        </button>
        <span className="flex items-center gap-1">
          {" "}
          <BsBarChartLineFill /> {post.views}
        </span>
        <button className="flex items-center gap-1" onClick={handleLike}>
          <BsHeart /> {likes}
        </button>
        <button className="flex items-center gap-1">
          <BsHeartbreak /> {post.reactions.dislikes}
        </button>
      </p>
      <div className="flex gap-1.5 m-2">
        {(post.tags || []).map((tag) => (
          <Link
            key={tag}
            href="/"
            className="block p-2 bg-black-900/50 rounded"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
