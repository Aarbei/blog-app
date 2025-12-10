import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";
import mongoose from "mongoose";

export async function GET(req, context) {
  await connectDB();

  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid post ID" }, { status: 400 });
  }

  const post = await Post.findById(id)
    .populate({
      path: "reactions.likedBy",
      select: "nickname",
      match: { _id: { $type: "objectId" } },
    })
    .populate({
      path: "reactions.comments.user",
      select: "nickname",
      match: { _id: { $type: "objectId" } },
    });

  console.log("AUTHOR:", post?.author);

  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  // Фильтруем пустые комментарии
  if (post.reactions && Array.isArray(post.reactions.comments)) {
    post.reactions.comments = post.reactions.comments.filter(
      (comment) => comment && comment.text && comment.text.trim()
    );
  }

  return Response.json(post, { status: 200 });
}
