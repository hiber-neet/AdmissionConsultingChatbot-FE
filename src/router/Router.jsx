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
import RoleGuard, { AdminGuard, ContentManagerGuard, ConsultantGuard, AdmissionOfficerGuard, StudentGuard, StaffGuard } from "../components/auth/RoleGuard.tsx";
import { AdminLayout } from "../components/admin/AdminLayout.jsx";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage.tsx";
import { QATemplateManagerPage } from "../pages/admin/QATemplateManagerPage.tsx";
import { UserManagementPage } from "../pages/admin/UserManagementPage.tsx";
import { ActivityLogPage } from "../pages/admin/ActivityLogPage.tsx";
import { AdminAdmissionDashboardPage } from "../pages/admin/AdminAdmissionDashboardPage.tsx";
import { AdminConsultationPage } from "../pages/admin/AdminConsultationPage.tsx";
import { AdminStudentInsightsPage } from "../pages/admin/AdminStudentInsightsPage.tsx";
import { AdminConsultantDashboardPage } from "../pages/admin/AdminConsultantDashboardPage.tsx";
import { AdminAnalyticsPage } from "../pages/admin/AdminAnalyticsPage.tsx";
import { AdminKnowledgeBasePage } from "../pages/admin/AdminKnowledgeBasePage.tsx";
import { AdminContentOptimizationPage } from "../pages/admin/AdminContentOptimizationPage.tsx";
import { AdminContentManagerDashboardPage } from "../pages/admin/AdminContentManagerDashboardPage.tsx";
import { AdminAllArticlesPage } from "../pages/admin/AdminAllArticlesPage.tsx";
import { AdminReviewQueuePage } from "../pages/admin/AdminReviewQueuePage.tsx";
import { AdminArticleEditorPage } from "../pages/admin/AdminArticleEditorPage.tsx";
import RiasecPage from "../pages/riasec/RiasecPage.jsx";
import ChatGuestPage from "../pages/chatbot/ChatGuestPage.jsx";
import { ManagerProfilePage } from "../pages/manager/ManagerProfilePage.tsx";
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
import ArticlePage from "../pages/article/ArticlePage.jsx";
function NotFound() {
  return <h1 style={{ padding: 24 }}>404</h1>;
}

export default function Router() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/loginprivate" element={<LoginPrivate />} />
      <Route path="/loginforad" element={<LoginPage />} />
      <Route path="/chatbot" element={<ChatGuestPage />} />
      <Route path="/riasec" element={<RiasecPage />} />
      <Route path="/articles" element={<ArticlePage />} />
      <Route path="/404" element={<NotFound />} />
      
      {/* Student-only routes */}
      <Route path="/profile" element={
        <StudentGuard>
          <UserProfile />
        </StudentGuard>
      } />
      
      {/* Consultant routes */}
      <Route path="/consultant" element={
        <ConsultantGuard>
          <ConsulantPage />
        </ConsultantGuard>
      } />
      
      {/* Admission Officer routes */}
      <Route path="/admission" element={
        <AdmissionOfficerGuard>
          <AdmissionOfficerLayout />
        </AdmissionOfficerGuard>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdmissionDashboard />} />
        <Route path="request-queue" element={<RequestQueuePage />} />
        <Route path="consultation" element={<LiveChatView />} />
        <Route path="knowledge-base" element={<KnowledgeBaseViewer />} />
        <Route path="students" element={<StudentListPage />} />
        <Route path="students/:studentId" element={<StudentProfilePage />} />
        <Route path="insights" element={<StudentInsights />} />
        <Route path="profile" element={<ManagerProfilePage />} />
      </Route>
      
      {/* Content Manager routes */}
      <Route path="/content" element={
        <ContentManagerGuard>
          <ContentManagerLayOut />
        </ContentManagerGuard>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ContentManagerDashboardPage />} />
        <Route path="articles" element={<AllArticlesPage />} />
        <Route path="review" element={<ReviewQueue />} />
        <Route path="editor" element={<ArticleEditorPage />} />
        <Route path="riasec" element={<RiasecManagement />} />
        <Route path="profile" element={<ManagerProfilePage />} />
      </Route>
      
      {/* Admin routes - Only for System Admins */}
      <Route path="/admin" element={
        <AdminGuard>
          <AdminLayout />
        </AdminGuard>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* Core Admin Routes */}
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="templates" element={<QATemplateManagerPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="activity" element={<ActivityLogPage />} />
        {/* Admission Management Routes */}
        <Route path="admissions" element={<AdminAdmissionDashboardPage />} />
        <Route path="content" element={<AdminContentManagerDashboardPage />} />
        <Route path="consultation" element={<AdminConsultationPage />} />
        <Route path="insights" element={<AdminStudentInsightsPage />} />
        {/* Consultant Management Routes */}
        <Route path="overview" element={<AdminConsultantDashboardPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="knowledge" element={<AdminKnowledgeBasePage />} />
        <Route path="optimization" element={<AdminContentOptimizationPage />} />
        {/* Content Management Routes */}
        <Route path="dashboardcontent" element={<AdminContentManagerDashboardPage />} />
        <Route path="articles" element={<AdminAllArticlesPage />} />
        <Route path="review" element={<AdminReviewQueuePage />} />
        <Route path="editor" element={<AdminArticleEditorPage />} />
        <Route path="profile" element={<ManagerProfilePage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}