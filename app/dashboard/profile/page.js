"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Eye, EyeOff, Sun, Moon, AlertCircle,
  LogOut, Check, Edit2, X,
} from "lucide-react";

const roleLabel = (role) => {
  const map = {
    HEAD_OF_UNIT: "Head of Unit",
    SUPERVISOR: "Supervisor",
    OFFICE_ADMINISTRATOR: "Office Administrator",
    OFFICER: "Officer",
    ADMIN: "Admin",
  };
  return map[role] || role;
};

const roleColor = (role) => {
  const map = {
    HEAD_OF_UNIT:         { bg: "#FEF3E2", color: "#D4730A" },
    SUPERVISOR:           { bg: "#F3EDFC", color: "#6B3FA0" },
    OFFICE_ADMINISTRATOR: { bg: "#EBF3FB", color: "#1A5FA8" },
    OFFICER:              { bg: "#E6F5EE", color: "#1A7A4A" },
    ADMIN:                { bg: "#FDECEA", color: "#C0392B" },
  };
  return map[role] || { bg: "#EEF2F7", color: "#4E6478" };
};

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [theme, setTheme] = useState("light");

  // Name edit
  const [editingName, setEditingName] = useState(false);
  const [nameValue,   setNameValue]   = useState("");
  const [nameSaving,  setNameSaving]  = useState(false);
  const [nameMsg,     setNameMsg]     = useState({ type: "", text: "" });

  // Password
  const [pwForm,      setPwForm]      = useState({ current: "", next: "", confirm: "" });
  const [pwState,     setPwState]     = useState({ loading: false, error: "", success: false });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext,    setShowNext]    = useState(false);

  // Activity
  const [activity,        setActivity]        = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("lelu-theme") || "light";
    setTheme(saved);
  }, []);

  useEffect(() => {
    fetch("/api/cases/activity?me=true")
      .then(r => r.json())
      .then(d => setActivity(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("lelu-theme", next);
    document.documentElement.setAttribute("data-lelu-theme", next);
    window.dispatchEvent(new Event("lelu-theme-change"));
  };

  const startEditName = () => {
    setNameValue(session?.user?.name || "");
    setNameMsg({ type: "", text: "" });
    setEditingName(true);
  };

  const saveName = async () => {
    if (!nameValue.trim()) { setNameMsg({ type: "error", text: "Name cannot be empty." }); return; }
    setNameSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNameMsg({ type: "error", text: data.error || "Failed to update name." });
      } else {
        await update({ name: data.name });
        setNameMsg({ type: "success", text: "Name updated." });
        setTimeout(() => { setEditingName(false); setNameMsg({ type: "", text: "" }); }, 1000);
      }
    } catch {
      setNameMsg({ type: "error", text: "Network error." });
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const { current, next, confirm } = pwForm;
    if (!current || !next || !confirm) {
      setPwState({ loading: false, error: "All fields are required.", success: false }); return;
    }
    if (next !== confirm) {
      setPwState({ loading: false, error: "New passwords do not match.", success: false }); return;
    }
    if (next.length < 8) {
      setPwState({ loading: false, error: "New password must be at least 8 characters.", success: false }); return;
    }
    setPwState({ loading: true, error: "", success: false });
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwState({ loading: false, error: data.error || "Failed to change password.", success: false });
      } else {
        setPwState({ loading: false, error: "", success: true });
        setPwForm({ current: "", next: "", confirm: "" });
        setTimeout(() => setPwState({ loading: false, error: "", success: false }), 3000);
      }
    } catch {
      setPwState({ loading: false, error: "Network error. Please try again.", success: false });
    }
  };

  const role  = session?.user?.role;
  const rc    = roleColor(role);
  const isDark = theme === "dark";

  const card = {
    background: isDark ? "#1A2B3C" : "white",
    border: `1px solid ${isDark ? "#1E3A5F" : "#E2E8F0"}`,
    borderRadius: 8,
    padding: "28px 32px",
    marginBottom: 20,
  };

  const lbl = {
    fontSize: 11, fontWeight: 700,
    color: isDark ? "#8FA3BB" : "#4E6478",
    display: "block", marginBottom: 6,
    textTransform: "uppercase", letterSpacing: "0.08em",
  };

  const inp = {
    width: "100%",
    border: `1.5px solid ${isDark ? "#253F5A" : "#E2E8F0"}`,
    borderRadius: 4, padding: "10px 14px", fontSize: 13, outline: "none",
    boxSizing: "border-box", fontFamily: "'Segoe UI',sans-serif",
    color: isDark ? "#E2EAF4" : "#0B1F3A",
    background: isDark ? "#0F1A2B" : "white",
  };

  const h2 = { fontSize: 13, fontWeight: 700, color: isDark ? "#E2EAF4" : "#0B1F3A", marginBottom: 4 };
  const sub = { fontSize: 11, color: isDark ? "#4E6478" : "#8FA3BB", marginBottom: 20 };

  return (
    <div style={{ padding: "36px 40px 60px", maxWidth: 720, margin: "0 auto" }}>

      {/* ── 1. Profile Header ─────────────────────────────────────────── */}
      <div style={{ ...card, display: "flex", alignItems: "flex-start", gap: 24 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", background: "#1A5FA8", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700, color: "white",
        }}>
          {session?.user?.name?.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {editingName ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <input
                autoFocus
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                style={{ ...inp, padding: "6px 10px", fontSize: 16, fontWeight: 700, flex: 1 }}
              />
              <button onClick={saveName} disabled={nameSaving}
                style={{ background: "#1A5FA8", color: "white", border: "none", borderRadius: 4, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: nameSaving ? "not-allowed" : "pointer" }}>
                {nameSaving ? "Saving…" : "Save"}
              </button>
              <button onClick={() => setEditingName(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB", padding: 4 }}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: isDark ? "#E2EAF4" : "#0B1F3A" }}>
                {session?.user?.name}
              </div>
              <button onClick={startEditName}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB", padding: 2 }}>
                <Edit2 size={14} />
              </button>
            </div>
          )}

          {nameMsg.text && (
            <div style={{ fontSize: 11, color: nameMsg.type === "error" ? "#C0392B" : "#1A7A4A", marginBottom: 6 }}>
              {nameMsg.text}
            </div>
          )}

          <div style={{ fontSize: 13, color: isDark ? "#4E6478" : "#8FA3BB", marginBottom: 10 }}>
            {session?.user?.email}
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: rc.bg, color: rc.color, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {roleLabel(role)}
          </span>
        </div>
      </div>

      {/* ── 2. Change Password ────────────────────────────────────────── */}
      <div style={card}>
        <div style={h2}>Change Password</div>
        <div style={sub}>Update your account password. At least 8 characters required.</div>

        {pwState.success ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "#E6F5EE", borderRadius: 4, border: "1px solid #B8E2C8" }}>
            <Check size={15} color="#1A7A4A" strokeWidth={2.5} />
            <span style={{ fontSize: 13, color: "#1A7A4A", fontWeight: 600 }}>Password updated successfully.</span>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Current Password *</label>
                <div style={{ position: "relative" }}>
                  <input type={showCurrent ? "text" : "password"} value={pwForm.current}
                    onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                    placeholder="Current password"
                    style={{ ...inp, paddingRight: 40 }} />
                  <button onClick={() => setShowCurrent(v => !v)} tabIndex={-1}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    {showCurrent ? <EyeOff size={14} color="#8FA3BB" /> : <Eye size={14} color="#8FA3BB" />}
                  </button>
                </div>
              </div>
              <div />
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>New Password *</label>
                <div style={{ position: "relative" }}>
                  <input type={showNext ? "text" : "password"} value={pwForm.next}
                    onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                    placeholder="At least 8 characters"
                    style={{ ...inp, paddingRight: 40 }} />
                  <button onClick={() => setShowNext(v => !v)} tabIndex={-1}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                    {showNext ? <EyeOff size={14} color="#8FA3BB" /> : <Eye size={14} color="#8FA3BB" />}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Confirm New Password *</label>
                <input type="password" value={pwForm.confirm}
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleChangePassword()}
                  placeholder="Re-enter new password"
                  style={inp} />
              </div>
            </div>

            {pwState.error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "#FDECEA", border: "1px solid #F5C6C2", borderRadius: 4, marginBottom: 14, fontSize: 12, color: "#C0392B" }}>
                <AlertCircle size={13} color="#C0392B" strokeWidth={2} />
                {pwState.error}
              </div>
            )}

            <button onClick={handleChangePassword} disabled={pwState.loading}
              style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: pwState.loading ? "not-allowed" : "pointer", opacity: pwState.loading ? 0.7 : 1, fontFamily: "'Segoe UI',sans-serif" }}>
              {pwState.loading ? "Saving…" : "Update Password"}
            </button>
          </>
        )}
      </div>

      {/* ── 3. My Activity ───────────────────────────────────────────── */}
      <div style={card}>
        <div style={h2}>My Activity</div>
        <div style={sub}>Your last 10 actions on cases.</div>

        {activityLoading ? (
          <div style={{ fontSize: 12, color: "#8FA3BB" }}>Loading…</div>
        ) : activity.length === 0 ? (
          <div style={{ fontSize: 12, color: "#8FA3BB" }}>No activity recorded yet.</div>
        ) : (
          <div>
            {activity.map((a, i) => (
              <div key={a.id} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 0",
                borderBottom: i < activity.length - 1 ? `1px solid ${isDark ? "#1E3A5F" : "#EEF2F7"}` : "none",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1A5FA8", flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#E2EAF4" : "#0B1F3A" }}>{a.action}</div>
                  {a.detail && <div style={{ fontSize: 11, color: isDark ? "#4E6478" : "#8FA3BB", marginTop: 1 }}>{a.detail}</div>}
                  {a.case && (
                    <div style={{ fontSize: 11, color: "#1A5FA8", marginTop: 2 }}>
                      {a.case.caseNumber} — {a.case.title}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 10, color: isDark ? "#4E6478" : "#C4D0DC", flexShrink: 0, whiteSpace: "nowrap" }}>
                  {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 4. Preferences ───────────────────────────────────────────── */}
      <div style={card}>
        <div style={h2}>Preferences</div>
        <div style={sub}>Customize your dashboard appearance.</div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#E2EAF4" : "#0B1F3A" }}>
              {isDark ? "Dark Mode" : "Light Mode"}
            </div>
            <div style={{ fontSize: 11, color: isDark ? "#4E6478" : "#8FA3BB", marginTop: 2 }}>
              {isDark ? "Switch to light theme" : "Switch to dark theme"}
            </div>
          </div>
          <button onClick={toggleTheme}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px", borderRadius: 20,
              background: isDark ? "#1A5FA8" : "#EEF2F7",
              border: "none", cursor: "pointer",
            }}>
            {isDark
              ? <><Sun size={14} color="white" strokeWidth={2} /><span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>Light</span></>
              : <><Moon size={14} color="#4E6478" strokeWidth={2} /><span style={{ fontSize: 12, color: "#4E6478", fontWeight: 600 }}>Dark</span></>
            }
          </button>
        </div>
      </div>

      {/* ── 5. About ─────────────────────────────────────────────────── */}
      <div style={card}>
        <div style={h2}>About</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 0" }}>
          {[
            ["Platform", "LELU Intelligence Platform"],
            ["Version",  "1.0.0"],
            ["Organisation", "CSA Ghana"],
            ["Year",     "2026"],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 10, fontWeight: 700, color: isDark ? "#4E6478" : "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: isDark ? "#E2EAF4" : "#0B1F3A" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. Sign Out ──────────────────────────────────────────────── */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 6,
          background: "#FDECEA", border: "1px solid #F5C6C2",
          color: "#C0392B", fontSize: 14, fontWeight: 700,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          fontFamily: "'Segoe UI',sans-serif",
        }}>
        <LogOut size={16} color="#C0392B" strokeWidth={2} />
        Sign Out
      </button>
    </div>
  );
}
