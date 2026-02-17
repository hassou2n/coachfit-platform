import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-neutral-800 p-6 space-y-6">
      <h2 className="text-2xl font-bold">Admin</h2>

      <nav className="flex flex-col space-y-3 text-sm">
        <Link to="/admin" className="hover:text-white">Dashboard</Link>
        <Link to="/admin/courses" className="hover:text-white">Courses</Link>
        <Link to="/admin/codes" className="hover:text-white">Activation Codes</Link>
      </nav>
    </aside>
  );
}
