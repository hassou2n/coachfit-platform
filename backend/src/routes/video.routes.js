import express from "express";
import { videosDB } from "../config/couch.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

import { v4 as uuid } from "uuid";
import multer from "multer";
import { uploadVideoToCloudinary } from "../services/cloudinary.service.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ===============================
   UPDATE video  (⬅️ أولًا)
================================ */
router.put("/:id", asyncHandler(async (req, res) => {
  try {
    const { title, videoUrl } = req.body;
    const doc = await videosDB.get(req.params.id);

    await videosDB.insert({
      ...doc,
      title,
      videoUrl
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(404).json({ message: "Video not found" });
  }
}));

/* ===============================
   DELETE video  (⬅️ ثانيًا)
================================ */
router.delete("/:id", asyncHandler(async (req, res) => {
  try {
    const doc = await videosDB.get(req.params.id);
    await videosDB.destroy(doc._id, doc._rev);
    res.json({ ok: true });
  } catch {
    res.status(404).json({ message: "Video not found" });
  }
}));

/* ===============================
   CREATE video
================================ */
router.post("/", asyncHandler(async (req, res) => {
  const { courseId, title, videoUrl } = req.body;

  const existing = await videosDB.find({
    selector: { courseId }
  });

  const nextOrder = existing.docs.length + 1;

  await videosDB.insert({
    _id: uuid(),
    courseId,
    title,
    videoUrl,
    order: nextOrder,
    createdAt: new Date().toISOString()
  });

  res.json({ ok: true });
}));

/* ===============================
   GET videos by course (⬅️ آخرًا)
================================ */
router.get("/:courseId", asyncHandler(async (req, res) => {
  const result = await videosDB.find({
    selector: { courseId: req.params.courseId }
  });

  res.json(result.docs.sort((a, b) => a.order - b.order));
}));

/* ===============================
   UPLOAD video
================================ */
router.post(
  "/upload",
  upload.single("video"),
asyncHandler(async (req, res)=> {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file provided" });
      }

      const result = await uploadVideoToCloudinary(req.file.buffer);

      res.json({ url: result.secure_url });

    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
));



export default router;
