import express from "express";
import { coursesDB, codesDB } from "../config/couch.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

const router = express.Router();

/* =========================
   COURSES (PUBLIC)
========================= */
router.get("/courses", asyncHandler(async (req, res) =>{
  const result = await coursesDB.list({ include_docs: true });
  res.json(result.rows.map(r => r.doc));
}));

/* =========================
   ACTIVATE CODE
========================= */
router.post("/activate", asyncHandler(async (req, res) => {
  const { code } = req.body;

  const result = await codesDB.find({ selector: { code } });
  if (!result.docs.length) {
    return res.status(400).json({ message: "Invalid code" });
  }

  const doc = result.docs[0];

  // ❌ لا تمنع التفعيل بسبب used
  // لأن الاشتراك يعتمد على الصلاحية لا على used
  const updatedDoc = {
    ...doc,
    used: true,
    activatedAt: doc.activatedAt || new Date().toISOString()
  };

  await codesDB.insert(updatedDoc);

  res.json({
    code: doc.code,
    subscriberName: doc.subscriberName,
    courses: doc.allowedCourses || [],
    nutritionPlan: doc.nutritionPlan || null
  });
}));

/* =========================
   CHECK SUBSCRIPTION (🔥 الأهم)
========================= */
router.post("/check-subscription", asyncHandler(async (req, res) => {
  const { code } = req.body;

  const result = await codesDB.find({
    selector: { code }
  });

  // الكود محذوف
  if (!result.docs.length) {
    return res.json({ valid: false });
  }

  const doc = result.docs[0];

  // حساب الانتهاء الحقيقي
  const startDate = new Date(doc.createdAt);
  const totalDays =
    Number(doc.expiresInDays || 0) +
    Number(doc.extraDays || 0);

  startDate.setDate(startDate.getDate() + totalDays);

  if (startDate < new Date()) {
    return res.json({ valid: false });
  }

  // 🔥 رجّع الاشتراك كامل ومُحدّث
  res.json({
    valid: true,
    subscription: {
      code: doc.code,
      subscriberName: doc.subscriberName,
      courses: doc.allowedCourses || [],
      nutritionPlan: doc.nutritionPlan || null
    }
  });
}));

export default router;
