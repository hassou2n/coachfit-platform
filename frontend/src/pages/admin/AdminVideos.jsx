import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminVideos() {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  /* =====================
     Load Courses
  ===================== */
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/admin/courses");
        setCourses(res.data);
      } catch (err) {
        alert("Failed to load courses");
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  /* =====================
     Upload File
  ===================== */
  const uploadFile = async () => {
    const form = new FormData();
    form.append("video", file);

    const res = await api.post("/videos/upload", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return res.data.url;
  };

  /* =====================
     Save Video
  ===================== */
  const save = async () => {
    if (!courseId) {
      alert("Please select a course");
      return;
    }

    if (!title.trim()) {
      alert("Please enter video title");
      return;
    }

    if (!url && !file) {
      alert("Provide video URL or upload file");
      return;
    }

    if (url && file) {
      alert("Choose either video URL or file upload, not both.");
      return;
    }

    try {
      setLoading(true);

      let videoUrl = url;

      if (file) {
        videoUrl = await uploadFile();
      }

      await api.post("/videos", {
        courseId,
        title: title.trim(),
        videoUrl
      });

      // Reset
      setTitle("");
      setUrl("");
      setFile(null);
      setCourseId("");

      alert("Video added successfully ✅");
    } catch (err) {
      alert("Failed to save video");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     Render
  ===================== */
  return (
  <section className="max-w-7xl mx-auto px-6 py-28 space-y-16 relative">

    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full -z-10" />

    {/* ================= HEADER ================= */}
    <div>
      <h1 className="text-5xl font-semibold mb-6 leading-tight">
        Add <span className="text-[var(--accent)]">Course Video</span>
      </h1>
      <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
        Upload or link new video content to your programs.
      </p>
    </div>

    {/* ================= FORM CARD ================= */}
    <div className="bg-[var(--bg-card)] p-12 rounded-3xl border border-white/10 shadow-xl space-y-8">

      {/* Course */}
      <div>
        <label className="block text-sm text-neutral-400 mb-3">
          Select Course
        </label>

        <select
          className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">
            {loadingCourses ? "Loading courses..." : "Select course"}
          </option>

          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title?.en}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm text-neutral-400 mb-3">
          Video Title
        </label>

        <input
          className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm text-neutral-400 mb-3">
          Video URL (optional)
        </label>

        <input
          className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
          placeholder="Video URL"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (e.target.value) setFile(null);
          }}
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm text-neutral-400 mb-3">
          Or Upload File
        </label>

        <input
          type="file"
          accept="video/*"
          className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl"
          onChange={(e) => {
            setFile(e.target.files[0]);
            if (e.target.files[0]) setUrl("");
          }}
        />

        {file && (
          <p className="text-sm text-neutral-400 mt-3">
            Selected file: {file.name}
          </p>
        )}
      </div>

      {/* Preview (URL only) */}
      {url && (
        <div className="mt-6">
          <video
            src={url}
            controls
            className="w-full rounded-3xl border border-white/10"
          />
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={save}
        disabled={loading}
        className="px-12 py-4 bg-[var(--accent)] text-black rounded-full hover:opacity-90 transition shadow-lg disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Save Video"}
      </button>

    </div>

  </section>
);

}
