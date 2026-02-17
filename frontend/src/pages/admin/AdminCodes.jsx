import { useEffect, useState } from "react";
import api from "../../services/api";

/* توليد كود عشوائي */
const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
};

export default function AdminCodes() {
  const [subscriberName, setSubscriberName] = useState("");
  const [days, setDays] = useState(30);

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [generatedCode, setGeneratedCode] = useState("");

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =======================
     Load Courses
  ======================= */
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

  /* =======================
     Helpers
  ======================= */
  const toggleCourse = (id) => {
    setSelectedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  const generate = async () => {
    if (!subscriberName.trim()) {
      alert("Subscriber name is required");
      return;
    }

    if (!selectedCourses.length) {
      alert("Select at least one course");
      return;
    }

    if (days < 1) {
      alert("Subscription days must be at least 1");
      return;
    }

    try {
      setSaving(true);

      const code = generateCode();

      await api.post("/admin/codes", {
        code,
        subscriberName: subscriberName.trim(),
        expiresInDays: days,
        allowedCourses: selectedCourses,
        extraDays: 0
      });

      setGeneratedCode(code);

      // Reset form (except result)
      setSubscriberName("");
      setSelectedCourses([]);
      setDays(30);
    } catch (err) {
      alert("Failed to generate code");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    alert("Code copied to clipboard ✅");
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
        Generate <span className="text-[var(--accent)]">Activation Code</span>
      </h1>
      <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
        Create secure access codes for your subscribers.
      </p>
    </div>

    {/* ================= FORM CARD ================= */}
    <div className="bg-[var(--bg-card)] p-12 rounded-3xl border border-white/10 shadow-xl space-y-10">

      {/* Subscriber name */}
      <input
        className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
        placeholder="Subscriber name"
        value={subscriberName}
        onChange={(e) => setSubscriberName(e.target.value)}
      />

      {/* Days */}
      <input
        type="number"
        min={1}
        className="w-full p-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
        placeholder="Subscription days"
        value={days}
        onChange={(e) =>
          setDays(Math.max(1, Number(e.target.value)))
        }
      />

      {/* Courses */}
      <div className="space-y-4">
        <p className="text-sm text-neutral-400">
          Select courses ({selectedCourses.length})
        </p>

        {loadingCourses ? (
          <div className="text-neutral-500 text-sm">
            Loading courses...
          </div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {courses.map((course) => (
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

            {!courses.length && (
              <p className="text-neutral-500 text-sm">
                No courses available.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={generate}
        disabled={saving}
        className="px-12 py-4 bg-[var(--accent)] text-black rounded-full hover:opacity-90 transition shadow-lg disabled:opacity-50"
      >
        {saving ? "Generating..." : "Generate Code"}
      </button>

    </div>

    {/* ================= RESULT ================= */}
    {generatedCode && (
      <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-[var(--accent)]/30 space-y-6">

        <p className="text-sm text-neutral-400">
          Activation Code Generated:
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-neutral-900 p-6 rounded-2xl border border-white/10">

          <p className="text-3xl font-mono tracking-widest text-[var(--accent)]">
            {generatedCode}
          </p>

          <button
            onClick={copyToClipboard}
            className="px-6 py-2 border border-[var(--accent)] text-[var(--accent)] rounded-full hover:bg-[var(--accent)] hover:text-black transition"
          >
            Copy
          </button>

        </div>

      </div>
    )}

  </section>
);

}
