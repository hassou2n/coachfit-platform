import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    code: String,
    subscriberName: String,
    expiresInDays: Number,
    extraDays: { type: Number, default: 0 },
    allowedCourses: [String],
    nutritionPlan: Object,
    used: { type: Boolean, default: false },
    activatedAt: String,
  },
  { timestamps: true }
);

export default mongoose.model("Code", codeSchema);
