import express from "express";
import { watchDB } from "../config/couch.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

import { v4 as uuid } from "uuid";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
  const doc = {
    _id: uuid(),
    code: req.body.code,
    videoId: req.body.videoId,
    watchedAt: new Date().toISOString()
  };

  await watchDB.insert(doc);
  res.json({ ok: true });
}));

export default router;
