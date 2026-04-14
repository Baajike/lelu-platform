"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your credentials."); return; }
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      if (res?.error === "PENDING_APPROVAL") {
        setError("Your account is pending approval by the Head of Unit. Please check back later.");
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a1c35 0%, #0d2747 60%, #0a1c35 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: 20,
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sealIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        .login-input {
          width: 100%; background: white;
          border: 1.5px solid #dde5ee; border-radius: 4px;
          padding: 13px 42px 13px 14px;
          font-size: 13px; color: #0B1F3A;
          outline: none; box-sizing: border-box;
          font-family: 'Segoe UI', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          border-color: #1A5FA8;
          box-shadow: 0 0 0 3px rgba(26,95,168,0.10);
        }
        .login-input::placeholder { color: #b0c0cf; font-size: 13px; }
        .login-btn {
          width: 100%; background: #1A5FA8; color: white; border: none;
          padding: 14px; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: 'Segoe UI', sans-serif;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 4px; transition: background 0.2s, transform 0.1s;
        }
        .login-btn:hover:not(:disabled) { background: #1550909; }
        .login-btn:active:not(:disabled) { transform: scale(0.99); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .text-link {
          background: none; border: none;
          color: #5a7a9a; font-size: 12px;
          cursor: pointer; font-family: 'Segoe UI', sans-serif;
          transition: color 0.15s; padding: 0;
        }
        .text-link:hover { color: #1A5FA8; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 420,
        textAlign: "center",
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
        <div style={{
          fontSize: 28, fontWeight: 900, color: "white",
          letterSpacing: "0.2em", marginBottom: 8,
        }}>LELU</div>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "#4a7aaa",
          letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 28,
        }}>Law Enforcement and Liaison Unit</div>

        {/* Box */}
        <div style={{
          background: "rgba(11, 28, 52, 0.7)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 10,
          padding: "30px 32px 28px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          {/* Box title */}
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#4a90d9",
            letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 22,
          }}>Account Login</div>

          {/* Email */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input className="login-input" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Email Address" />
            <span style={{
              position: "absolute", right: 13, top: "50%",
              transform: "translateY(-50%)",
              color: "#27ae60", fontSize: 15, pointerEvents: "none",
            }}>✉</span>
          </div>

          {/* Password */}
          <div style={{ position: "relative", marginBottom: 20 }}>
            <input className="login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Password" />
            <button onClick={() => setShowPassword(!showPassword)} style={{
              position: "absolute", right: 12, top: "50%",
              transform: "translateY(-50%)",
              background: "none", border: "none",
              cursor: "pointer", color: "#a0b4c8", padding: 0,
            }}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(192,57,43,0.12)",
              border: "1px solid rgba(192,57,43,0.25)",
              borderRadius: 4, padding: "9px 12px", marginBottom: 14,
              fontSize: 12, color: "#e8837a", lineHeight: 1.55, textAlign: "left",
            }}>{error}</div>
          )}

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Authenticating..." : "Login to Platform"}
          </button>

          {/* Links */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button className="text-link"
              onClick={() => alert("Please contact your system administrator.")}>
              Forgot Password?
            </button>
            <button className="text-link" onClick={() => router.push("/register")}>
              Create an Account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 24, fontSize: 9.5, color: "#e0e2e4",
          letterSpacing: "0.14em", textTransform: "uppercase",
        }}>
          Restricted Access · Authorised Personnel Only
        </div>
      </div>
    </div>
  );
}