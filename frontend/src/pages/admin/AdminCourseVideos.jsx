import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function AdminCourseVideos() {
  const { id } = useParams(); // courseId
  const [videos, setVideos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const loadVideos = () => {
    api.get(`/videos/${id}`).then(res => setVideos(res.data));
  };

  useEffect(() => {
    loadVideos();
  }, [id]);

  const startEdit = (video) => {
    setEditing(video._id);
    setTitle(video.title);
    setUrl(video.videoUrl);
  };
const saveEdit = async () => {
  await api.put(`/videos/${editing}`, {
    title,
    videoUrl: url
  });

  setEditing(null);
  setTitle("");
  setUrl("");
  loadVideos();
};


  const remove = async (videoId) => {
    if (!confirm("Delete this video?")) return;
    await api.delete(`/videos/${videoId}`);
    loadVideos();
  };
return (
  <section className="max-w-7xl mx-auto px-6 py-28 space-y-16 relative">

    {/* Background Glow */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--accent)] opacity-10 blur-[120px] rounded-full -z-10" />

    {/* ================= HEADER ================= */}
    <div>
      <h1 className="text-5xl font-semibold mb-6 leading-tight">
        Course <span className="text-[var(--accent)]">Videos</span>
      </h1>
      <p className="text-neutral-400 max-w-xl text-lg leading-relaxed">
        Manage and organize your course video content.
      </p>
    </div>

    {/* ================= VIDEOS LIST ================= */}
    <div className="space-y-8">

      {videos.length === 0 ? (
        <div className="text-neutral-500 text-center py-16">
          No videos added yet.
        </div>
      ) : (
        videos.map((video, index) => (
          <div
            key={video._id}
            className="bg-[var(--bg-card)] p-8 rounded-3xl border border-white/10 hover:border-[var(--accent)]/40 transition"
          >

            {editing === video._id ? (
              <>
                <input
                  className="w-full p-4 mb-4 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  className="w-full p-4 mb-6 bg-neutral-900 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />

                <div className="flex gap-4">
                  <button
                    onClick={saveEdit}
                    className="px-6 py-2 bg-[var(--accent)] text-black rounded-full hover:opacity-90 transition"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditing(null)}
                    className="px-6 py-2 border border-white/10 rounded-full hover:border-white/30 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div>
                  <p className="text-lg font-semibold text-[var(--accent)] mb-2">
                    {index + 1}. {video.title}
                  </p>

                  <p className="text-xs text-neutral-400 break-all max-w-xl">
                    {video.videoUrl}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => startEdit(video)}
                    className="px-6 py-2 border border-white/10 rounded-full hover:border-[var(--accent)] transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => remove(video._id)}
                    className="px-6 py-2 border border-red-500/40 text-red-400 rounded-full hover:border-red-500 transition"
                  >
                    Delete
                  </button>
                </div>

              </div>
            )}

          </div>
        ))
      )}

    </div>

  </section>
);
}
