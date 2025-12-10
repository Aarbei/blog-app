import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";

export async function POST(req) {
  try {
    await connectDB();

    // Найдем все посты с неправильной структурой reactions
    const posts = await Post.find();

    let fixedCount = 0;

    for (const post of posts) {
      let needsUpdate = false;

      if (!post.reactions) {
        post.reactions = {};
        needsUpdate = true;
      }

      // Проверяем и исправляем comments
      if (typeof post.reactions.comments === "number") {
        post.reactions.comments = [];
        needsUpdate = true;
        console.log(
          `Fixed post ${post._id}: comments was ${post.reactions.comments}, now is []`
        );
      }

      if (!Array.isArray(post.reactions.comments)) {
        post.reactions.comments = [];
        needsUpdate = true;
      } else {
        // Фильтруем пустые комментарии
        const validComments = post.reactions.comments.filter(
          (comment) => comment && comment.text && comment.text.trim()
        );
        if (validComments.length !== post.reactions.comments.length) {
          post.reactions.comments = validComments;
          needsUpdate = true;
          console.log(
            `Fixed post ${post._id}: removed ${
              post.reactions.comments.length - validComments.length
            } empty comments`
          );
        }
      }

      // Проверяем и исправляем likedBy
      if (!Array.isArray(post.reactions.likedBy)) {
        post.reactions.likedBy = [];
        needsUpdate = true;
      }

      // Проверяем и исправляем likes
      if (typeof post.reactions.likes !== "number") {
        post.reactions.likes = 0;
        needsUpdate = true;
      }

      if (needsUpdate) {
        // Явно переназначаем reactions
        post.set("reactions", {
          likes: post.reactions.likes || 0,
          likedBy: Array.isArray(post.reactions.likedBy)
            ? post.reactions.likedBy
            : [],
          dislikes: post.reactions.dislikes || 0,
          comments: Array.isArray(post.reactions.comments)
            ? post.reactions.comments
            : [],
        });

        await post.save();
        fixedCount++;
      }
    }

    return Response.json({
      message: `Fixed ${fixedCount} posts`,
      totalPosts: posts.length,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
