import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getValidSubscription } from "../utils/subscription";

export default function Activate() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ========================
     Check Existing Subscription
  ======================== */
  useEffect(() => {
    const sub = getValidSubscription();

    if (!sub) {
      setChecking(false);
      return;
    }

    api.post("/check-subscription", { code: sub.code })
      .then(res => {
        if (res.data.valid) {
          navigate("/dashboard", { replace: true });
        } else {
          localStorage.removeItem("subscription");
          setChecking(false);
        }
      })
      .catch(() => {
        localStorage.removeItem("subscription");
        setChecking(false);
      });
  }, [navigate]);

  /* ========================
     Activate Code
  ======================== */
  const activate = async () => {
    if (!code.trim()) {
      setError("Please enter activation code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/activate", {
        code: code.trim()
      });

      localStorage.setItem(
        "subscription",
        JSON.stringify(res.data)
      );

      navigate("/dashboard", { replace: true });

    } catch {
      setError("Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  /* ========================
     Checking State
  ======================== */
  if (checking) {
   return (
  <div className="relative max-w-md mx-auto py-40 px-6 min-h-[600px]">

    {checking ? (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--accent)] border-t-transparent rounded-full" />
      </div>
    ) : (
      <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/5">
        ...
      </div>
    )}

  </div>
);

  }

  /* ========================
     Render
  ======================== */
  return (
    <div className="relative max-w-md mx-auto py-40 px-6">

      {/* Accent Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[var(--accent)]/20 blur-[100px] rounded-full -z-10" />

      <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/5">

        <h2 className="text-3xl font-semibold mb-8 text-center">
          Activate Your Access
        </h2>

        <input
          className="w-full p-4 mb-4 bg-neutral-900 border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
          placeholder="Activation Code"
          value={code}
          onChange={e => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
        />

        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">
            {error}
          </p>
        )}

        <button
          onClick={activate}
          disabled={loading}
          className="w-full py-4 bg-[var(--accent)] text-white rounded-full transition hover:shadow-[0_0_25px_rgba(139,14,22,0.4)] disabled:opacity-50"
        >
          {loading ? "Activating..." : "Activate"}
        </button>

      </div>
    </div>
  );
}
