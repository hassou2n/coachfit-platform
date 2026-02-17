import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-semibold tracking-wide text-[var(--accent)]"
        >
          CoachFit
        </NavLink>

        {/* Desktop Navigation (لم نغيره أبداً) */}
        <nav className="hidden md:flex items-center gap-10 text-sm text-neutral-300">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition hover:text-[var(--accent)] ${
                isActive ? "text-[var(--accent)]" : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `transition hover:text-[var(--accent)] ${
                isActive ? "text-[var(--accent)]" : ""
              }`
            }
          >
            Programs
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition hover:text-[var(--accent)] ${
                isActive ? "text-[var(--accent)]" : ""
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition hover:text-[var(--accent)] ${
                isActive ? "text-[var(--accent)]" : ""
              }`
            }
          >
            Contact
          </NavLink>

          {/* CTA Button */}
          <NavLink
            to="/activate"
            className="px-6 py-2 rounded-full bg-[var(--accent)] text-white transition hover:shadow-[0_0_20px_rgba(139,14,22,0.4)]"
          >
            Access
          </NavLink>

        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl text-neutral-300"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/5 px-6 py-6 space-y-6 text-neutral-300">

          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="block transition hover:text-[var(--accent)]"
          >
            Home
          </NavLink>

          <NavLink
            to="/courses"
            onClick={() => setOpen(false)}
            className="block transition hover:text-[var(--accent)]"
          >
            Programs
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setOpen(false)}
            className="block transition hover:text-[var(--accent)]"
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className="block transition hover:text-[var(--accent)]"
          >
            Contact
          </NavLink>

          <NavLink
            to="/activate"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 rounded-full bg-[var(--accent)] text-white text-center"
          >
            Access
          </NavLink>

        </div>
      )}
    </header>
  );
}
