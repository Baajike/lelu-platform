"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B1F3A",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.8s ease",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .splash-logo { animation: fadeUp 0.8s ease 0.2s both; }
        .splash-title { animation: fadeUp 0.8s ease 0.4s both; }
        .splash-sub { animation: fadeUp 0.8s ease 0.6s both; }
        .splash-divider { animation: fadeUp 0.8s ease 0.7s both; }
        .splash-btn { animation: fadeUp 0.8s ease 0.8s both; }
        .splash-footer { animation: fadeUp 0.8s ease 1s both; }
        .enter-btn:hover { background: #e8edf2 !important; transform: translateY(-1px); }
        .enter-btn:active { transform: translateY(0); }
      `}</style>

      {/* Logo with white background */}
      <div className="splash-logo" style={{ marginBottom: 36 }}>
        <div style={{
          width: 140, height: 140,
          borderRadius: "50%",
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}>
          <Image
            src="/csa-logo.png"
            alt="CSA Logo"
            width={118}
            height={118}
            style={{ borderRadius: "50%" }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="splash-title" style={{ textAlign: "center", marginBottom: 14 }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "white", letterSpacing: "0.14em", margin: 0, textTransform: "uppercase" }}>
          LELU
        </h1>
      </div>

      {/* Subtitle */}
      <div className="splash-sub" style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 13, letterSpacing: "0.14em", color: "#A8BFCF", textTransform: "uppercase", fontWeight: 500 }}>
          Law Enforcement Liaison Unit
        </div>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#4E6478", textTransform: "uppercase", marginTop: 8 }}>
          Intelligence Management Platform
        </div>
      </div>

      {/* Divider */}
      <div className="splash-divider" style={{ width: 60, height: 1, background: "#1E3A5F", marginBottom: 40 }} />

      {/* Button */}
      <div className="splash-btn">
        <button
          className="enter-btn"
          onClick={() => router.push("/login")}
          style={{
            background: "white",
            border: "none",
            color: "#0B1F3A",
            padding: "14px 52px",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: 4,
            transition: "all 0.2s ease",
            fontWeight: 700,
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
        >
          Enter Platform
        </button>
      </div>

      {/* Footer */}
      <div className="splash-footer" style={{ position: "absolute", bottom: 32, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#f1f3f5", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Restricted Access · Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}