import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },

    reactions: {
      likes: { type: Number, default: 0 },
      likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      dislikes: { type: Number, default: 0 },
      comments: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          text: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
    views: { type: Number, default: 0 },
  },

  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
