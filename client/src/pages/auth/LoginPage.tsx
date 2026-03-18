import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/index.api.ts";
import { useAuth } from "../../context/AuthContext";
// import { showToast } from "../../components/common/SharedUI/SharedUI.tsx";
import type { User } from "../../types/movie.types.ts";
import "./Auth.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    try {
      setLoading(true);
      setError("");

      const { token, user: rawUser } = await authApi.signin(form.email, form.password);

      // ── Normalize backend fields to frontend User type ──
      // Backend sends: { id, name, email, role: userRole, status: userStatus }
      // userRole   → already mapped as "role" in signin response
      // userStatus → already mapped as "status" in signin response
      // BUT values are UPPERCASE: "APPROVED", "PENDING", "CLIENT" etc.
      const user: User = {
        id:     (rawUser as any).id ?? (rawUser as any)._id ?? "",
        _id:    (rawUser as any).id ?? (rawUser as any)._id ?? "",
        name:   rawUser.name,
        email:  rawUser.email,
        userRole:   String((rawUser as any).role   ?? (rawUser as any).userRole   ?? "CUSTOMER").toUpperCase().trim() as User["userRole"],
        userStatus: String((rawUser as any).status ?? (rawUser as any).userStatus ?? "PENDING").toUpperCase().trim()  as User["userStatus"],
      };

      console.log("✅ user:", user);

      login(token, user);

      const role = user.userRole;
      const dest = (role === "ADMIN" || role === "CLIENT") ? "/dashboard" : "/movies";

      setTimeout(() => navigate(dest, { replace: true }), 50);

    } catch (e: any) {
      // Backend throws 403 for pending users — show friendly message
      if (e.message?.includes("not approved") || e.message?.includes("403")) {
        setError("Your account is pending admin approval. Please wait.");
      } else {
        setError(e.message ?? "Login failed.");
      }
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

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to book your next experience</p>

        <div className="auth-form">
          {error && <div className="auth-error">⚠ {error}</div>}

          <div className="field">
            <label>Email</label>
            <div className="input-icon-wrap">
              <span className="input-icon">✉</span>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => set("email", e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="input-icon-wrap">
              <span className="input-icon">🔒</span>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => set("password", e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
          </div>

          <button className="btn btn-primary btn-full btn-lg auth-submit"
            onClick={handleSubmit} disabled={loading}>
            {loading
              ? <span className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} />
              : "Sign In →"}
          </button>
        </div>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-switch">
          New to Cineverse? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}