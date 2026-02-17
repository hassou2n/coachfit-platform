import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { getValidSubscription } from "../utils/subscription";

export default function SubscriptionGuard({ children }) {
  const { id } = useParams();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const sub = getValidSubscription();

    // 1️⃣ لا يوجد اشتراك
    if (!sub || !sub.code) {
      setAllowed(false);
      return;
    }

    api.post("/check-subscription", { code: sub.code })
      .then(res => {
        // 2️⃣ الكود غير صالح (محذوف / منتهي)
        if (!res.data.valid) {
          localStorage.removeItem("subscription");
          setAllowed(false);
          return;
        }

        const serverSub = res.data.subscription;

        // 🔥 مزامنة localStorage دائمًا
        localStorage.setItem(
          "subscription",
          JSON.stringify(serverSub)
        );

        // 3️⃣ لو لا يوجد course id في الرابط (أمان)
        if (!id) {
          setAllowed(true);
          return;
        }

        // 4️⃣ تحقق آمن من الكورسات
        if (
          !Array.isArray(serverSub.courses) ||
          !serverSub.courses.includes(id)
        ) {
          // ❌ لا صلاحية لهذا الكورس فقط
          setAllowed(false);
          return;
        }

        // 5️⃣ مسموح
        setAllowed(true);
      })
      .catch(() => {
        localStorage.removeItem("subscription");
        setAllowed(false);
      });
  }, [id]);

  if (allowed === null) {
    return <p className="text-center mt-40">Checking access...</p>;
  }

  if (!allowed) {
    return <Navigate to="/activate" replace />;
  }

  return children;
}
