# Role-Based Access Control Implementation

## ✅ Completed Features

### **1. Role-Based Authentication & Routing**
- **Database Roles Supported**: 
  - `admin` → `SYSTEM_ADMIN` → `/admin/dashboard`
  - `content_manager` → `CONTENT_MANAGER` → `/content/dashboard`
  - `consultant` → `CONSULTANT` → `/consultant`
  - `admission_officer` → `ADMISSION_OFFICER` → `/admission/dashboard`
  - `student` → `STUDENT` → `/profile`

### **2. Permission System**
- **Student Permissions**: VIEW_PROFILE, EDIT_PROFILE, TAKE_RIASEC_TEST, etc.
- **Role Guards**: Automatic redirection based on user role
- **Permission Gates**: Pages check specific permissions before allowing access

### **3. Login Flow**
1. User logs in with email/password
2. FastAPI returns JWT token with role
3. JWT role is mapped to app role
4. User is redirected to appropriate dashboard:
   - **Students** → `/profile` (User Profile page)
   - **Admins** → `/admin/dashboard` (Admin Layout)
   - **Content Managers** → `/content/dashboard` (Content Layout)
   - **Consultants** → `/consultant` (Consultant Layout)
   - **Admission Officers** → `/admission/dashboard` (Admission Layout)

### **4. Route Protection**
- **Public Routes**: Home, Login, Chatbot, RIASEC
- **Student Only**: `/profile`
- **Staff Only**: `/admin/*`, `/content/*`, `/admission/*`, `/consultant`
- **Admin Only**: All `/admin/*` routes
- **Role-specific**: Each role can only access their designated areas

## 🔧 Components Created/Updated

### **Files Modified:**
- `src/contexts/Auth.tsx` - Added STUDENT role, role mapping, getDefaultRoute()
- `src/constants/permissions.ts` - Added student permissions and role definitions
- `src/components/auth/RoleGuard.tsx` - **NEW** - Comprehensive role/permission guard
- `src/router/Router.jsx` - Updated with role-based route protection
- `src/pages/login/LoginPrivate.jsx` - Added role-based redirect after login
- `src/pages/loginForAd/LoginPage.tsx` - Added role-based redirect after login

### **New Role Guards Available:**
```tsx
<AdminGuard>              // SYSTEM_ADMIN only
<ContentManagerGuard>     // CONTENT_MANAGER + SYSTEM_ADMIN
<ConsultantGuard>         // CONSULTANT + SYSTEM_ADMIN  
<AdmissionOfficerGuard>   // ADMISSION_OFFICER + SYSTEM_ADMIN
<StudentGuard>            // STUDENT only
<StaffGuard>              // All staff roles (excludes students)
<RoleGuard allowedRoles={["STUDENT", "CONTENT_MANAGER"]} requiredPermission="VIEW_PROFILE">
```

## 🧪 Testing the System

### **Test Accounts (Demo Mode):**
```javascript
// Use loginAs() function for quick testing:
const { loginAs } = useAuth();

loginAs("SYSTEM_ADMIN");    // → /admin/dashboard
loginAs("CONTENT_MANAGER"); // → /content/dashboard  
loginAs("CONSULTANT");      // → /consultant
loginAs("ADMISSION_OFFICER"); // → /admission/dashboard
loginAs("STUDENT");         // → /profile
```

### **Real API Testing:**
```bash
# Students will be redirected to /profile
POST /auth/login
{
  "email": "student@example.com", 
  "password": "password"
}

# Admins will be redirected to /admin/dashboard  
POST /auth/login
{
  "email": "admin@example.com",
  "password": "password" 
}
```

## 🚨 Security Features

### **Route Protection:**
- Unauthenticated users → Redirect to login
- Wrong role → Redirect to their default dashboard
- Missing permissions → Redirect to their default dashboard

### **Permission Gates:**
- Each route checks both role AND permissions
- System Admin has access to all routes
- Other roles are restricted to their specific areas
- Students can only access profile and public pages

## 📝 Usage Examples

### **Protecting a New Route:**
```tsx
// Allow only admins
<Route path="/sensitive" element={
  <AdminGuard>
    <SensitivePage />
  </AdminGuard>
} />

// Allow multiple roles
<Route path="/shared" element={
  <RoleGuard allowedRoles={["CONTENT_MANAGER", "CONSULTANT"]}>
    <SharedPage />
  </RoleGuard>
} />

// Require specific permission
<Route path="/special" element={
  <RoleGuard requiredPermission="MANAGE_ARTICLES">
    <SpecialPage />
  </RoleGuard>
} />
```

### **Checking Permissions in Components:**
```tsx
const { hasPermission, user } = useAuth();

if (hasPermission("DELETE_ARTICLE")) {
  return <DeleteButton />;
}

if (user?.role === "STUDENT") {
  return <StudentView />;
}
```

The role-based access control system is now fully implemented and ready for testing! 🎉