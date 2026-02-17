import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminCodesList() {
  const [codes, setCodes] = useState([]);
  const [courses, setCourses] = useState([]);

  const [editing, setEditing] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [extraDays, setExtraDays] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =====================
     Load data
  ===================== */
  const load = async () => {
    try {
      setLoading(true);

      const [codesRes, coursesRes] = await Promise.all([
        api.get("/admin/codes"),
        api.get("/admin/courses")
      ]);

      setCodes(codesRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =====================
     Helpers
  ===================== */
  const toggleCourse = (id) => {
    setSelectedCourses(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const getExpireDate = (c) => {
    const base = new Date(c.createdAt);
    const totalDays =
      Number(c.expiresInDays || 0) + Number(c.extraDays || 0);

    base.setDate(base.getDate() + totalDays);
    return base.toLocaleDateString();
  };

  const getCourseNames = (ids = []) => {
    return ids
      .map(id => {
        const course = courses.find(c => c._id === id);
        return course?.title?.en;
      })
      .filter(Boolean)
      .join(", ");
  };

  /* =====================
     Actions
  ===================== */
  const saveEdit = async () => {
    try {
      setSaving(true);

      await api.put(`/admin/codes/${editing._id}`, {
        allowedCourses: selectedCourses,
        extraDays: Math.max(0, Number(extraDays))
      });

      setEditing(null);
      setSelectedCourses([]);
      setExtraDays(0);

      load();
    } catch (err) {
      alert("Failed to update code");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const confirmed = window.confirm("Delete this code?");
    if (!confirmed) return;

    await api.delete(`/admin/codes/${id}`);
    load();
  };

  /* =====================
     Render
  ===================== */
 return (
  <section className="max-w-7xl mx-auto px-6 py-28 space-y-16 relative">

    {/* Background Glow */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full -z-10" />

    {/* ================= HEADER ================= */}
    <div>
      <h1 className="text-5xl font-semibold mb-6 leading-tight">
        Activation <span className="text-[var(--accent)]">Codes</span>
      </h1>
      <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
        Manage subscriber access and subscription durations.
      </p>
    </div>

    {/* ================= CONTENT ================= */}
    {loading ? (
      <div className="text-center py-20 text-neutral-400">
        Loading codes...
      </div>
    ) : !codes.length ? (
      <div className="text-center py-20 text-neutral-500">
        No activation codes created yet.
      </div>
    ) : (
      <div className="space-y-8">

        {codes.map(c => (
          <div
            key={c._id}
            className="bg-[var(--bg-card)] p-8 rounded-3xl border border-white/10 hover:border-[var(--accent)]/40 transition"
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              {/* LEFT SIDE */}
              <div className="space-y-3">

                <div className="text-2xl font-mono tracking-widest text-[var(--accent)]">
                  {c.code}
                </div>

                <div className="text-sm text-neutral-400">
                  Subscriber: {c.subscriberName || "—"}
                </div>

                <div className="text-sm">
                  Status:{" "}
                  {c.used ? (
                    <span className="text-red-400">Used</span>
                  ) : (
                    <span className="text-green-400">Active</span>
                  )}
                </div>

                <div className="text-sm text-neutral-400">
                  Expires: {getExpireDate(c)}
                </div>

                <div className="text-sm text-neutral-400 max-w-xl">
                  Courses: {getCourseNames(c.allowedCourses) || "—"}
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">

                <button
                  onClick={() => {
                    setEditing(c);
                    setSelectedCourses(c.allowedCourses || []);
                    setExtraDays(0);
                  }}
                  className="px-6 py-2 border border-white/10 rounded-full hover:border-[var(--accent)] transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => remove(c._id)}
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

    {/* ================= EDIT MODAL ================= */}
    {editing && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-[var(--bg-card)] p-10 rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto border border-white/10">

          <h3 className="text-2xl font-semibold mb-8">
            Edit Code – <span className="text-[var(--accent)]">{editing.code}</span>
          </h3>

          {/* Courses */}
          <p className="text-sm mb-4 text-neutral-400">
            Allowed Courses
          </p>

          <div className="space-y-3 mb-10 max-h-60 overflow-y-auto pr-2">
            {courses.map(course => (
              <label
                key={course._id}
                className="flex items-center gap-4 bg-neutral-900 p-4 rounded-2xl border border-white/10 cursor-pointer hover:border-[var(--accent)]/40 transition"
              >
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course._id)}
                  onChange={() => toggleCourse(course._id)}
                />
                <span className="text-sm">
                  {course.title?.en}
                </span>
              </label>
            ))}
          </div>

          {/* Extend days */}
          <label className="text-sm text-neutral-400">
            Extend subscription (days)
          </label>

          <input
            type="number"
            min={0}
            className="w-full p-4 mt-3 mb-10 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none"
            value={extraDays}
            onChange={e =>
              setExtraDays(Math.max(0, Number(e.target.value)))
            }
          />

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setEditing(null)}
              className="px-6 py-2 border border-white/10 rounded-full hover:border-white/30 transition"
            >
              Cancel
            </button>

            <button
              onClick={saveEdit}
              disabled={saving}
              className="px-10 py-3 bg-[var(--accent)] text-black rounded-full disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    )}

  </section>
);

}
