import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default async function PostPage({ params }) {
  const res = await fetch(`https://dummyjson.com/posts/${params.id}`);
  const post = await res.json();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        href="/"
        className="flex items-center justify-center w-9 h-9 bg-blue-500/1 rounded-full hover:bg-blue-500/60 text-2xl "
      >
        <FiArrowLeft className="w-6 h-6" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700">{post.body}</p>
      <p className="text-sm text-gray-500 mt-2 flex items-center gap-4">
        <span>Views: {post.views}</span>
        <span>{post.reactions.likes} 👍</span>
        <span>{post.reactions.dislikes} 👎</span>
      </p>
    </div>
  );
}
