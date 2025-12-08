import { connectDB } from "@/lib/mongoose";
import Post from "@/models/posts";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { BsHeart } from "react-icons/bs";
import { BsHeartbreak } from "react-icons/bs";
import { BsChat } from "react-icons/bs";
import { BsBarChartLineFill } from "react-icons/bs";

export default async function PostPage({ params }) {
  // Connect to DB
  await connectDB();

  const post = await Post.findById(params.id).lean(); // lean() to make plain JS object

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        href="/"
        className="flex items-center justify-center w-9 h-9 bg-blue-500/1 rounded-full hover:bg-blue-500/60 text-2xl "
      >
        <FiArrowLeft className="w-6 h-6" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700">{post.body || post.content}</p>
      <p className="text-sm text-gray-500 mt-2 flex items-center gap-4">
        <BsChat />
        <span className="flex items-center gap-1">
          <BsBarChartLineFill />
          {post.views}
        </span>
        <span className="flex items-center gap-1">
          {post.reactions.likes}
          <BsHeart />
        </span>
        <span className="flex items-center gap-1">
          {post.reactions.dislikes}
          <BsHeartbreak />
        </span>
      </p>
    </div>
  );
}
