import { useLocation } from "react-router-dom";




export default function Contact() {

  const location = useLocation();
const params = new URLSearchParams(location.search);
const program = params.get("program");


  return (
    <section className="max-w-7xl mx-auto px-6 py-28 space-y-20 relative">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full -z-10" />

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-5xl font-semibold mb-6 leading-tight">
          Contact <span className="font-accent text-[var(--accent)]">Me</span>
        </h1>
        <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
          Have questions about programs or coaching?  
          I’d love to hear from you.
        </p>
      </div>
{program && (
  <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--accent)]/30 text-center">
    <p className="text-sm text-neutral-400 mb-2">
      You are inquiring about:
    </p>
    <p className="text-lg font-semibold text-[var(--accent)]">
      {program}
    </p>
  </div>
)}

      {/* ================= CONTACT METHODS ================= */}
      <div className="grid md:grid-cols-3 gap-8">

        {/* Email */}
        <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/10 hover:border-[var(--accent)]/40 transition text-center">
          <h3 className="text-xl font-semibold mb-4">
            Email
          </h3>
          <p className="text-neutral-400 mb-6 text-sm">
            Send me an email directly.
          </p>

          <a
            href="mailto:your@email.com"
            className="inline-block px-8 py-3 bg-[var(--accent)] text-black rounded-full hover:opacity-90 transition hover:shadow-[0_0_30px_rgba(139,14,22,0.5)]"
          >
            Send Email
          </a>
        </div>

        {/* Telegram */}
        <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/10 hover:border-[var(--accent)]/40 transition text-center">
          <h3 className="text-xl font-semibold mb-4">
            Telegram
          </h3>
          <p className="text-neutral-400 mb-6 text-sm">
            Message me on Telegram.
          </p>

          <a
            href="https://t.me/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-[var(--accent)] text-black rounded-full hover:opacity-90 transition hover:shadow-[0_0_30px_rgba(139,14,22,0.5)]"
          >
            Open Telegram
          </a>
        </div>

        {/* WhatsApp */}
        <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/10 hover:border-[var(--accent)]/40 transition text-center">
          <h3 className="text-xl font-semibold mb-4">
            WhatsApp
          </h3>
          <p className="text-neutral-400 mb-6 text-sm">
            Chat with me on WhatsApp.
          </p>

          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-[var(--accent)] text-black rounded-full hover:opacity-90 transition hover:shadow-[0_0_30px_rgba(139,14,22,0.5)]"
          >
            Open WhatsApp
          </a>
        </div>

      </div>

    </section>
  );
}
