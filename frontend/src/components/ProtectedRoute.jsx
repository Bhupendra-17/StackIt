import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/auth-context";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen app-bg app-page-grid flex items-center justify-center px-6">
        <div className="app-surface w-full max-w-sm p-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-300 animate-spin" />
          <p className="text-slate-200">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

