import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/index.api.ts";
// import { useAuth } from "../../context/AuthContext.tsx";
import { showToast } from "../../components/common/SharedUI/SharedUI";
import "./Auth.css";

// ── SIGNUP ────────────────────────────────────────────────
export function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "", role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: keyof typeof form, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("All fields are required."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    try {
      setLoading(true);
      setError("");

      // POST /auth/signup  →  returns User object (no token)
      await authApi.signup(form.name, form.email, form.password, form.role);

      showToast("Account created! Please sign in. 🎬");

      // Spec: redirect to Login after signup
      navigate("/login", { replace: true });
    } catch (e: any) {
      setError(e.message ?? "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="grain" />
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />

      <div className="auth-card auth-card-lg anim-fadeup">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎬</div>
          <span className="auth-logo-text">CINEVERSE</span>
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join millions of movie lovers</p>

        <div className="auth-form">
          {error && <div className="auth-error">⚠ {error}</div>}

          <div className="field">
            <label>Full Name</label>
            <div className="input-icon-wrap">
              <span className="input-icon">👤</span>
              <input
                className="input"
                placeholder="John Doe"
                value={form.name}
                onChange={e => set("name", e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <div className="input-icon-wrap">
              <span className="input-icon">✉</span>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set("email", e.target.value)}
              />
            </div>
          </div>

          <div className="auth-row-2">
            <div className="field">
              <label>Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={e => set("confirm", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Role selector */}
          <div className="field">
            <label>I am a…</label>
            <div className="role-selector">
              {(["CUSTOMER", "CLIENT"] as const).map(r => (
                <button
                  key={r}
                  className={`role-btn ${form.role === r ? "active" : ""}`}
                  onClick={() => set("role", r)}
                >
                  <span className="role-btn-icon">
                    {r === "CUSTOMER" ? "🎟" : "🏛"}
                  </span>
                  <span className="role-btn-title">
                    {r === "CUSTOMER" ? "Movie Goer" : "Theatre Owner"}
                  </span>
                  <span className="role-btn-sub">
                    {r === "CUSTOMER" ? "Book tickets" : "Manage theatres & shows"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <span className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} />
              : "Create Account →"}
          </button>
        </div>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// ── RESET PASSWORD ────────────────────────────────────────
export function ResetPasswordPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    oldPassword: "", newPassword: "", confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: keyof typeof form, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirm) {
      setError("All fields are required."); return;
    }
    if (form.newPassword !== form.confirm) {
      setError("New passwords do not match."); return;
    }
    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    try {
      setLoading(true);
      setError("");

      // PATCH /auth/resetPassword  — token auto-attached by Axios interceptor
      await authApi.resetPassword(form.oldPassword, form.newPassword);

      showToast("Password updated successfully! 🔑");
      navigate("/movies");
    } catch (e: any) {
      setError(e.message ?? "Reset failed. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="grain" />
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />

      <div className="auth-card anim-fadeup">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎬</div>
          <span className="auth-logo-text">CINEVERSE</span>
        </div>

        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-sub">Choose a new strong password</p>

        <div className="auth-form">
          {error && <div className="auth-error">⚠ {error}</div>}

          {([
            { key: "oldPassword", label: "Current Password" },
            { key: "newPassword", label: "New Password" },
            { key: "confirm",     label: "Confirm New Password" },
          ] as const).map(f => (
            <div key={f.key} className="field">
              <label>{f.label}</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔑</span>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
              </div>
            </div>
          ))}

          <button
            className="btn btn-primary btn-full btn-lg auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <span className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} />
              : "Reset Password →"}
          </button>
        </div>

        <p className="auth-switch" style={{ marginTop: 20 }}>
          <Link to="/movies">← Back to Movies</Link>
        </p>
      </div>
    </div>
  );
}

// // needed import for ResetPasswordPage
// import { authApi } from "../../api";