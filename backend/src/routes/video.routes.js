import express from "express";
import Video from "../models/Video.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import multer from "multer";
import { uploadVideoToCloudinary } from "../services/cloudinary.service.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ===============================
   UPDATE video
================================ */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { title, videoUrl } = req.body;

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.title = title ?? video.title;
    video.videoUrl = videoUrl ?? video.videoUrl;

    await video.save();

    res.json({ ok: true });
  })
);

/* ===============================
   DELETE video
================================ */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({ ok: true });
  })
);

/* ===============================
   CREATE video
================================ */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { courseId, title, videoUrl } = req.body;

    // حساب الترتيب التالي
    const existingCount = await Video.countDocuments({ courseId });
    const nextOrder = existingCount + 1;

    await Video.create({
      courseId,
      title,
      videoUrl,
      order: nextOrder,
      createdAt: new Date(),
    });

    res.json({ ok: true });
  })
);

/* ===============================
   GET videos by course
================================ */
router.get(
  "/:courseId",
  asyncHandler(async (req, res) => {
    const videos = await Video.find({
      courseId: req.params.courseId,
    }).sort({ order: 1 });

    res.json(videos);
  })
);

/* ===============================
   UPLOAD video
================================ */
router.post(
  "/upload",
  upload.single("video"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No video file provided" });
    }

    const result = await uploadVideoToCloudinary(req.file.buffer);

    res.json({ url: result.secure_url });
  })
);

export default router;
