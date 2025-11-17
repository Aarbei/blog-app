import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();
    console.log("POST body received:", body);

    //Ensure all fields are properly formatted
    const newPost = await Post.create({
      title: body.title,
      content: body.body || body.content || "", // because we have different names for content
      author: body.author || "Anonymous",
      tags: Array.isArray(body.tags) ? body.tags : [], //if we have not leave empty
      reactions: {
        likes: 0,
        dislikes: 0,
        comments: 0,
        views: 0,
      },
    });

    return NextResponse.json(newPost.toObject(), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    let posts = await Post.find().sort({ createdAt: -1 });

    // If DB is empty — import from DummyJSON API
    if (posts.length === 0) {
      console.log("No posts found, importing from DummyJSON...");
      const response = await fetch("https://dummyjson.com/posts");
      const data = await response.json();

      if (Array.isArray(data.posts)) {
        const importedPosts = data.posts.map((p) => ({
          title: p.title,
          content: p.body, // body в DummyJSON
          author: "DummyJSON",
          tags: Array.isArray(p.tags) ? p.tags : [],
          reactions: {
            likes: p.reactions?.likes || 0,
            dislikes: p.reactions?.dislikes || 0,
            comments: 0,
          },
          views: p.views || 0,
        }));

        await Post.insertMany(importedPosts);
        console.log(`Imported ${importedPosts.length} posts from DummyJSON.`);
      }

      posts = await Post.find().sort({ createdAt: -1 }); // refresh list
    }

    return NextResponse.json(posts.map((p) => p.toObject()));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PATCH(req, { params }) {
  try {
    await connectDB();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
