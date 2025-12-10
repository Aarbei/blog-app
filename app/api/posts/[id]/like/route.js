import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";
import mongoose from "mongoose";

export async function POST(req, context) {
  try {
    await connectDB();

    // --- корректный способ получить params ---
    const { id } = await context.params;

    const { userId } = await req.json();

    // --- валидация postId ---
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // --- валидация userId ---
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // --- нормализация данных ---
    if (!post.reactions) post.reactions = {};
    if (!Array.isArray(post.reactions.likedBy)) post.reactions.likedBy = [];
    if (
      typeof post.reactions.comments === "number" ||
      !Array.isArray(post.reactions.comments)
    ) {
      post.reactions.comments = [];
    }
    if (typeof post.reactions.likes !== "number") post.reactions.likes = 0;
    if (!post.reactions.dislikes) post.reactions.dislikes = 0;

    // --- нормализация userId для сравнения ---
    const userIdString = userId.toString();

    // --- toggle лайка ---
    const isLiked = post.reactions.likedBy.some(
      (u) => u.toString() === userIdString
    );

    let newLikesCount = post.reactions.likes;
    let newLikedBy = post.reactions.likedBy;

    if (isLiked) {
      newLikedBy = post.reactions.likedBy.filter(
        (u) => u.toString() !== userIdString
      );
      newLikesCount = Math.max(0, post.reactions.likes - 1);
    } else {
      newLikedBy = [
        ...post.reactions.likedBy,
        new mongoose.Types.ObjectId(userId),
      ];
      newLikesCount = post.reactions.likes + 1;
    }

    // --- обновляем через findByIdAndUpdate чтобы избежать проблем с валидацией ---
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        "reactions.likes": newLikesCount,
        "reactions.likedBy": newLikedBy,
        "reactions.dislikes": post.reactions.dislikes,
        "reactions.comments": post.reactions.comments,
      },
      { new: true, runValidators: false }
    );

    return Response.json({
      likes: newLikesCount,
      liked: !isLiked,
      likedBy: newLikedBy,
    });
  } catch (error) {
    console.error("Like error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
