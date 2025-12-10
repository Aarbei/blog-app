import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";

export async function GET(req) {
  try {
    await connectDB();

    // Найдем все посты и очистим все комментарии
    const result = await Post.updateMany(
      {},
      {
        $set: {
          "reactions.comments": [],
        },
      }
    );

    return Response.json({
      message: "All comments cleared",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Clear comments error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    // Найдем все посты и очистим все комментарии
    const result = await Post.updateMany(
      {},
      {
        $set: {
          "reactions.comments": [],
        },
      }
    );

    return Response.json({
      message: "All comments cleared",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Clear comments error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
