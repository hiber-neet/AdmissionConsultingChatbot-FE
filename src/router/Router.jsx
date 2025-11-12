// src/router/Router.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPrivate from "../pages/login/LoginPrivate.jsx";
import { AdminPage } from "../pages/admin/AdminPage.tsx";
import UserProfile from "../pages/profile/UserProfile.jsx";
import Home from "../pages/home/Home.jsx";
import { ConsulantPage } from "../pages/consulant/ConsulantPage.tsx";
import { AdmissionPage } from "../pages/admission/AdmissionPage.tsx";
import { ContentManagerPage } from "../pages/contentManager/ContentManagerPage.tsx";
import LoginPage from "../pages/loginForAd/LoginPage.tsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.tsx";
import { AdminLayout } from "../components/admin/AdminLayout.jsx";
import RiasecPage from "../pages/riasec/RiasecPage.jsx";
import ChatGuestPage from "../pages/chatbot/ChatGuestPage.jsx";

function NotFound() {
  return <h1 style={{ padding: 24 }}>404</h1>;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/loginprivate" element={<LoginPrivate />} />
      {/* <Route path="/admin" element={<AdminPage />} /> */}
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/consultant" element={<ConsulantPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
      <Route path="/admission" element={<AdmissionPage />} />
      <Route path="/content" element={<ContentManagerPage />} />
      <Route path="/loginforad" element={<LoginPage />} />
<Route path="/chatbot" element={<ChatGuestPage />} />
      
 
<Route path="/riasec" element={<RiasecPage />} />
 
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/loginforad" replace />} />

    </Routes>
  );
}