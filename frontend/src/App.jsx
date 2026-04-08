import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import { useAuth } from "./components/context/auth-context";
import HomePage from "./components/home/HomePage";
import SignupPage from "./components/authentication/Signup";
import LoginPage from "./components/authentication/Login";
import AskQue from "./components/QnA/AskQue";
import ProfilePage from "./components/profile/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const NotFoundPage = () => (
  <div className="min-h-screen app-bg app-page-grid flex items-center justify-center px-6">
    <div className="app-surface w-full max-w-lg text-center p-8 sm:p-10">
      <p className="text-sm uppercase tracking-[0.18em] text-cyan-300/70 mb-3">404</p>
      <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-slate-100 mb-3">
        We Couldn&apos;t Find That Page
      </h1>
      <p className="text-slate-300 mb-6">
        The link may be outdated, or the page may have moved.
      </p>
      <a href="/" className="app-btn-primary inline-flex px-6 py-3 rounded-xl font-medium">
        Go To Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignupPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/ask"
            element={
              <ProtectedRoute>
                <AskQue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

