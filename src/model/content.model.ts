import mongoose from "mongoose";

const contentType = ["image", "video", "text", "article", "audio"];

const contentSchema = new mongoose.Schema(
  {
    link: { type: String, required: true },
    type: { type: String, enum: contentType, required: true },
    title: { type: String, required: true },
    tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Content = mongoose.model("Content", contentSchema);
export default Content;
