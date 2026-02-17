import express from "express";
import { asyncHandler } from "../middlewares/error.middleware.js";

const router = express.Router();

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({ ok: true });
  })
);

export default router;
