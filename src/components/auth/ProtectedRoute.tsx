// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/Auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // chuyển tới /login, nhớ vị trí cũ
    return <Navigate to="/loginforad" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}
