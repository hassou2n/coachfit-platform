import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import Layout from "./layouts/Layout";
import SubscriptionGuard from "./components/SubscriptionGuard";
import AdminLayout from "./layouts/AdminLayout";
import AdminGuard from "./components/AdminGuard";

/* ========= Lazy Pages ========= */

const Home = lazy(() => import("./pages/Home"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const Activate = lazy(() => import("./pages/Activate"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const CourseVideos = lazy(() => import("./pages/CourseVideos"));

/* ========= Admin ========= */

const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const AdminCodes = lazy(() => import("./pages/admin/AdminCodes"));
const AdminCodesList = lazy(() => import("./pages/admin/AdminCodesList"));
const AdminVideos = lazy(() => import("./pages/admin/AdminVideos"));
const AdminCourseVideos = lazy(() => import("./pages/admin/AdminCourseVideos"));
const AdminCourseDetails = lazy(() => import("./pages/admin/AdminCourseDetails"));

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
          <Routes>

            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/activate" element={<Activate />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Course Videos */}
            <Route
              path="/courses/:id/videos"
              element={
                <SubscriptionGuard>
                  <CourseVideos />
                </SubscriptionGuard>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <AdminHome />
                  </AdminLayout>
                </AdminGuard>
              }
            />

            <Route
              path="/admin/courses"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <AdminCourses />
                  </AdminLayout>
                </AdminGuard>
              }
            />

            <Route
              path="/admin/videos"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <AdminVideos />
                  </AdminLayout>
                </AdminGuard>
              }
            />

            <Route
              path="/admin/courses/:id"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <AdminCourseDetails />
                  </AdminLayout>
                </AdminGuard>
              }
            />

            <Route
              path="/admin/courses/:id/videos"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <AdminCourseVideos />
                  </AdminLayout>
                </AdminGuard>
              }
            />

            <Route
              path="/admin/codes"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <AdminCodes />
                  </AdminLayout>
                </AdminGuard>
              }
            />

            <Route
              path="/admin/codes/list"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <AdminCodesList />
                  </AdminLayout>
                </AdminGuard>
              }
            />

          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
