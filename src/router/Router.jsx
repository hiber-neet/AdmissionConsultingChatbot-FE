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
import { AdmissionOfficerLayout } from "../components/admission/AdmissionOfficerLayout.jsx";
import { AdmissionDashboard } from "../components/admission/AdmissionDashboard.jsx";
import { RequestQueuePage } from "../components/admission/RequestQueuePage.jsx";
import { LiveChatView } from "../components/admission/chat/LiveChatView.jsx";
import { KnowledgeBaseViewer } from "../components/admission/knowledgebase/KnowledgeBaseViewer.jsx";
import { StudentListPage } from "../components/admission/StudentListPage.jsx";
import { StudentProfilePage } from "../components/admission/StudentProfilePage.jsx";
import { StudentInsights } from "../components/admission/StudentInsights.jsx";
import ContentManagerLayOut from "../components/content/ContentManagerLayOut.tsx";
import { ContentManagerDashboardPage } from "../components/content/ContentManagerDashboardPage.tsx";
import { AllArticlesPage } from "../components/content/AllArticlesPage.tsx";
import ReviewQueue from "../components/content/ReviewQueue.tsx";
import { ArticleEditorPage } from "../components/content/ArticleEditorPage.tsx";
import RiasecManagement from "../components/content/PersonalityTest/RiasecManagement.jsx";

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
      <Route path="/admission" element={<AdmissionOfficerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdmissionDashboard />} />
        <Route path="request-queue" element={<RequestQueuePage />} />
        <Route path="consultation" element={<LiveChatView />} />
        <Route path="knowledge-base" element={<KnowledgeBaseViewer />} />
        <Route path="students" element={<StudentListPage />} />
        <Route path="students/:studentId" element={<StudentProfilePage />} />
        <Route path="insights" element={<StudentInsights />} />
      </Route>
      <Route path="/content" element={<ContentManagerLayOut />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ContentManagerDashboardPage />} />
        <Route path="articles" element={<AllArticlesPage />} />
        <Route path="review" element={<ReviewQueue />} />
        <Route path="editor" element={<ArticleEditorPage />} />
        <Route path="riasec" element={<RiasecManagement />} />
      </Route>
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