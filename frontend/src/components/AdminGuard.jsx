import AdminLogin from "../pages/admin/AdminLogin";

export default function AdminGuard({ children }) {
  const password = localStorage.getItem("adminPassword");

  if (!password) {
    return <AdminLogin />;
  }

  return children;
}
