import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req, context) {
  try {
    await connectDB();

    // --- получаем id из params ---
    const { id } = await context.params;

    const { text, userId } = await req.json();

    // --- валидация ---
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid post ID" }, { status: 400 });
    }

    if (!text || !text.trim()) {
      return Response.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // --- получаем пост ---
    const post = await Post.findById(id);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    // --- нормализация reactions ---
    if (!post.reactions) post.reactions = {};
    if (!Array.isArray(post.reactions.comments)) {
      post.reactions.comments = [];
    }

    // --- создаем новый комментарий ---
    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(userId),
      text: text.trim(),
      createdAt: new Date(),
    };

    post.reactions.comments.push(newComment);

    // --- обновляем пост через findByIdAndUpdate ---
    await Post.findByIdAndUpdate(
      id,
      {
        "reactions.comments": post.reactions.comments,
      },
      { new: true, runValidators: false }
    );

    // --- переполучаем пост с заполненными данными пользователя ---
    const populatedPost = await Post.findById(id).populate({
      path: "reactions.comments.user",
      select: "nickname",
    });

    return Response.json({
      comments: populatedPost.reactions.comments || [],
    });
  } catch (error) {
    console.error("Comment error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
