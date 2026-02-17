import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  courseId: String,
  title: String,
  videoUrl: String,
  order: Number,
  createdAt: String,
});

export default mongoose.model("Video", videoSchema);
