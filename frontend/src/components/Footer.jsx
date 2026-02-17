import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-white/5 bg-black/30 backdrop-blur-sm">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <h3 className="text-2xl font-semibold text-[var(--accent)] mb-4">
            CoachFit
          </h3>

          <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
            Premium fitness programs designed to help women
            build strength, confidence, and sustainable results.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-sm uppercase tracking-wider text-neutral-400 mb-4">
            Explore
          </h4>

          <div className="flex flex-col gap-3 text-sm text-neutral-300">
            <Link to="/" className="hover:text-[var(--accent)] transition">
              Home
            </Link>
            <Link to="/courses" className="hover:text-[var(--accent)] transition">
              Programs
            </Link>
            <Link to="/about" className="hover:text-[var(--accent)] transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-[var(--accent)] transition">
              Contact
            </Link>
            <Link to="/activate" className="hover:text-[var(--accent)] transition">
              Access
            </Link>
          </div>
        </div>

        {/* Contact / Social */}
        <div>
          <h4 className="text-sm uppercase tracking-wider text-neutral-400 mb-4">
            Connect
          </h4>

          <div className="flex gap-6 text-neutral-400 text-sm">
            <a href="#" className="hover:text-[var(--accent)] transition">
              Instagram
            </a>
            <a href="#" className="hover:text-[var(--accent)] transition">
              TikTok
            </a>
            <a href="#" className="hover:text-[var(--accent)] transition">
              Email
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 py-6 text-center text-xs text-neutral-500">
        © 2026 CoachFit — All Rights Reserved.
      </div>

    </footer>
  );
}
