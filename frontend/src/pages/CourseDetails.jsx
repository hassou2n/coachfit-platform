import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  /* =======================
     Data
  ======================= */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);

        // subscription check (simple – قابل للتطوير لاحقًا)
        const sub = await api.get(`/subscriptions/check/${id}`);
        setIsSubscribed(sub.data?.active === true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return null;
  if (!course) return <p className="p-10">Course not found</p>;

  /* =======================
     Render
  ======================= */
  return (
    <div className="max-w-6xl mx-auto px-6 pb-24">
      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-12 mt-14">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-semibold mb-4">
            {course.title?.en}
          </h1>

          <p className="text-neutral-400 mb-6 leading-relaxed">
           <ul>
  {course.fullDescription.split("\n").map((line, i) => (
    <li key={i}>{line}</li>
  ))}
</ul>

          </p>

          {/* CTA */}
          {isSubscribed ? (
            <button
              onClick={() => navigate(`/courses/${course._id}/videos`)}
              className="px-10 py-4 bg-[var(--accent)] text-black rounded-full text-lg"
            >
              ▶ Start Course
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-10 py-4 bg-neutral-800 rounded-full text-lg transition hover:shadow-[0_0_30px_rgba(139,14,22,0.5)]"
            >
              🔒 Subscribe to Unlock
            </button>
          )}
        </div>

        {/* Right – Image */}
        {course.image && (
          <img
            src={course.image}
            alt={course.title?.en}
            className="w-full h-80 object-cover rounded-3xl shadow-lg"
          />
        )}
      </div>

      {/* What you will learn */}
      {course.learningPoints?.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-semibold mb-8">
            What you will learn
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {course.learningPoints.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-neutral-900 p-5 rounded-xl"
              >
                <span className="text-[var(--accent)] text-xl">✔</span>
                <p className="text-neutral-300">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
