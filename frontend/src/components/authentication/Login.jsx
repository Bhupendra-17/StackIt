import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleAlert, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/auth-context";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo =
    location.state?.from?.pathname && location.state?.from?.pathname !== "/login"
      ? `${location.state.from.pathname}${location.state.from.search || ""}`
      : "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen app-bg app-page-grid flex items-center justify-center px-4 py-8">
      <div className="app-surface relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700/70 p-7 shadow-2xl sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative z-10">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300/70">Welcome Back</p>
          <h1 className="text-3xl font-heading font-semibold text-slate-100">Log in to StackIt</h1>
          <p className="mt-2 text-sm text-slate-300">Jump back into your Q&A workspace.</p>

          {error && (
            <div className="mt-5 rounded-xl border border-rose-300/40 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-100">
              <span className="inline-flex items-center gap-2">
                <CircleAlert className="h-4 w-4" />
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-sm text-slate-300">
                <Mail className="h-4 w-4" />
                Email
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((state) => ({ ...state, email: event.target.value }))
                }
                required
                className="app-input h-11 w-full rounded-xl px-3"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-sm text-slate-300">
                <LockKeyhole className="h-4 w-4" />
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((state) => ({ ...state, password: event.target.value }))
                  }
                  required
                  className="app-input h-11 w-full rounded-xl px-3 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="app-btn-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-cyan-200 transition hover:text-cyan-100">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

