"use client";
import { useEffect, useState } from "react";

export default function PostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ul className="mt-4">
      {posts.map((post) => (
        <li key={post._id} className="border-b border-gray-300 py-2">
          <strong>{post.author}:</strong> {post.content}
        </li>
      ))}
    </ul>
  );
}
