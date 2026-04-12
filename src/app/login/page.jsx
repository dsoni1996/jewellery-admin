"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gem, Eye, EyeOff, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

const S = `
.login-root { min-height:100vh; background:var(--dark2); display:flex; align-items:center; justify-content:center; padding:20px; position:relative; overflow:hidden; font-family:var(--font-sans); }
.login-root::before { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF6A' fill-opacity='0.04'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3C/g%3E%3C/svg%3E"); }
.login-card { background:var(--white); border-radius:var(--radius); width:100%; max-width:420px; padding:40px; position:relative; z-index:1; box-shadow:0 32px 80px rgba(0,0,0,0.35); }
.login-logo { display:flex; align-items:center; gap:12px; margin-bottom:32px; }
.login-logo-icon { width:44px; height:44px; background:var(--dark); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--gold-light); }
.login-logo-name { font-family:var(--font-serif); font-size:24px; font-weight:600; letter-spacing:4px; color:var(--dark); text-transform:uppercase; }
.login-logo-name span { color:var(--gold); }
.login-logo-badge { font-size:9px; letter-spacing:2px; color:var(--gold); background:var(--gold-pale); border:1px solid rgba(184,134,42,0.3); padding:3px 9px; border-radius:2px; margin-top:2px; display:block; }
.login-title { font-family:var(--font-serif); font-size:28px; font-weight:400; color:var(--dark); margin-bottom:6px; }
.login-title em { font-style:italic; color:var(--gold); }
.login-sub { font-size:12.5px; color:var(--text3); margin-bottom:28px; }
.login-gold-line { height:1px; background:linear-gradient(90deg,transparent,var(--gold-light) 50%,transparent); margin-bottom:24px; }
.login-field { margin-bottom:16px; }
.login-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--text3); display:block; margin-bottom:6px; }
.login-input-wrap { position:relative; }
.login-input { width:100%; border:1px solid var(--border); padding:11px 14px; font-size:13.5px; color:var(--dark); font-family:var(--font-sans); outline:none; border-radius:var(--radius); transition:border-color .2s; background:var(--bg); }
.login-input:focus { border-color:var(--gold); background:var(--white); }
.login-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text3); display:flex; transition:color .2s; }
.login-eye:hover { color:var(--gold); }
.login-btn { width:100%; background:var(--dark); color:var(--gold-light); border:none; padding:13px; font-family:var(--font-sans); font-size:11px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; cursor:pointer; border-radius:var(--radius); transition:background .2s; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:8px; }
.login-btn:hover:not(:disabled) { background:var(--brown); }
.login-btn:disabled { opacity:.6; cursor:not-allowed; }
.login-error { background:var(--red-bg); color:var(--red); font-size:12.5px; padding:10px 14px; border-radius:var(--radius); margin-bottom:14px; border:1px solid rgba(153,60,29,.2); }
.login-hint { margin-top:20px; padding-top:16px; border-top:1px solid var(--border); font-size:11.5px; color:var(--text3); }
.login-hint strong { color:var(--text2); }
`;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ phone: "", password: "" });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { token, user } = await api.auth.login(form);
      if (user.role !== "admin") throw new Error("Access denied — admin only");
      localStorage.setItem("admin_token", token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="login-root">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon"><Gem size={18} /></div>
            <div>
              <div className="login-logo-name">MAN<span>A</span>S</div>
              <span className="login-logo-badge">ADMIN PANEL</span>
            </div>
          </div>

          <h1 className="login-title">Welcome <em>Back</em></h1>
          <p className="login-sub">Sign in to manage your jewellery store</p>
          <div className="login-gold-line" />

          {error && <div className="login-error">⚠ {error}</div>}

          <form onSubmit={submit}>
            <div className="login-field">
              <label className="login-label">Phone Number</label>
              <input className="login-input" placeholder="9000000000" value={form.phone} onChange={set("phone")} required />
            </div>
            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <input
                  className="login-input"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  required
                  style={{ paddingRight: 40 }}
                />
                <button type="button" className="login-eye" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button className="login-btn" disabled={loading}>
              {loading ? <><Loader2 size={14} className="loader-spin" /> Signing in…</> : "Sign In →"}
            </button>
          </form>

          <div className="login-hint">
            <strong>Demo credentials</strong><br />
            Phone: 9000000000 &nbsp;·&nbsp; Password: Admin@123
          </div>
        </div>
      </div>
    </>
  );
}
