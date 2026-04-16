"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

const ROLES = [
  { value: "HEAD_OF_UNIT", label: "Head of Unit", desc: "Unit commander with full platform access" },
  { value: "OFFICER", label: "Staff", desc: "Investigates cases and logs intelligence" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "" });

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.role) {
      setError("All fields are required."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); return; }
      setStep(2);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a1c35 0%, #0d2747 60%, #0a1c35 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "40px 20px",
    }}>
      <style>{`
        @keyframes sealIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        .reg-input {
          width: 100%; background: white;
          border: 1.5px solid #dde5ee; border-radius: 4px;
          padding: 13px 14px; font-size: 13px; color: #0B1F3A;
          outline: none; box-sizing: border-box;
          font-family: 'Segoe UI', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .reg-input:focus {
          border-color: #1A5FA8;
          box-shadow: 0 0 0 3px rgba(26,95,168,0.10);
        }
        .reg-input::placeholder { color: #b0c0cf; }
        .role-card {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px; padding: 11px 13px;
          cursor: pointer; transition: all 0.15s;
          background: rgba(255,255,255,0.03); text-align: left;
        }
        .role-card:hover { border-color: #4a90d9; background: rgba(74,144,217,0.08); }
        .role-card.selected { border-color: #1A5FA8; background: rgba(26,95,168,0.15); }
        .submit-btn {
          width: 100%; background: #1A5FA8; color: white; border: none;
          padding: 14px; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: 'Segoe UI', sans-serif;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 4px; transition: background 0.2s, transform 0.1s;
          margin-top: 4px;
        }
        .submit-btn:hover:not(:disabled) { background: #154d8a; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .text-link {
          background: none; border: none; color: #5a7a9a;
          font-size: 12px; cursor: pointer;
          font-family: 'Segoe UI', sans-serif;
          transition: color 0.15s; padding: 0;
        }
        .text-link:hover { color: #4a90d9; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 500, textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 1s cubic-bezier(.4,0,.2,1), transform 1s cubic-bezier(.4,0,.2,1)",
      }}>

        {/* Seal */}
        <div style={{
          marginBottom: 20,
          opacity: visible ? 1 : 0,
          animation: visible ? "sealIn 0.6s cubic-bezier(.4,0,.2,1) 0.1s both" : "none",
        }}>
          <div style={{
            width: 90, height: 90, borderRadius: "50%", background: "white",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35), 0 0 0 4px rgba(255,255,255,0.06)",
          }}>
            <img src="/csa-logo.png" alt="CSA"
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Title */}
        <div style={{ fontSize: 28, fontWeight: 900, color: "white", letterSpacing: "0.2em", marginBottom: 8 }}>LELU</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#4a7aaa", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 28 }}>
          Law Enforcement and Liaison Unit
        </div>

        {step === 1 ? (
          <div style={{
            background: "rgba(11, 28, 52, 0.7)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 10, padding: "30px 32px 28px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)",
            textAlign: "left",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#4a90d9", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 22, textAlign: "center" }}>
              Create an Account
            </div>

            {/* Name + Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "#4a6a8a", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Full Name *</div>
                <input className="reg-input" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name" />
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#4a6a8a", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Email Address *</div>
                <input className="reg-input" type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@csa.gov.gh" />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, color: "#4a6a8a", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Password *</div>
                <div style={{ position: "relative" }}>
                  <input className="reg-input" type={showPassword ? "text" : "password"}
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters" style={{ paddingRight: 38 }} />
                  <button onClick={() => setShowPassword(!showPassword)} style={{
                    position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#a0b4c8", padding: 0,
                  }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#4a6a8a", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Confirm Password *</div>
                <input className="reg-input" type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat password" />
              </div>
            </div>

            {/* Role */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, color: "#4a6a8a", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Your Role *</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ROLES.map(r => (
                  <div key={r.value} className={`role-card ${form.role === r.value ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, role: r.value })}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <div style={{
                        width: 11, height: 11, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${form.role === r.value ? "#4a90d9" : "#2a4a6b"}`,
                        background: form.role === r.value ? "#4a90d9" : "transparent",
                        transition: "all 0.15s",
                      }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: form.role === r.value ? "white" : "#7a9bbf" }}>
                        {r.label}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "#3a5a7a", lineHeight: 1.5, paddingLeft: 19 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(192,57,43,0.12)", border: "1px solid rgba(192,57,43,0.25)",
                borderRadius: 4, padding: "9px 12px", marginBottom: 14,
                fontSize: 12, color: "#e8837a", lineHeight: 1.55,
              }}>{error}</div>
            )}

            <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit for Approval"}
            </button>

            <div style={{ textAlign: "center", marginTop: 18 }}>
              <button className="text-link" onClick={() => router.push("/login")}>
                Already have an account? <span style={{ color: "#4a90d9", fontWeight: 600 }}>Sign in</span>
              </button>
            </div>
          </div>

        ) : (
          // Success
          <div style={{
            background: "rgba(11, 28, 52, 0.7)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 10, padding: "48px 36px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            animation: "sealIn 0.5s cubic-bezier(.4,0,.2,1) both",
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              border: "2px solid #1A7A4A",
              background: "rgba(26,122,74,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <CheckCircle size={28} color="#1A7A4A" strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 10, letterSpacing: "0.05em" }}>
              Registration Submitted
            </div>
            <div style={{ fontSize: 13, color: "#7a9bbf", lineHeight: 1.8, marginBottom: 16 }}>
              Your account request has been sent to the Head of Unit for approval.
            </div>
            <div style={{ fontSize: 12, color: "#3a5a7a", lineHeight: 1.7, marginBottom: 32, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4 }}>
              Once approved, return to the login page and sign in with your registered email and password.
            </div>
            <button onClick={() => router.push("/login")} style={{
              background: "#1A5FA8", color: "white", border: "none",
              padding: "13px 44px", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
              letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: 4,
              transition: "background 0.2s",
            }}>
              Go to Login
            </button>
          </div>
        )}

        <div style={{ marginTop: 24, fontSize: 9.5, color: "#e3e4e6", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Cyber Security Authority · Restricted Access
        </div>
      </div>
    </div>
  );
}