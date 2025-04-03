import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
