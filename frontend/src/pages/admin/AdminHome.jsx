import { useEffect, useState } from "react";
import api from "../../services/api";
import { Suspense, lazy } from "react";

const AdminChart = lazy(() => import("./AdminChart"));


export default function AdminHome() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--accent)] border-t-transparent rounded-full" />
      </div>
    );
  }
return (
  <section className="max-w-7xl mx-auto px-6 py-28 space-y-20 relative">

    {/* Soft background glow */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full -z-10" />

    {/* ================= HEADER ================= */}
    <div>
      <h1 className="text-5xl font-semibold mb-6 leading-tight">
        Dashboard <span className="text-[var(--accent)]">Overview</span>
      </h1>
      <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
        Monitor your platform performance and subscriber activity in real time.
      </p>
    </div>

    {/* ================= STATS ================= */}
    <div className="grid md:grid-cols-4 gap-10">

      <StatCard title="Programs" value={data.totalPrograms} />
      <StatCard title="Total Codes" value={data.totalCodes} />
      <StatCard title="Active Subscriptions" value={data.activeSubscriptions} highlight />
      <StatCard title="Expired Subscriptions" value={data.expiredSubscriptions} />

    </div>

    {/* ================= CHART ================= */}
<Suspense fallback={
 <div className="h-72 bg-[var(--bg-card)] rounded-3xl">
    Loading chart...
  </div>
}>
  <AdminChart data={data?.monthlyActivations || []} />
</Suspense>


    {/* ================= RECENT + ALERTS ================= */}
    <div className="grid md:grid-cols-2 gap-12">

      {/* Recent Activity */}
      <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/10">
        <h2 className="text-2xl font-semibold mb-8">
          Recent Activity
        </h2>

        <div className="space-y-5">
          {data.recentActivity.length === 0 ? (
            <p className="text-neutral-400 text-sm">
              No recent activations.
            </p>
          ) : (
            data.recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-white/5 pb-3"
              >
                <span className="text-neutral-300">
                  {item.subscriberName}
                </span>
                <span className="text-xs text-neutral-500">
                  {item.date}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expiring Codes */}
      <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/10">
        <h2 className="text-2xl font-semibold mb-8">
          Expiring Soon
        </h2>

        <div className="space-y-5">
          {data.expiringSoon.length === 0 ? (
            <p className="text-neutral-400 text-sm">
              No subscriptions expiring soon.
            </p>
          ) : (
            data.expiringSoon.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-white/5 pb-3"
              >
                <span className="text-neutral-300">
                  {item.subscriberName}
                </span>
                <span className="text-[var(--accent)] text-xs">
                  {item.expiresAt}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>

  </section>
);
}
/* ================= STAT CARD COMPONENT ================= */

function StatCard({ title, value, highlight }) {
  return (
    <div className={`relative bg-[var(--bg-card)] p-8 rounded-3xl border transition 
      ${highlight ? "border-[var(--accent)]/40" : "border-white/10"}
      hover:border-[var(--accent)]/50`}>

      {highlight && (
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-[var(--accent)] opacity-15 blur-3xl rounded-full" />
      )}

      <p className="text-sm text-neutral-400 mb-3">
        {title}
      </p>

      <h3 className="text-4xl font-semibold text-white tracking-tight">
        {value}
      </h3>
    </div>
  );
}
