"use client";

import Link from "next/link";
import { useState } from "react";
import PostActions from "@/components/PostActions";

export default function PostCard({ post }) {
  return (
    <div className="post-card p-4 border-[0.5] border-gray-600 shadow-sm mb-4">
      <Link href={`/post/${post._id}`} className="block p-4 hover:bg-gray-950">
        <h3 className="font-bold text-lg">{post.title}</h3>

        {/* Автор */}
        <p className="text-sm text-gray-400 mb-2">
          By {post.author || "Unknown"}
        </p>

        <p className="text-gray-700">{post.content || post.body}</p>
      </Link>

      {/* ПЕРЕДАЕМ ВЕСЬ ПОСТ */}
      <PostActions post={post} />

      {/* Теги */}
      <div className="flex gap-1.5 mt-3 flex-wrap">
        {(post.tags || []).map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tag}`}
            className="px-2 py-1 bg-black/30 rounded text-sm"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
