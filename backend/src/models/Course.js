import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: Object,
    shortDescription: Object,
    fullDescription: String,
    price: Number,
    contactLink: String,
    image: String,
    features: [String],
    learningPoints: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
