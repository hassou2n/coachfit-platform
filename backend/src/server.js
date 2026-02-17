import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {adminAuth} from "./middlewares/adminAuth.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";
import courseRoutes from "./routes/course.routes.js";
import videoRoutes from "./routes/video.routes.js";
import watchRoutes from "./routes/watch.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Public
app.use("/api", publicRoutes);

// Auth
app.use("/api/auth", authRoutes);

// Admin
app.use("/api/admin", adminAuth, adminRoutes);

// Courses (public)
app.use("/api/courses", courseRoutes);

// 🔥 مهم جدًا: إعادة ربط admin courses
app.use("/api/admin/courses", adminAuth, courseRoutes);


// Videos
app.use("/api/videos", videoRoutes);

// Watch history
app.use("/api/watch", watchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
