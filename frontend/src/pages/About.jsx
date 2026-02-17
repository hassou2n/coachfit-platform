import coachImg from "../assets/coach.webp";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <section className="max-w-6xl mx-auto px-6 py-32 space-y-32">

      {/* ================= HERO ================= */}
      <div className="grid md:grid-cols-2 gap-20 items-center">

        {/* Left */}
        <div>
         <h2 className="text-5xl font-semibold">
  About <span className="font-accent text-[var(--accent)]">Me</span>
</h2>


          <p className="text-neutral-300 text-lg leading-relaxed mb-6">
            I help women build strength, confidence, and a powerful
            relationship with their bodies through structured,
            sustainable training.
          </p>

          <p className="text-neutral-400 leading-relaxed mb-10">
            My coaching approach combines smart programming,
            realistic nutrition, and mindset development to create
            long-term transformation — not quick fixes.
          </p>

          <div className="flex gap-6">
            <button
              onClick={() => navigate("/courses")}
              className="px-10 py-4 bg-[var(--accent)] text-white rounded-full hover:shadow-[0_0_20px_rgba(139,14,22,0.4)] transition"
            >
              Explore Programs
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="px-10 py-4 border border-white/10 rounded-full hover:border-[var(--accent)] transition"
            >
              Contact Me
            </button>
          </div>
        </div>

        {/* Right – Image */}
        <div className="relative">
          <img
            src={coachImg}
            alt="Fitness Coach"
className="w-full aspect-[4/3] object-cover"

          />

          {/* Subtle Accent Glow */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--accent)]/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* ================= VALUES ================= */}
      <div>
        <h3 className="text-4xl font-semibold mb-14 text-center">
          My Approach
        </h3>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/5 hover:border-[var(--accent)]/40 transition duration-300 hover:-translate-y-2">
            <h4 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              Sustainable Training
            </h4>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Smart, structured programs that fit your real life —
              no extreme diets or burnout routines.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/5 hover:border-[var(--accent)]/40 transition duration-300 hover:-translate-y-2">
            <h4 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              Confidence Building
            </h4>
            <p className="text-neutral-400 text-sm leading-relaxed">
              True transformation starts with mindset and self-belief,
              not just physical results.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/5 hover:border-[var(--accent)]/40 transition duration-300 hover:-translate-y-2">
            <h4 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              Real Results
            </h4>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Designed for long-term progress — sustainable,
              measurable, and empowering.
            </p>
          </div>

        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="text-center pt-10">
        <h3 className="text-4xl font-semibold mb-8">
          Ready to begin your transformation?
        </h3>

        <button
          onClick={() => navigate("/courses")}
          className="px-14 py-5 bg-[var(--accent)] text-white rounded-full text-lg transition hover:shadow-[0_0_30px_rgba(139,14,22,0.5)]"
        >
          Start Your Journey
        </button>
      </div>

    </section>
  );
}
