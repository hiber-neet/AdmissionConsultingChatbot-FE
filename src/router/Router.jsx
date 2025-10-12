// src/router/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPrivate from "../pages/login/LoginPrivate.jsx";

function Home() {
  return <h1 style={{ padding: 24 }}>Test</h1>;
}
function NotFound() {
  return <h1 style={{ padding: 24 }}>404</h1>;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/loginprivate" element={<LoginPrivate />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
