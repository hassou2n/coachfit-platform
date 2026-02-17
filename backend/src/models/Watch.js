import mongoose from "mongoose";

const watchSchema = new mongoose.Schema({
  code: String,
  videoId: String,
  watchedAt: String,
});

export default mongoose.model("Watch", watchSchema);
