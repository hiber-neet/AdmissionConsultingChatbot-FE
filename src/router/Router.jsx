// src/router/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPrivate from "../pages/login/LoginPrivate.jsx";
import { AdminPage } from "../pages/admin/AdminPage.tsx";
import UserProfile from "../pages/profile/UserProfile.jsx";
import Home from "../pages/home/Home.jsx";
 
function NotFound() {
  return <h1 style={{ padding: 24 }}>404</h1>;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/loginprivate" element={<LoginPrivate />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}