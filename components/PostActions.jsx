"use client";

import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useUser } from "@/context/UserContext";
import { BsHeart, BsChat, BsBarChartLineFill } from "react-icons/bs";
import { FiSend } from "react-icons/fi";

export default function PostActions({ post }) {
  const { requireAuth, open, setOpen } = useRequireAuth();
  const { user } = useUser();

  // from the Post
  const postId = post._id;
  const userId = user?.id;

  const [likesCount, setLikesCount] = useState(post.reactions?.likes || 0);
  const [likedBy, setLikedBy] = useState(post.reactions?.likedBy || []);
  const [comments, setComments] = useState(post.reactions?.comments || []);

  const [liked, setLiked] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [showComment, setShowComment] = useState(false);

  // Checking if the post liked
  // =============================

  useEffect(() => {
    if (!userId) return setLiked(false);
    setLiked(likedBy.includes(userId));
  }, [userId, likedBy]);

  // Work with likes
  // =============================

  const handleLike = () =>
    requireAuth(async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) {
          console.error(await res.text());
          return;
        }

        const data = await res.json();

        setLikesCount(data.likes);
        setLiked(data.liked);
        setLikedBy(data.likedBy);
      } catch (err) {
        console.error("Like error:", err);
      }
    });

  // Work with comments
  // =============================

  const handleCommentSubmit = () =>
    requireAuth(async () => {
      if (!commentText.trim()) return;

      try {
        const res = await fetch(`/api/posts/${postId}/comment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: commentText, userId }),
        });

        if (!res.ok) {
          console.error("Comment error:", await res.text());
          return;
        }

        const data = await res.json();

        setComments(data.comments);
        setCommentText("");
      } catch (err) {
        console.error("Comment error:", err);
      }
    });

  return (
    <>
      <div className="flex gap-3 mt-3 items-center">
        <button
          onClick={() => requireAuth(() => setShowComment(!showComment))}
          className="flex items-center px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          <BsChat className="mr-1" />
        </button>

        <button
          onClick={handleLike}
          className={`flex items-center px-3 py-1 rounded hover:bg-red-100 transition ${
            liked ? "text-red-500" : ""
          }`}
        >
          <BsHeart className="mr-1" />
          <span>{likesCount}</span>
        </button>

        <div className="flex items-center px-3 py-1 gap-1">
          <BsBarChartLineFill />
          <span>{post.views || 0}</span>
        </div>
      </div>

      {showComment && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Write your comment..."
            className="border p-2 rounded flex-1"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            onClick={handleCommentSubmit}
            className="px-3 py-2 bg-blue-500 text-white rounded"
          >
            <FiSend />
          </button>
        </div>
      )}

      {comments.length > 0 && (
        <ul className="mt-2 space-y-1">
          {comments.map((c, index) => (
            <li
              key={c._id || index}
              className="border-l-2 border-gray-300 pl-3 py-1"
            >
              <strong className="text-gray-700">
                {c.user?.nickname || "User"}:
              </strong>{" "}
              <span className="text-gray-600">{c.text}</span>
            </li>
          ))}
        </ul>
      )}

      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
