import express from "express";
import Course from "../models/Course.js";
import Code from "../models/Code.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

const router = express.Router();

/* =========================
   COURSES (PUBLIC)
========================= */
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  })
);

/* =========================
   ACTIVATE CODE
========================= */
router.post(
  "/activate",
  asyncHandler(async (req, res) => {
    const { code } = req.body;

    const doc = await Code.findOne({ code });

    if (!doc) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // ❌ لا نمنع التفعيل بسبب used
    doc.used = true;

    if (!doc.activatedAt) {
      doc.activatedAt = new Date();
    }

    await doc.save();

    res.json({
      code: doc.code,
      subscriberName: doc.subscriberName,
      courses: doc.allowedCourses || [],
      nutritionPlan: doc.nutritionPlan || null,
    });
  })
);

/* =========================
   CHECK SUBSCRIPTION (🔥 الأهم)
========================= */
router.post(
  "/check-subscription",
  asyncHandler(async (req, res) => {
    const { code } = req.body;

    const doc = await Code.findOne({ code });

    // الكود محذوف
    if (!doc) {
      return res.json({ valid: false });
    }

    // حساب الانتهاء الحقيقي
    const startDate = new Date(doc.createdAt);
    const totalDays =
      Number(doc.expiresInDays || 0) +
      Number(doc.extraDays || 0);

    startDate.setDate(startDate.getDate() + totalDays);

    if (startDate < new Date()) {
      return res.json({ valid: false });
    }

    res.json({
      valid: true,
      subscription: {
        code: doc.code,
        subscriberName: doc.subscriberName,
        courses: doc.allowedCourses || [],
        nutritionPlan: doc.nutritionPlan || null,
      },
    });
  })
);

export default router;
