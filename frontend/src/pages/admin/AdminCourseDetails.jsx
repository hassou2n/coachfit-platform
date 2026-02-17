import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =======================
     State
  ======================= */
  const [course, setCourse] = useState(null);
  const [fullDescription, setFullDescription] = useState("");
  const [learningPoints, setLearningPoints] = useState([]);
  const [learningInput, setLearningInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* =======================
     Data
  ======================= */
  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/courses/${id}`);
        const c = res.data;

        if (!isMounted) return;

        setCourse(c);
        setFullDescription(c.fullDescription || "");
        setLearningPoints(c.learningPoints || []);
      } catch (err) {
        setError("Failed to load program.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [id]);

  /* =======================
     Actions
  ======================= */
  const saveDetails = async () => {
    try {
      setSaving(true);

      await api.put(`/admin/courses/${id}`, {
        fullDescription,
        learningPoints,
      });

      alert("Program updated successfully ✅");
    } catch (err) {
      alert("Failed to update program ❌");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async () => {
    const confirmed = window.confirm(
      "Delete this program permanently?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/admin/courses/${id}`);
      navigate("/admin/courses");
    } catch (err) {
      alert("Failed to delete program.");
    }
  };

  const addLearningPoint = () => {
    if (!learningInput.trim()) return;

    setLearningPoints((prev) => [
      ...prev,
      learningInput.trim(),
    ]);
    setLearningInput("");
  };

  const removeLearningPoint = (index) => {
    setLearningPoints((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* =======================
     Loading State
  ======================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--accent)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-20">
        {error}
      </div>
    );
  }

  if (!course) return null;

  /* =======================
     Render
  ======================= */
  return (
    <div className="max-w-4xl mx-auto pb-24">

      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--accent)]">
            {course.title?.en}
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Manage program content & description
          </p>
        </div>

        <button
          onClick={() =>
            navigate(`/admin/courses/${course._id}/videos`)
          }
          className="px-6 py-3 bg-[var(--accent)] text-black rounded-full hover:opacity-90 transition"
        >
          Go to Videos →
        </button>
      </div>

      {/* Image Preview */}
      {course.image && (
        <img
          src={course.image}
          alt={course.title?.en}
          className="w-full h-72 object-cover rounded-3xl mb-10 shadow-lg"
        />
      )}

      {/* Description Section */}
      <div className="bg-[var(--bg-card)] p-8 rounded-3xl mb-10 border border-white/5">
        <h3 className="text-lg font-semibold mb-5">
          Full Program Description
        </h3>

        <textarea
          className="w-full min-h-[160px] p-4 bg-neutral-900 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          placeholder="Write the full description of the program..."
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
        />
      </div>

      {/* Learning Points */}
      <div className="bg-[var(--bg-card)] p-8 rounded-3xl mb-12 border border-white/5">
        <h3 className="text-lg font-semibold mb-5">
          What Students Will Learn
        </h3>

        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 p-3 bg-neutral-900 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="Add learning point"
            value={learningInput}
            onChange={(e) => setLearningInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && addLearningPoint()
            }
          />
          <button
            onClick={addLearningPoint}
            className="px-5 bg-[var(--accent)] text-black rounded-xl hover:opacity-90 transition"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {learningPoints.map((point, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-neutral-900 p-4 rounded-xl border border-white/5"
            >
              <span className="text-sm">
                🎯 {point}
              </span>

              <button
                onClick={() => removeLearningPoint(i)}
                className="text-red-400 hover:text-red-300 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {learningPoints.length === 0 && (
          <p className="text-neutral-500 text-sm mt-4">
            No learning points added yet.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={deleteCourse}
          className="px-6 py-3 border border-red-600 text-red-500 rounded-full hover:bg-red-600/10 transition"
        >
          Delete Program
        </button>

        <button
          onClick={saveDetails}
          disabled={saving}
          className="px-8 py-3 bg-[var(--accent)] text-black rounded-full hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
