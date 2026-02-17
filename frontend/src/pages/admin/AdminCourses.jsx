import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminCourses() {
  const navigate = useNavigate();

  /* =======================
     State
  ======================= */
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);

  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [price, setPrice] = useState(""); // 🔥 ADD THIS
  const [image, setImage] = useState("");

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  const [fullDescription, setFullDescription] = useState("");
  const [learningPoints, setLearningPoints] = useState([]);
  const [learningInput, setLearningInput] = useState("");

  const [imageType, setImageType] = useState("url");
  const [imageFile, setImageFile] = useState(null);

  const [editingId, setEditingId] = useState(null);


  
  /* =======================
     Data
  ======================= */
  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await api.get("/admin/courses");
      setCourses(res.data);
    } catch (err) {
      alert("Failed to load programs");
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /* =======================
     Actions
  ======================= */
  const saveCourse = async () => {
    if (!titleEn.trim() || !descEn.trim()) {
      alert("Title and short description are required.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = image;

      if (imageType === "upload" && imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await api.post(
          "/admin/courses/upload-image",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = res.data.url;
      }

     const payload = {
  title: { en: titleEn },
  shortDescription: { en: descEn },
  image: imageUrl,
  features,
  fullDescription,
  learningPoints,
  price: price ? Number(price) : null // 🔥 ADD THIS
};


      if (editingId) {
        await api.put(`/admin/courses/${editingId}`, payload);
      } else {
        await api.post("/admin/courses", payload);
      }

      resetForm();
      loadCourses();
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitleEn("");
    setDescEn("");
    setPrice(""); // 🔥 ADD THIS
    setImage("");
    setImageFile(null);
    setImageType("url");
    setFeatures([]);
    setFeatureInput("");
    setFullDescription("");
    setLearningPoints([]);
    setLearningInput("");
  };

  const deleteCourse = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this program?"
    );
    if (!confirmed) return;

    await api.delete(`/admin/courses/${id}`);
    loadCourses();
  };

  const startEdit = (course) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setEditingId(course._id);
    setTitleEn(course.title?.en || "");
    setDescEn(course.shortDescription?.en || "");
    setPrice(course.price || ""); // 🔥 ADD THIS
    setImage(course.image || "");
    setImageType("url");
    setImageFile(null);
    setFeatures(course.features || []);
    setFullDescription(course.fullDescription || "");
    setLearningPoints(course.learningPoints || []);
  };

  /* =======================
     Helpers
  ======================= */
  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures((prev) => [...prev, featureInput.trim()]);
    setFeatureInput("");
  };

  const addLearningPoint = () => {
    if (!learningInput.trim()) return;
    setLearningPoints((prev) => [...prev, learningInput.trim()]);
    setLearningInput("");
  };

  /* =======================
     Render
  ======================= */
 return (
  <section className="max-w-7xl mx-auto px-6 py-28 space-y-20 relative">

    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full -z-10" />

    {/* ================= HEADER ================= */}
    <div>
      <h1 className="text-5xl font-semibold mb-6 leading-tight">
        Manage <span className="text-[var(--accent)]">Programs</span>
      </h1>
      <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
        Create, edit, and organize your coaching programs.
      </p>
    </div>

    {/* ================= FORM ================= */}
    <div className="bg-[var(--bg-card)] p-12 rounded-3xl border border-white/10 shadow-xl space-y-12">

      <h3 className="text-2xl font-semibold">
        {editingId ? "Edit Program" : "Create New Program"}
      </h3>

      {/* Image Type */}
      <div className="flex gap-10 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={imageType === "url"}
            onChange={() => setImageType("url")}
          />
          Image URL
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={imageType === "upload"}
            onChange={() => setImageType("upload")}
          />
          Upload Image
        </label>
      </div>

      {/* Image Input */}
      {imageType === "url" && (
        <input
          className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
          placeholder="Program image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      )}

      {imageType === "upload" && (
        <input
          type="file"
          accept="image/*"
          className="text-sm"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      )}

      {/* Preview */}
      {(image || imageFile) && (
        <img
          src={
            imageType === "url"
              ? image
              : imageFile
              ? URL.createObjectURL(imageFile)
              : null
          }
          alt="preview"
          className="h-56 rounded-3xl object-cover border border-white/10"
        />
      )}

      {/* Title */}
      <input
        className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
        placeholder="Title (EN)"
        value={titleEn}
        onChange={(e) => setTitleEn(e.target.value)}
      />

      {/* Short Description */}
      <textarea
        className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
        placeholder="Short description (EN)"
        value={descEn}
        onChange={(e) => setDescEn(e.target.value)}
      />
<input
  type="number"
  min="0"
  className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
  placeholder="Program price"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
/>

      {/* Features */}
      <div className="space-y-6">
        <p className="text-sm text-neutral-400">
          Program Features
        </p>

        <div className="flex gap-4">
          <input
            className="flex-1 p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
            placeholder="Add feature"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addFeature()}
          />
          <button
            onClick={addFeature}
            className="px-6 bg-[var(--accent)] text-black rounded-2xl hover:opacity-90 transition"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-neutral-900 p-4 rounded-2xl border border-white/10"
            >
              <span>✔ {f}</span>
              <button
                onClick={() =>
                  setFeatures(features.filter((_, x) => x !== i))
                }
                className="text-red-400 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Full Description */}
      <textarea
        className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
        placeholder="Full program description"
        value={fullDescription}
        onChange={(e) => setFullDescription(e.target.value)}
      />

      {/* Learning Points */}
      <div className="space-y-6">
        <p className="text-sm text-neutral-400">
          What students will learn
        </p>

        <div className="flex gap-4">
          <input
            className="flex-1 p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
            placeholder="Add learning point"
            value={learningInput}
            onChange={(e) => setLearningInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && addLearningPoint()
            }
          />
          <button
            onClick={addLearningPoint}
            className="px-6 bg-[var(--accent)] text-black rounded-2xl hover:opacity-90 transition"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {learningPoints.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-neutral-900 p-4 rounded-2xl border border-white/10"
            >
              <span>🎯 {p}</span>
              <button
                onClick={() =>
                  setLearningPoints(
                    learningPoints.filter((_, x) => x !== i)
                  )
                }
                className="text-red-400 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={saveCourse}
        disabled={saving}
        className="px-12 py-4 bg-[var(--accent)] text-black rounded-full hover:opacity-90 transition shadow-lg disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : editingId
          ? "Update Program"
          : "Save Program"}
      </button>
    </div>

 


{/* ================= LIST ================= */}
{loadingCourses ? (
  <div className="text-center py-20 text-neutral-400">
    Loading programs...
  </div>
) : courses.length === 0 ? (
  <div className="text-center py-20 text-neutral-500">
    No programs created yet.
  </div>
) : (
  <div className="space-y-8">

    {courses.map((course) => (
      <div
        key={course._id}
        className="bg-[var(--bg-card)] p-8 rounded-3xl border border-white/10 hover:border-[var(--accent)]/40 transition shadow-sm"
      >

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Left Side */}
          <div className="flex gap-6 items-start">

            {course.image && (
              <img
                src={course.image}
                alt={course.title?.en}
                className="w-28 h-28 object-cover rounded-2xl border border-white/10"
              />
            )}

            <div>
              <h4 className="text-2xl font-semibold text-[var(--accent)] mb-3">
                {course.title?.en}
              </h4>

              <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
                {course.shortDescription?.en}
              </p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex flex-wrap gap-4">

            <button
              onClick={() =>
                navigate(`/admin/courses/${course._id}/videos`)
              }
              className="px-6 py-2 border border-white/10 rounded-full hover:border-[var(--accent)] transition"
            >
              Videos
            </button>

            <button
              onClick={() => startEdit(course)}
              className="px-6 py-2 border border-white/10 rounded-full hover:border-[var(--accent)] transition"
            >
              Edit
            </button>

            <button
              onClick={() => deleteCourse(course._id)}
              className="px-6 py-2 border border-red-500/40 text-red-400 rounded-full hover:border-red-500 transition"
            >
              Delete
            </button>

          </div>

        </div>

      </div>
    ))}

  </div>
)}

 </section>
 )
}
