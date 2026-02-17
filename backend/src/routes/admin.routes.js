import express from "express";
import { coursesDB, codesDB } from "../config/couch.js";
import { upload } from "../middlewares/upload.js";

import { asyncHandler } from "../middlewares/error.middleware.js";


import { v4 as uuid } from "uuid";

const router = express.Router();

/* =========================
   COURSES
========================= */

/* Create Course */
router.post("/courses", asyncHandler(async (req, res) =>  {
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

  const doc = {
    _id: uuid(),
    title,
    shortDescription,
    fullDescription,
    price,
    contactLink,
    image,
    features,
    learningPoints,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await coursesDB.insert(doc);
  res.json({ ok: true, id: doc._id });
}));

/* Update Course */
router.put("/courses/:id", asyncHandler(async (req, res) =>  {
  const doc = await coursesDB.get(req.params.id);

  const updatedDoc = {
    ...doc,
    title: req.body.title ?? doc.title,
    shortDescription: req.body.shortDescription ?? doc.shortDescription,
    fullDescription: req.body.fullDescription ?? doc.fullDescription,
    price: req.body.price ?? doc.price,
    contactLink: req.body.contactLink ?? doc.contactLink,
    image: req.body.image ?? doc.image,
    features: req.body.features ?? doc.features ?? [],
    learningPoints: req.body.learningPoints ?? doc.learningPoints ?? [],
    updatedAt: new Date().toISOString()
  };

  await coursesDB.insert(updatedDoc);
  res.json({ ok: true });
}));

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
router.post("/codes", asyncHandler(async (req, res) =>  {
  const doc = {
    _id: uuid(),
    code: req.body.code,
    subscriberName: req.body.subscriberName,
    expiresInDays: req.body.expiresInDays,
    extraDays: req.body.extraDays || 0,
    allowedCourses: req.body.allowedCourses || [],
    nutritionPlan: req.body.nutritionPlan || null,
    used: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await codesDB.insert(doc);
  res.json({ ok: true, code: doc.code });
}));

/* 🔥 UPDATE ACTIVATION CODE (FINAL – REPLACE SAFE) */
router.put("/codes/:id", asyncHandler(async (req, res) =>  {
  const doc = await codesDB.get(req.params.id);

  const updatedDoc = {
    ...doc,

    // ✅ الحالة النهائية كما في Admin UI
    allowedCourses: Array.isArray(req.body.allowedCourses)
      ? req.body.allowedCourses
      : [],

    // تمديد الاشتراك (تراكمي)
    extraDays:
      Number(doc.extraDays || 0) + Number(req.body.extraDays || 0),

    updatedAt: new Date().toISOString()
  };

  await codesDB.insert(updatedDoc);
  res.json({ ok: true });
}));

/* Get all activation codes */
router.get("/codes", asyncHandler(async (req, res) =>  {
  const result = await codesDB.list({ include_docs: true });

  const codes = result.rows.map(r => ({
 _id: r.doc._id,

    code: r.doc.code,
    subscriberName: r.doc.subscriberName,
    used: r.doc.used,
    expiresInDays: r.doc.expiresInDays,
    extraDays: r.doc.extraDays || 0,
    allowedCourses: r.doc.allowedCourses || [],
    nutritionPlan: !!r.doc.nutritionPlan,
    createdAt: r.doc.createdAt
  }));

  res.json(codes);
}));

/* Delete activation code */
router.delete("/codes/:id", asyncHandler(async (req, res) =>  {
  const doc = await codesDB.get(req.params.id);
  await codesDB.destroy(doc._id, doc._rev);
  res.json({ ok: true });
}));


router.get("/dashboard", asyncHandler(async (req, res) =>  {
  try {
    const coursesResult = await coursesDB.list({ include_docs: true });
    const codesResult = await codesDB.list({ include_docs: true });

    const courses = coursesResult.rows.map(r => r.doc);
    const codes = codesResult.rows.map(r => r.doc);

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

      monthlyMap[month] =
        (monthlyMap[month] || 0) + 1;
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
        const course = courses.find(c => c._id === courseId);
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

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
}));

export default router;
