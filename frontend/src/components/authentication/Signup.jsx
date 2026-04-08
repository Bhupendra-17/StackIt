import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CircleAlert,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/auth-context";

const passwordScore = (password) => {
  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  return Math.min(score, 4);
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = useMemo(() => passwordScore(formData.password), [formData.password]);

  const validate = () => {
    if (!formData.username.trim()) {
      return "Username is required.";
    }

    if (formData.username.trim().length < 3) {
      return "Username must be at least 3 characters.";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please provide a valid email address.";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await register(
      formData.username.trim(),
      formData.email.trim(),
      formData.password,
    );

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen app-bg app-page-grid flex items-center justify-center px-4 py-8">
      <div className="app-surface relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700/70 p-7 shadow-2xl sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative z-10">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300/70">Create Account</p>
          <h1 className="text-3xl font-heading font-semibold text-slate-100">Join StackIt</h1>
          <p className="mt-2 text-sm text-slate-300">Create your profile and start helping the community.</p>

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
                <UserRound className="h-4 w-4" />
                Username
              </span>
              <input
                type="text"
                value={formData.username}
                onChange={(event) =>
                  setFormData((state) => ({ ...state, username: event.target.value }))
                }
                required
                className="app-input h-11 w-full rounded-xl px-3"
                placeholder="Choose a display name"
              />
            </label>

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
                  placeholder="Use at least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className={`h-1.5 flex-1 rounded-full ${
                      level <= strength ? "bg-cyan-300" : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </label>

            <label className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4" />
                Confirm Password
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(event) =>
                    setFormData((state) => ({ ...state, confirmPassword: event.target.value }))
                  }
                  required
                  className="app-input h-11 w-full rounded-xl px-3 pr-10"
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="app-btn-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-cyan-200 transition hover:text-cyan-100">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

