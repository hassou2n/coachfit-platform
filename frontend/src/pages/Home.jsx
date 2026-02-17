import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-40">

      {/* Accent Glow Background */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[var(--accent)]/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-40 right-0 w-72 h-72 bg-[var(--accent)]/10 blur-[100px] rounded-full -z-10" />

      {/* ================= HERO ================= */}
      <div className="max-w-4xl">

        <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-10">
          Train with balance.<br />
         <span className="font-accent text-[var(--accent)]">
  Become stronger.
</span>
<br />
          Feel confident.
        </h1>

        <p className="text-neutral-300 max-w-xl text-lg mb-14 leading-relaxed">
          Premium fitness programs designed for women who want real,
          sustainable results — without extremes or burnout.
        </p>

        <div className="flex flex-wrap gap-6">

          <Link
            to="/courses"
            className="px-12 py-4 rounded-full bg-[var(--accent)] text-white text-sm font-medium transition hover:shadow-[0_0_30px_rgba(139,14,22,0.5)]"
          >
            View Programs
          </Link>

          <Link
            to="/about"
            className="px-12 py-4 rounded-full border border-white/10 text-sm hover:border-[var(--accent)] transition"
          >
            About Me
          </Link>

        </div>

      </div>

      {/* ================= STATS SECTION ================= */}
      <div className="grid md:grid-cols-3 gap-12 mt-32">

        <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/5 text-center hover:border-[var(--accent)]/40 transition">
          <h3 className="text-4xl font-semibold text-[var(--accent)] mb-2">
            8+
          </h3>
          <p className="text-neutral-400 text-sm">
            Structured Programs
          </p>
        </div>

        <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/5 text-center hover:border-[var(--accent)]/40 transition">
          <h3 className="text-4xl font-semibold text-[var(--accent)] mb-2">
            1000+
          </h3>
          <p className="text-neutral-400 text-sm">
            Women Transformed
          </p>
        </div>

        <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/5 text-center hover:border-[var(--accent)]/40 transition">
          <h3 className="text-4xl font-semibold text-[var(--accent)] mb-2">
            5+ Years
          </h3>
          <p className="text-neutral-400 text-sm">
            Coaching Experience
          </p>
        </div>

      </div>

    </section>
  );
}
