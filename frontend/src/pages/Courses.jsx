import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses").then(res => setCourses(res.data));
  }, []);

 

  return (
    <section className="max-w-7xl mx-auto px-6 py-28 space-y-28 relative">

      {/* Soft Glow */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[var(--accent)] opacity-10 blur-[160px] rounded-full -z-10" />

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-5xl font-semibold mb-6 leading-tight">
          Coaching <span className="text-[var(--accent)]">Programs</span>
        </h1>
        <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
          Premium fitness programs designed for real, sustainable results.
        </p>
      </div>

      {/* ================= PROGRAMS GRID ================= */}
     <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">


        {courses.map((course, index) => (
  <div key={course._id} className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/10 flex flex-col">

    {course.image && (
      <img
        src={course.image.replace(
          "/upload/",
          "/upload/w_800,q_auto,f_auto/"
        )}
        alt={course.title?.en}
      className="w-full h-56 object-cover rounded-2xl"
        fetchPriority={index === 0 ? "high" : "auto"}
        loading={index === 0 ? "eager" : "lazy"}
      />
    )}


            {/* Title */}
            <h3 className="text-2xl font-semibold mb-3 min-h-[32px]">
              {course.title?.en}
            </h3>

            {/* Description */}
            <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
              {course.shortDescription?.en}
            </p>

            {/* Features */}
            {course.features?.length > 0 && (
              <ul className="space-y-2 text-neutral-300 text-sm mb-8">
                {course.features.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>
            )}

            {/* PRICE */}
            {course.price && (
              <div className="mb-8">
                <p className="text-3xl font-semibold text-[var(--accent)]">
                  ${course.price}
                </p>
                <p className="text-xs text-neutral-500">
                  One-time access
                </p>
              </div>
            )}

            {/* ACTIONS */}
           <div className="mt-auto pt-6 flex gap-4">

              <Link
                to={`/courses/${course._id}`}
                className="px-6 py-3 border border-white/10 rounded-full text-sm hover:border-[var(--accent)] transition"
              >
                View Details
              </Link>

             <Link
  to={`/contact?program=${encodeURIComponent(course.title?.en)}`}
  className="px-6 py-3 bg-[var(--accent)] text-black rounded-full text-sm hover:opacity-90  transition hover:shadow-[0_0_30px_rgba(139,14,22,0.5)]"
>
  Enroll Now
</Link>


            </div>

          </div>
        ))}

      </div>

      {/* ================= FULL ACCESS SECTION ================= */}
      <div className="relative mt-24 p-16 rounded-[40px] overflow-hidden bg-gradient-to-br from-black via-[#0f1115] to-black border border-[var(--accent)]/30 shadow-2xl">

  <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--accent)] opacity-10 blur-[140px] rounded-full" />

  <h2 className="text-4xl font-semibold mb-6">
    Full Access <span className="text-[var(--accent)]">Membership</span>
  </h2>

  <p className="text-neutral-400 mb-8 max-w-xl">
    Unlimited access to all programs, nutrition plans, priority support and exclusive updates.
  </p>

  <p className="text-5xl font-bold text-[var(--accent)] mb-8">
    $39 <span className="text-lg text-neutral-400">/ month</span>
  </p>

  <ul className="space-y-3 text-neutral-300 mb-10">
    <li>✔ Access all programs</li>
    <li>✔ Nutrition plan included</li>
    <li>✔ Priority support</li>
    <li>✔ Continuous updates</li>
  </ul>

  <button className="px-12 py-4 bg-[var(--accent)] text-black rounded-full text-lg hover:opacity-90 transition shadow-xl">
    Join Membership
  </button>

</div>


    </section>
  );
}
