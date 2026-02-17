import express from "express";
import { coursesDB, codesDB } from "../config/couch.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

import { v4 as uuid } from "uuid";

const router = express.Router();

/* =========================
   COURSES (PUBLIC)
========================= */

router.get("/", asyncHandler(async (req, res) =>{
  try {
    const result = await coursesDB.list({ include_docs: true });
    const courses = result.rows.map(r => r.doc);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
}));

router.get("/:id", asyncHandler(async (req, res) =>{
  try {
    const course = await coursesDB.get(req.params.id);
    res.json(course);
  } catch {
    res.status(404).json({ message: "Course not found" });
  }
}));

/* =========================
   COURSES (ADMIN)
========================= */

router.post("/", asyncHandler(async (req, res) =>{
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      image,
      features = [],
      learningPoints = []
    } = req.body;

    const doc = {
      _id: uuid(),
      title,
      shortDescription,
      fullDescription,
      image,
      features,
      learningPoints,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await coursesDB.insert(doc);
    res.json({ ok: true, id: doc._id });
  } catch {
    res.status(500).json({ message: "Failed to create course" });
  }
}));

router.put("/:id", asyncHandler(async (req, res) =>{
  try {
    const doc = await coursesDB.get(req.params.id);

    const updatedDoc = {
      ...doc,
      title: req.body.title ?? doc.title,
      shortDescription: req.body.shortDescription ?? doc.shortDescription,
      fullDescription: req.body.fullDescription ?? doc.fullDescription,
      image: req.body.image ?? doc.image,
      features: req.body.features ?? doc.features ?? [],
      learningPoints: req.body.learningPoints ?? doc.learningPoints ?? [],
      updatedAt: new Date().toISOString()
    };

    await coursesDB.insert(updatedDoc);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "Failed to update course" });
  }
}));

/* =========================
   DELETE COURSE + CLEANUP 🔥
========================= */

router.delete("/:id", asyncHandler(async (req, res) =>{
  try {
    const courseId = req.params.id;

    // 1️⃣ حذف الكورس
    const courseDoc = await coursesDB.get(courseId);
    await coursesDB.destroy(courseDoc._id, courseDoc._rev);

    // 2️⃣ تنظيف الأكواد (إزالة الكورس من allowedCourses)
    const codesResult = await codesDB.list({ include_docs: true });

    const updates = codesResult.rows
      .map(r => r.doc)
      .filter(code =>
        Array.isArray(code.allowedCourses) &&
        code.allowedCourses.includes(courseId)
      )
      .map(code => ({
        ...code,
        allowedCourses: code.allowedCourses.filter(c => c !== courseId),
        updatedAt: new Date().toISOString()
      }));

    for (const doc of updates) {
      await codesDB.insert(doc);
    }

    res.json({ ok: true, cleanedFromCodes: updates.length });
  } catch {
    res.status(404).json({ message: "Course not found" });
  }
}));

export default router;
