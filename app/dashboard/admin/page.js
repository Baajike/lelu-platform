"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, Phone, X, ChevronDown, ChevronRight } from "lucide-react";

const roleLabel = (role) => {
  const map = {
    HEAD_OF_UNIT: "Head of Unit",
    SUPERVISOR: "Supervisor",
    OFFICE_ADMINISTRATOR: "Office Administrator",
    OFFICER: "Staff",
    ADMIN: "Admin",
  };
  return map[role] || role;
};

const roleColor = (role) => {
  const map = {
    HEAD_OF_UNIT: { bg: "#FEF3E2", color: "#D4730A" },
    SUPERVISOR:   { bg: "#F3EDFC", color: "#6B3FA0" },
    OFFICE_ADMINISTRATOR: { bg: "#EBF3FB", color: "#1A5FA8" },
    OFFICER: { bg: "#E6F5EE", color: "#1A7A4A" },
    ADMIN:   { bg: "#FDECEA", color: "#C0392B" },
  };
  return map[role] || { bg: "#EEF2F7", color: "#4E6478" };
};

const fmtDate = (d) => {
  if (!d) return "Never";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

// Defined outside the page component so React never re-creates the type
function UserRow({ user, isDeactivated, toggling, acting, onCdrToggle, onOpenDeactivateModal, onReactivate, onResetPassword, onOpenDeleteModal }) {
  const rc = roleColor(user.role);
  const isHead = user.role === "HEAD_OF_UNIT";
  const hasCdr = isHead || user.cdrAccess;
  const isToggling = toggling[user.id];
  const isActing = acting[user.id];

  return (
    <tr className="user-row">
      {/* Officer */}
      <td style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: isDeactivated ? "#D8E2EE" : "#0B1F3A",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0,
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: isDeactivated ? "#8FA3BB" : "#0B1F3A" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#A8BFCF" }}>{user.email}</div>
          </div>
        </div>
      </td>

      {/* Role */}
      <td style={{ padding: "14px 20px" }}>
        <span style={{ background: rc.bg, color: rc.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {roleLabel(user.role)}
        </span>
      </td>

      {/* Last Active */}
      <td style={{ padding: "14px 20px", fontSize: 12, color: "#8FA3BB", whiteSpace: "nowrap" }}>
        {fmtDate(user.lastActive)}
      </td>

      {/* CDR Access */}
      <td style={{ padding: "14px 20px" }}>
        {isHead ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 40, height: 22, borderRadius: 11, background: "#1A7A4A", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 3, left: 21, width: 16, height: 16, borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
            <span style={{ fontSize: 11, color: "#8FA3BB" }}>Always on</span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="toggle-track"
              disabled={!!isToggling || isDeactivated}
              onClick={() => onCdrToggle(user.id, user.cdrAccess)}
              style={{ background: hasCdr ? "#1A7A4A" : "#D8E2EE", opacity: (isToggling || isDeactivated) ? 0.5 : 1 }}
            >
              <div className="toggle-thumb" style={{ left: hasCdr ? 21 : 3 }} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Phone size={11} color={hasCdr ? "#1A7A4A" : "#8FA3BB"} />
              <span style={{ fontSize: 12, fontWeight: 600, color: hasCdr ? "#1A7A4A" : "#8FA3BB" }}>
                {hasCdr ? "Granted" : "Restricted"}
              </span>
            </div>
          </div>
        )}
      </td>

      {/* Reset Password */}
      <td style={{ padding: "14px 20px" }}>
        {!isHead && !isDeactivated && (
          <button onClick={() => onResetPassword(user)}
            style={{ fontSize: 11, color: "#1A5FA8", background: "#EBF3FB", border: "none", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontFamily: "'Segoe UI', sans-serif", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#C8DFF5"}
            onMouseLeave={e => e.currentTarget.style.background = "#EBF3FB"}
          >
            Reset Password
          </button>
        )}
      </td>

      {/* Deactivate / Reactivate */}
      <td style={{ padding: "14px 20px" }}>
        {!isHead && (
          isDeactivated ? (
            <button
              disabled={isActing === "reactivating"}
              onClick={() => onReactivate(user.id)}
              style={{ fontSize: 11, color: "#1A7A4A", background: "#E6F5EE", border: "none", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontFamily: "'Segoe UI', sans-serif", opacity: isActing ? 0.6 : 1, transition: "background 0.15s" }}
              onMouseEnter={e => { if (!isActing) e.currentTarget.style.background = "#B3E0C8"; }}
              onMouseLeave={e => e.currentTarget.style.background = "#E6F5EE"}
            >
              {isActing === "reactivating" ? "..." : "Reactivate"}
            </button>
          ) : (
            <button
              disabled={isActing === "deactivating"}
              onClick={() => onOpenDeactivateModal(user)}
              style={{ fontSize: 11, color: "#C0392B", background: "#FDECEA", border: "none", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontFamily: "'Segoe UI', sans-serif", opacity: isActing ? 0.6 : 1, transition: "background 0.15s" }}
              onMouseEnter={e => { if (!isActing) e.currentTarget.style.background = "#F5C6C2"; }}
              onMouseLeave={e => e.currentTarget.style.background = "#FDECEA"}
            >
              {isActing === "deactivating" ? "..." : "Deactivate"}
            </button>
          )
        )}
      </td>

      {/* Delete */}
      <td style={{ padding: "14px 20px" }}>
        {!isHead && (
          <button onClick={() => onOpenDeleteModal(user)}
            style={{ fontSize: 11, color: "#8FA3BB", background: "none", border: "1px solid #E2E8F0", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontFamily: "'Segoe UI', sans-serif", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#C0392B"; e.currentTarget.style.borderColor = "#F5C6C2"; e.currentTarget.style.background = "#FDECEA"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#8FA3BB"; e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "none"; }}
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
}

const COL_HEADERS = ["Officer", "Role", "Last Active", "CDR Access", "Password", "", ""];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [deactivated, setDeactivated] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deactLoading, setDeactLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [toggling, setToggling] = useState({});
  const [acting, setActing] = useState({});
  const [approving, setApproving] = useState({});
  const [showDeactivated, setShowDeactivated] = useState(false);

  const [resetModal, setResetModal] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetting, setResetting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [deactivateModal, setDeactivateModal] = useState(null); // { userId, userName }
  const [deleteModal, setDeleteModal] = useState(null); // { userId, userName }
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "HEAD_OF_UNIT") router.replace("/dashboard");
  }, [session, status, router]);

  // Fetch active and deactivated users independently so one failure doesn't blank the other
  const fetchActiveUsers = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data.filter(u => u.role !== "ADMIN") : []);
    } catch (e) {
      setFetchError(e.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeactivatedUsers = async () => {
    setDeactLoading(true);
    try {
      const res = await fetch("/api/users?deactivated=true");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDeactivated(Array.isArray(data) ? data.filter(u => u.role !== "ADMIN") : []);
    } catch {
      setDeactivated([]);
    } finally {
      setDeactLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    setPendingLoading(true);
    try {
      const res = await fetch("/api/users?pending=true");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPending(Array.isArray(data) ? data.filter(u => u.role !== "ADMIN") : []);
    } catch {
      setPending([]);
    } finally {
      setPendingLoading(false);
    }
  };

  const fetchAll = () => { fetchActiveUsers(); fetchDeactivatedUsers(); fetchPendingUsers(); };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "HEAD_OF_UNIT") {
      fetchAll();
    }
  }, [status]);

  const handlePendingAction = async (userId, action) => {
    setApproving(a => ({ ...a, [userId]: action }));
    try {
      await fetch(`/api/users/${userId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      setPending(prev => prev.filter(u => u.id !== userId));
      if (action === "approve") fetchActiveUsers();
    } finally {
      setApproving(a => ({ ...a, [userId]: null }));
    }
  };

  const handleCdrToggle = async (userId, currentValue) => {
    setToggling(t => ({ ...t, [userId]: true }));
    try {
      await fetch(`/api/users/${userId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cdrAccess: !currentValue }),
      });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, cdrAccess: !currentValue } : u));
    } finally {
      setToggling(t => ({ ...t, [userId]: false }));
    }
  };

  const handleDeactivate = async (userId) => {
    setDeactivateModal(null);
    setActing(a => ({ ...a, [userId]: "deactivating" }));
    try {
      await fetch(`/api/users/${userId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deactivate" }),
      });
      fetchAll();
    } finally {
      setActing(a => ({ ...a, [userId]: null }));
    }
  };

  const handleReactivate = async (userId) => {
    setActing(a => ({ ...a, [userId]: "reactivating" }));
    try {
      await fetch(`/api/users/${userId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reactivate" }),
      });
      fetchAll();
    } finally {
      setActing(a => ({ ...a, [userId]: null }));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/users/${deleteModal.userId}`, { method: "DELETE" });
      setDeleteModal(null);
      fetchAll();
    } finally {
      setDeleting(false);
    }
  };

  const openResetModal = (user) => {
    setResetModal({ userId: user.id, userName: user.name });
    setNewPassword(""); setConfirmPassword(""); setResetError("");
  };

  const handleResetPassword = async () => {
    setResetError("");
    if (!newPassword || newPassword.length < 8) { setResetError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setResetError("Passwords do not match."); return; }
    setResetting(true);
    try {
      const res = await fetch(`/api/users/${resetModal.userId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_password", newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setResetError(data.error || "Failed to reset password."); return; }
      setResetModal(null);
    } finally {
      setResetting(false);
    }
  };

  if (status === "loading" || !session) return null;
  if (session.user.role !== "HEAD_OF_UNIT") return null;

  const rowProps = { toggling, acting, onCdrToggle: handleCdrToggle, onOpenDeactivateModal: (user) => setDeactivateModal({ userId: user.id, userName: user.name }), onReactivate: handleReactivate, onResetPassword: openResetModal, onOpenDeleteModal: (user) => setDeleteModal({ userId: user.id, userName: user.name }) };

  return (
    <div style={{ padding: 32 }}>
      <style>{`
        .user-row:hover td { background: #F7F9FC; }
        .toggle-track {
          width: 40px; height: 22px; border-radius: 11px; position: relative;
          cursor: pointer; transition: background 0.2s; border: none; padding: 0; flex-shrink: 0;
        }
        .toggle-thumb {
          position: absolute; top: 3px; width: 16px; height: 16px;
          border-radius: 50%; background: white;
          transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        @keyframes lelu-spin { to { transform: rotate(360deg); } }
        .lelu-spinner { width: 28px; height: 28px; border: 3px solid #EEF2F7; border-top-color: #1A5FA8; border-radius: 50%; animation: lelu-spin 0.7s linear infinite; margin: 0 auto; }
        .modal-input {
          width: 100%; border: 1.5px solid #E2E8F0; border-radius: 4px;
          padding: 10px 14px; font-size: 13px; color: #0B1F3A;
          outline: none; box-sizing: border-box; font-family: 'Segoe UI', sans-serif;
          transition: border-color 0.2s; background: white;
        }
        .modal-input:focus { border-color: #1A5FA8; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EBF3FB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={18} color="#1A5FA8" strokeWidth={1.8} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0B1F3A", margin: 0 }}>User Management</h1>
        </div>
        <div style={{ fontSize: 12, color: "#8FA3BB", marginLeft: 48 }}>
          Manage access, permissions, and credentials for all platform users.
        </div>
      </div>

      {/* Fetch error banner */}
      {fetchError && (
        <div style={{ background: "#FDECEA", border: "1px solid #F5C6C2", borderRadius: 4, padding: "12px 16px", marginBottom: 20, fontSize: 12, color: "#C0392B" }}>
          <strong>Error loading users:</strong> {fetchError}
        </div>
      )}

      {/* Pending Approvals */}
      {!pendingLoading && pending.length > 0 && (
        <div style={{ background: "white", borderRadius: 6, border: "1.5px solid #F5C6C2", overflow: "hidden", boxShadow: "0 1px 6px rgba(192,57,43,0.08)", marginBottom: 24 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #FDECEA", background: "#FDECEA", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C0392B", flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#C0392B", textTransform: "uppercase", letterSpacing: "0.08em", flex: 1 }}>
              Pending Approvals
            </span>
            <span style={{ background: "#C0392B", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 3 }}>
              {pending.length}
            </span>
          </div>
          <div>
            {pending.map((u, i) => {
              const rc = roleColor(u.role);
              const isWorking = approving[u.id];
              return (
                <div key={u.id} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "14px 20px",
                  borderBottom: i < pending.length - 1 ? "1px solid #F7F9FC" : "none",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "#C0392B",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0,
                  }}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 1 }}>{u.email}</div>
                  </div>
                  <span style={{ background: rc.bg, color: rc.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase", flexShrink: 0 }}>
                    {roleLabel(u.role)}
                  </span>
                  <div style={{ fontSize: 11, color: "#A8BFCF", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {fmtDate(u.createdAt)}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      disabled={!!isWorking}
                      onClick={() => handlePendingAction(u.id, "approve")}
                      style={{ background: "#1A7A4A", color: "white", border: "none", padding: "7px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: isWorking ? "default" : "pointer", fontFamily: "'Segoe UI', sans-serif", opacity: isWorking ? 0.6 : 1, transition: "background 0.15s" }}
                      onMouseEnter={e => { if (!isWorking) e.currentTarget.style.background = "#155f38"; }}
                      onMouseLeave={e => e.currentTarget.style.background = "#1A7A4A"}
                    >
                      {isWorking === "approve" ? "..." : "Approve"}
                    </button>
                    <button
                      disabled={!!isWorking}
                      onClick={() => handlePendingAction(u.id, "reject")}
                      style={{ background: "#FDECEA", color: "#C0392B", border: "1px solid #F5C6C2", padding: "7px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: isWorking ? "default" : "pointer", fontFamily: "'Segoe UI', sans-serif", opacity: isWorking ? 0.6 : 1, transition: "background 0.15s" }}
                      onMouseEnter={e => { if (!isWorking) e.currentTarget.style.background = "#F5C6C2"; }}
                      onMouseLeave={e => e.currentTarget.style.background = "#FDECEA"}
                    >
                      {isWorking === "reject" ? "..." : "Reject"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Users Table */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.05)", marginBottom: 24 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F9FC", borderBottom: "1px solid #E2E8F0" }}>
              {COL_HEADERS.map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 48, textAlign: "center" }}><div className="lelu-spinner" /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 60, textAlign: "center" }}>
                <Users size={36} color="#D8E2EE" strokeWidth={1.2} style={{ margin: "0 auto 12px", display: "block" }} />
                <div style={{ fontSize: 13, color: "#8FA3BB" }}>No active users found.</div>
              </td></tr>
            ) : users.map(user => (
              <UserRow key={user.id} user={user} isDeactivated={false} {...rowProps} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Deactivated Users — collapsible */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.05)" }}>
        <button
          onClick={() => setShowDeactivated(v => !v)}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {showDeactivated ? <ChevronDown size={14} color="#8FA3BB" /> : <ChevronRight size={14} color="#8FA3BB" />}
            <span style={{ fontSize: 12, fontWeight: 700, color: "#4E6478", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Deactivated Users
            </span>
            {!deactLoading && deactivated.length > 0 && (
              <span style={{ background: "#FDECEA", color: "#C0392B", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>
                {deactivated.length}
              </span>
            )}
          </div>
        </button>

        {showDeactivated && (
          <div style={{ borderTop: "1px solid #E2E8F0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F7F9FC", borderBottom: "1px solid #E2E8F0" }}>
                  {COL_HEADERS.map(h => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deactLoading ? (
                  <tr><td colSpan={6} style={{ padding: 32, textAlign: "center" }}><div className="lelu-spinner" /></td></tr>
                ) : deactivated.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: "center" }}>
                    <Users size={28} color="#D8E2EE" strokeWidth={1.2} style={{ margin: "0 auto 10px", display: "block" }} />
                    <div style={{ fontSize: 12, color: "#8FA3BB" }}>No deactivated users.</div>
                  </td></tr>
                ) : deactivated.map(user => (
                  <UserRow key={user.id} user={user} isDeactivated={true} {...rowProps} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deactivate Confirmation Modal */}
      {deactivateModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 420, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Deactivate Account</div>
              <button onClick={() => setDeactivateModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: 13, color: "#4E6478", lineHeight: 1.6, margin: "0 0 28px" }}>
              Are you sure you want to deactivate <strong style={{ color: "#0B1F3A" }}>{deactivateModal.userName}</strong>? They will lose access to the platform immediately.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setDeactivateModal(null)}
                style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>
                Cancel
              </button>
              <button onClick={() => handleDeactivate(deactivateModal.userId)}
                style={{ background: "#C0392B", color: "white", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#9e2d22"}
                onMouseLeave={e => e.currentTarget.style.background = "#C0392B"}
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 420, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Delete User</div>
              <button onClick={() => setDeleteModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: 13, color: "#4E6478", lineHeight: 1.6, margin: "0 0 12px" }}>
              Are you sure you want to delete <strong style={{ color: "#0B1F3A" }}>{deleteModal.userName}</strong>?
            </p>
            <p style={{ fontSize: 12, color: "#8FA3BB", lineHeight: 1.6, margin: "0 0 28px" }}>
              Their account will be permanently removed. All cases, journal entries, and CDR requests they created will be preserved in the system.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteModal(null)}
                style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                style={{ background: "#0B1F3A", color: "white", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", opacity: deleting ? 0.7 : 1, transition: "background 0.15s" }}
                onMouseEnter={e => { if (!deleting) e.currentTarget.style.background = "#C0392B"; }}
                onMouseLeave={e => e.currentTarget.style.background = "#0B1F3A"}
              >
                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 420, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Reset Password</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>{resetModal.userName}</div>
              </div>
              <button onClick={() => setResetModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>New Password *</label>
              <input className="modal-input" type="password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Confirm Password *</label>
              <input className="modal-input" type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
            </div>

            {resetError && (
              <div style={{ background: "#FDECEA", border: "1px solid #F5C6C2", borderRadius: 4, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#C0392B" }}>
                {resetError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setResetModal(null)}
                style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleResetPassword} disabled={resetting}
                style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 24px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", opacity: resetting ? 0.7 : 1, transition: "background 0.15s" }}
                onMouseEnter={e => { if (!resetting) e.currentTarget.style.background = "#154d8a"; }}
                onMouseLeave={e => e.currentTarget.style.background = "#1A5FA8"}
              >
                {resetting ? "Saving..." : "Set Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
