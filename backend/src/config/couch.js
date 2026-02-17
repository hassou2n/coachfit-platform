import dotenv from "dotenv";
import nano from "nano";

dotenv.config(); // 🔥 هذا هو الحل

const couch = nano(process.env.COUCH_URL);

export const coursesDB = couch.db.use("courses");
export const codesDB = couch.db.use("activation_codes");
export const videosDB = couch.db.use("videos");
export const watchDB = couch.db.use("watch_history");
