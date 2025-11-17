"use client";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function PostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched posts:", data);
        // data должно быть массивом — если не массив, берем data.posts
        setPosts(Array.isArray(data) ? data : data.posts || []);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div className="mt-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
