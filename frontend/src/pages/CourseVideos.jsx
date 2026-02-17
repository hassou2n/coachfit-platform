import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../services/api";
import { getValidSubscription } from "../utils/subscription";

/* ===== Helpers ===== */
const isYouTube = (url) =>
  url.includes("youtube.com") || url.includes("youtu.be");

const getYouTubeEmbedUrl = (url) => {
  try {
    // youtu.be/VIDEO_ID
    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/watch?v=VIDEO_ID
    const u = new URL(url);
    const id = u.searchParams.get("v");
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
};

export default function CourseVideos() {
  const { id } = useParams();
  const sub = getValidSubscription();

  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(null);

  // 🔒 حماية الاشتراك
  if (!sub || !sub.courses.includes(id)) {
    return <Navigate to="/activate" />;
  }

  useEffect(() => {
    api.get(`/videos/${id}`).then(res => {
      setVideos(res.data);
      if (res.data.length) {
        setCurrent(res.data[0]);
      }
    });
  }, [id]);

  if (!current) {
    return (
      <p className="text-center mt-40 text-neutral-400">
        No videos found for this course
      </p>
    );
  }

  const ytEmbed = isYouTube(current.videoUrl)
    ? getYouTubeEmbedUrl(current.videoUrl)
    : null;

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* 🎥 Player */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-2xl overflow-hidden shadow-xl">

            {ytEmbed ? (
              <iframe
                key={ytEmbed}   // 🔥 مهم جدًا لإعادة التحميل
                src={ytEmbed}
                className="w-full h-[420px]"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                key={current._id}
                controls
                controlsList="nodownload"
                className="w-full h-[420px] object-contain bg-black"
                onPlay={() =>
                  api.post("/watch", {
                    code: sub.code,
                    videoId: current._id
                  })
                }
              >
                <source src={current.videoUrl} type="video/mp4" />
              </video>
            )}

          </div>

          <h2 className="text-2xl font-semibold mt-6">
            {current.title}
          </h2>
        </div>

        {/* 📚 Lessons */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-neutral-800">
          <h3 className="text-lg font-semibold mb-4">
            Course Lessons
          </h3>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
            {videos.map((video, index) => {
              const active = current._id === video._id;

              return (
                <button
                  key={video._id}
                  onClick={() => setCurrent(video)}
                  className={`w-full text-left p-4 rounded-xl transition
                    ${
                      active
                        ? "bg-[var(--accent)] text-black"
                        : "bg-neutral-900 hover:bg-neutral-800 text-neutral-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono opacity-70">
                      {index + 1}.
                    </span>
                    <span className="font-medium">
                      {video.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
