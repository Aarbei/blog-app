import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },

    reactions: {
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
    },
    views: { type: Number, default: 0 },
  },

  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
