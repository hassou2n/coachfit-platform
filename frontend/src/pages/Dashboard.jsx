import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getValidSubscription } from "../utils/subscription";

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = getValidSubscription();

    if (!sub || !sub.code) {
      navigate("/activate", { replace: true });
      return;
    }

    const syncSubscription = async () => {
      try {
        // 🔥 مزامنة الاشتراك من السيرفر
        const res = await api.post("/check-subscription", {
          code: sub.code
        });

        if (!res.data.valid) {
          localStorage.removeItem("subscription");
          navigate("/activate", { replace: true });
          return;
        }

        // 🔥 تحديث localStorage
        localStorage.setItem(
          "subscription",
          JSON.stringify(res.data.subscription)
        );

        // 🔥 تحميل الكورسات المحدثة
        const results = await Promise.allSettled(
          res.data.subscription.courses.map(id =>
            api.get(`/courses/${id}`)
          )
        );

        const validCourses = results
          .filter(r => r.status === "fulfilled")
          .map(r => r.value.data);

        setCourses(validCourses);
      } catch {
        localStorage.removeItem("subscription");
        navigate("/activate", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    syncSubscription();
  }, [navigate]);

  if (loading) {
    return (
      <p className="text-center mt-40">
        Loading your programs…
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-28 px-6">
      <h2 className="text-4xl font-semibold mb-10">
        My Programs
      </h2>

      <div className="space-y-6">
        {courses.length === 0 && (
          <p className="text-neutral-400">
            No available programs at the moment.
          </p>
        )}

        {courses.map(course => (
          <div
            key={course._id}
            className="p-6 border rounded-2xl bg-[var(--bg-card)]"
          >
            <h3 className="text-xl font-medium mb-2">
              {course.title?.en}
            </h3>

            <p className="text-neutral-400 mb-4">
              {course.shortDescription?.en}
            </p>

            <button
              onClick={() =>
                navigate(`/courses/${course._id}/videos`)
              }
              className="px-6 py-2 bg-[var(--accent)] text-black rounded-full"
            >
              Watch Videos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
