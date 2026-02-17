import { useState } from "react";
import api from "../../services/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const login = async () => {
  try {
    const { data } = await api.post("/auth/login", { password });

    // احفظ التوكن الحقيقي
    localStorage.setItem("adminPassword", password);


    window.location.href = "/admin";
  } catch {
    setError("Wrong password");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[var(--bg-card)] p-10 rounded-2xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>

        <input
          type="password"
          placeholder="Admin password"
          className="w-full p-3 mb-4 bg-neutral-900 border rounded"
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={login}
          className="w-full py-3 bg-[var(--accent)] text-black rounded-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}
