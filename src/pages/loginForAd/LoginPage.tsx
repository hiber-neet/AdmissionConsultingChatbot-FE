// src/components/auth/LoginPage.tsx
import { useState } from "react";
import { useAuth, type Role } from "@/contexts/Auth";
import { Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import bgImage from "@/assets/images/toiyeufpt.jpg";

export default function LoginPage() {
  const { login, getDefaultRoute, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (!res.ok) {
      setErr(res.message || "Đăng nhập thất bại");
      return;
    }
    
    // After successful login, get the user from Auth context and navigate to their default route
    // Use a small delay to ensure the Auth context has been updated
    setTimeout(() => {
      // Get user from Auth context instead of sessionStorage
      const authToken = localStorage.getItem("access_token");
      if (authToken) {
        try {
          // Decode JWT token to get user role
          const payload = JSON.parse(atob(authToken.split(".")[1]));
          const userEmail = payload.sub;
          
          // Map email to role (same logic as Auth context)
          let userRole: Role = "Student"; // default fallback
          if (userEmail.includes('admin')) {
            userRole = "Admin";
          } else if (userEmail.includes('consultant')) {
            userRole = "Consultant";
          } else if (userEmail.includes('content')) {
            userRole = "Content Manager";
          } else if (userEmail.includes('officer')) {
            userRole = "Admission Official";
          }
          
          const defaultRoute = getDefaultRoute(userRole);
          console.log(`Redirecting ${userRole} to ${defaultRoute}`);
          navigate(defaultRoute, { replace: true });
        } catch (error) {
          console.error('Error parsing token:', error);
          navigate("/", { replace: true });
        }
      } else {
        // Fallback to home if no token
        navigate("/", { replace: true });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-cover bg-center p-4"
    style={{
    backgroundImage: `url(${bgImage})`,
  }}
  
  >
      <div className="w-full max-w-md bg-white rounded-2xl shadow border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-orange-600" />
          <div>
            <div className="text-lg font-semibold text-[#f97316]">Admin & Staff Login</div>
            <div className="text-xs text-gray-500">FPT Platform</div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {err && <div className="text-sm text-red-600">{err}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f97316] text-white rounded-md py-2.5 text-sm hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

      </div>
    </div>
  );
}