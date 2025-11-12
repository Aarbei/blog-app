"use client";
import Link from "next/link";
import { useState } from "react";
import { BsHeart } from "react-icons/bs";
import { BsHeartbreak } from "react-icons/bs";
import { BsChat } from "react-icons/bs";
import { BsBarChartLineFill } from "react-icons/bs";

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.reactions.likes);

  const handleLike = async (e) => {
    e.stopPropagation(); // чтобы клик не шел на внешний Link
    setLikes(likes + 1);
  };

  return (
    <div className="post-card p-4 border-[0.5] border-gray-600 shadow-sm mb-4">
      <Link
        key={post.id}
        href={`/post/${post.id}`}
        className="block p-4 hover:bg-gray-950"
      >
        <h3 className="font-bold text-lg">{post.title}</h3>
        <p className="text-gray-700">{post.body}</p>
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
        {post.tags.map((tag) => (
          <Link className=" block p-2 bg-black-900/50" key={tag} href="/">
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
