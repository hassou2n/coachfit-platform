import express from "express";
import Watch from "../models/Watch.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { code, videoId } = req.body;

    await Watch.create({
      code,
      videoId,
      watchedAt: new Date(),
    });

    res.json({ ok: true });
  })
);

export default router;
