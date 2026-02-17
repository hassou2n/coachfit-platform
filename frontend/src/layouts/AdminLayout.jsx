import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[var(--bg-card)] p-6">
        <h2 className="text-xl font-semibold mb-8 text-[var(--accent)]">
          Admin Panel
        </h2>

        <nav className="space-y-4 text-sm">
          <Link to="/admin" className="block hover:text-[var(--accent)]">
            Dashboard
          </Link>
           <Link to="/admin/codes" className="block hover:text-[var(--accent)]">
            Activation Codes
          </Link>
          <Link to="/admin/codes/list" className="block hover:text-[var(--accent)]">
  Codes List
</Link>
          <Link to="/admin/courses" className="block hover:text-[var(--accent)]">
            Courses
          </Link>
         
          <Link to="/admin/videos" className="block hover:text-[var(--accent)]">
Video
</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
