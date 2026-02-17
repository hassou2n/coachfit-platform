import express from "express";
import Course from "../models/Course.js";
import Code from "../models/Code.js";

import { upload } from "../middlewares/upload.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

const router = express.Router();

/* =========================
   COURSES
========================= */

/* Create Course */
router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    const {
      title,
      shortDescription,
      fullDescription,
      price,
      contactLink,
      image,
      features = [],
      learningPoints = []
    } = req.body;

    const newCourse = await Course.create({
      title,
      shortDescription,
      fullDescription,
      price,
      contactLink,
      image,
      features,
      learningPoints
    });

    res.json({
      ok: true,
      id: newCourse._id
    });
  })
);



/* Update Course */
router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const {
      title,
      shortDescription,
      fullDescription,
      price,
      contactLink,
      image,
      features,
      learningPoints
    } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        title,
        shortDescription,
        fullDescription,
        price,
        contactLink,
        image,
        features,
        learningPoints
      },
      { new: true } // يرجع النسخة بعد التحديث
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      ok: true,
      course: updatedCourse
    });
  })
);




// 🔥 UPLOAD COURSE IMAGE (Cloudinary)
router.post(
  "/courses/upload-image",
  upload.single("image"),
  asyncHandler(async (req, res) =>  {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    res.json({
      url: req.file.path // Cloudinary URL
    });
  }
));


/* =========================
   ACTIVATION CODES
========================= */

/* Create Activation Code */
router.post(
  "/codes",
  asyncHandler(async (req, res) => {
    const newCode = await Code.create({
      code: req.body.code,
      subscriberName: req.body.subscriberName,
      expiresInDays: req.body.expiresInDays,
      extraDays: req.body.extraDays || 0,
      allowedCourses: req.body.allowedCourses || [],
      nutritionPlan: req.body.nutritionPlan || null,
      used: false,
    });

    res.json({
      ok: true,
      code: newCode.code,
      id: newCode._id,
    });
  })
);


/* UPDATE ACTIVATION CODE */
router.put(
  "/codes/:id",
  asyncHandler(async (req, res) => {
    const doc = await Code.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Code not found" });
    }

    // تحديث الكورسات
    doc.allowedCourses = Array.isArray(req.body.allowedCourses)
      ? req.body.allowedCourses
      : [];

    // تمديد الأيام (تراكمي)
    doc.extraDays =
      Number(doc.extraDays || 0) +
      Number(req.body.extraDays || 0);

    await doc.save();

    res.json({ ok: true });
  })
);


/* Get all activation codes */
router.get(
  "/codes",
  asyncHandler(async (req, res) => {
    const codes = await Code.find().sort({ createdAt: -1 });

    res.json(
      codes.map((doc) => ({
        _id: doc._id,
        code: doc.code,
        subscriberName: doc.subscriberName,
        used: doc.used,
        expiresInDays: doc.expiresInDays,
        extraDays: doc.extraDays || 0,
        allowedCourses: doc.allowedCourses || [],
        nutritionPlan: !!doc.nutritionPlan,
        createdAt: doc.createdAt,
      }))
    );
  })
);


/* Delete activation code */
router.delete(
  "/codes/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Code.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Code not found" });
    }

    res.json({ ok: true });
  })
);



router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {

    const courses = await Course.find();
    const codes = await Code.find();

    const now = new Date();

    /* =====================
       BASIC STATS
    ===================== */

    const totalPrograms = courses.length;
    const totalCodes = codes.length;

    const activeSubscriptions = codes.filter(code => {
      if (!code.activatedAt) return false;

      const startDate = new Date(code.activatedAt);
      const totalDays =
        Number(code.expiresInDays || 0) +
        Number(code.extraDays || 0);

      startDate.setDate(startDate.getDate() + totalDays);
      return startDate > now;
    }).length;

    const expiredSubscriptions =
      codes.filter(code => code.activatedAt).length -
      activeSubscriptions;

    /* =====================
       EXPIRING SOON (7 DAYS)
    ===================== */

    const expiringSoon = codes
      .filter(code => code.activatedAt)
      .map(code => {
        const startDate = new Date(code.activatedAt);
        const totalDays =
          Number(code.expiresInDays || 0) +
          Number(code.extraDays || 0);

        startDate.setDate(startDate.getDate() + totalDays);

        return {
          code: code.code,
          subscriberName: code.subscriberName,
          expiresAt: startDate
        };
      })
      .filter(item => {
        const diff = (item.expiresAt - now) / (1000 * 60 * 60 * 24);
        return diff > 0 && diff <= 7;
      })
      .map(item => ({
        code: item.code,
        subscriberName: item.subscriberName,
        expiresAt: item.expiresAt.toISOString().split("T")[0]
      }));

    /* =====================
       RECENT ACTIVATIONS
    ===================== */

    const recentActivity = codes
      .filter(code => code.activatedAt)
      .sort((a, b) => new Date(b.activatedAt) - new Date(a.activatedAt))
      .slice(0, 5)
      .map(code => ({
        subscriberName: code.subscriberName,
        code: code.code,
        date: code.activatedAt.split("T")[0]
      }));

    /* =====================
       MONTHLY ACTIVATIONS
    ===================== */

    const monthlyMap = {};

    codes.forEach(code => {
      if (!code.activatedAt) return;

      const date = new Date(code.activatedAt);
      const month = date.toLocaleString("default", { month: "short" });

      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });

    const monthlyActivations = Object.keys(monthlyMap).map(month => ({
      month,
      amount: monthlyMap[month]
    }));

    /* =====================
       MOST POPULAR COURSES
    ===================== */

    const courseCounter = {};

    codes.forEach(code => {
      if (!code.activatedAt) return;

      (code.allowedCourses || []).forEach(courseId => {
        courseCounter[courseId] =
          (courseCounter[courseId] || 0) + 1;
      });
    });

    const popularCourses = Object.entries(courseCounter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([courseId, count]) => {
        const course = courses.find(
          c => c._id.toString() === courseId.toString()
        );

        return {
          title: course?.title?.en || "Unknown",
          subscribers: count
        };
      });

    res.json({
      totalPrograms,
      totalCodes,
      activeSubscriptions,
      expiredSubscriptions,
      expiringSoon,
      recentActivity,
      monthlyActivations,
      popularCourses
    });

  })
);

export default router;
