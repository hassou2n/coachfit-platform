import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AdminChart({ data }) {

  // 🔒 حماية مهمة جدًا
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-neutral-400">
        No chart data available
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/10 shadow-lg">
      <h2 className="text-2xl font-semibold mb-8">
        Monthly Activations
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#16181d",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px"
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--accent)"
              strokeWidth={4}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
