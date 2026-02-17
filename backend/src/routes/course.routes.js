import express from "express";
import Course from "../models/Course.js";
import Code from "../models/Code.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

const router = express.Router();

/* =========================
   COURSES (PUBLIC)
========================= */

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  })
);

/* =========================
   COURSES (ADMIN)
========================= */

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      title,
      shortDescription,
      fullDescription,
      image,
      features = [],
      learningPoints = [],
    } = req.body;

    const newCourse = await Course.create({
      title,
      shortDescription,
      fullDescription,
      image,
      features,
      learningPoints,
    });

    res.json({ ok: true, id: newCourse._id });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        fullDescription: req.body.fullDescription,
        image: req.body.image,
        features: req.body.features ?? [],
        learningPoints: req.body.learningPoints ?? [],
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ ok: true });
  })
);

/* =========================
   DELETE COURSE + CLEANUP 🔥
========================= */

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const courseId = req.params.id;

    // 1️⃣ حذف الكورس
    const deleted = await Course.findByIdAndDelete(courseId);

    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2️⃣ تنظيف الأكواد (إزالة الكورس من allowedCourses)
    const affectedCodes = await Code.find({
      allowedCourses: courseId,
    });

    for (const code of affectedCodes) {
      code.allowedCourses = code.allowedCourses.filter(
        (c) => c.toString() !== courseId
      );
      await code.save();
    }

    res.json({
      ok: true,
      cleanedFromCodes: affectedCodes.length,
    });
  })
);

export default router;
