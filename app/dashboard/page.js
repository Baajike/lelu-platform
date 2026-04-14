"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FolderOpen, Phone, ShieldAlert, Globe, CheckCircle, XCircle, UserPlus } from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div style={{
    background: "white", borderRadius: 6, padding: "24px",
    border: "1px solid #E2E8F0", borderTop: `3px solid ${color}`,
    boxShadow: "0 1px 6px rgba(11,31,58,0.06)",
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ width: 36, height: 36, borderRadius: 6, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={color} strokeWidth={1.8} />
      </div>
    </div>
    <div style={{ fontSize: 36, fontWeight: 800, color: "#0B1F3A", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 8 }}>{sub}</div>}
  </div>
);

const roleLabel = (role) => {
  const map = {
    HEAD_OF_UNIT: "Head of Unit", SUPERVISOR: "Supervisor",
    OFFICE_ADMINISTRATOR: "Office Administrator", OFFICER: "Officer", ADMIN: "Admin",
  };
  return map[role] || role;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ cases: 0, pendingCdrs: 0, fraudEntities: 0, activeCases: 0, intlRequests: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teamStats, setTeamStats] = useState([]);
  const [approving, setApproving] = useState({});
  const [loading, setLoading] = useState(true);

  const isAdmin = ["HEAD_OF_UNIT", "SUPERVISOR", "OFFICE_ADMINISTRATOR", "ADMIN"].includes(session?.user?.role);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, cdrsRes, fraudRes, intlRes] = await Promise.all([
          fetch("/api/cases"),
          fetch("/api/cdr"),
          fetch("/api/fraud"),
          fetch("/api/international"),
        ]);
        const cases = await casesRes.json();
        const cdrs = await cdrsRes.json();
        const fraud = await fraudRes.json();
        const intl = await intlRes.json();

        const caseList = Array.isArray(cases) ? cases : [];
        const cdrList = Array.isArray(cdrs) ? cdrs : [];
        const fraudList = Array.isArray(fraud) ? fraud : [];
        const intlList = Array.isArray(intl) ? intl : [];

        setStats({
          cases: caseList.length,
          activeCases: caseList.filter(c => c.status === "Active").length,
          pendingCdrs: cdrList.filter(c => c.status === "Pending").length,
          fraudEntities: fraudList.length,
          intlRequests: intlList.filter(r => r.status === "Pending").length,
        });
        setRecentCases(caseList.slice(0, 6));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/users?pending=true")
        .then(r => r.json())
        .then(d => setPendingUsers(Array.isArray(d) ? d : []))
        .catch(() => setPendingUsers([]));

      fetch("/api/users?withStats=true")
        .then(r => r.json())
        .then(d => setTeamStats(Array.isArray(d) ? d : []))
        .catch(() => setTeamStats([]));
    }
  }, [isAdmin]);

  const handleApproval = async (userId, action) => {
    setApproving(prev => ({ ...prev, [userId]: action }));
    try {
      await fetch(`/api/users/${userId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } finally {
      setApproving(prev => ({ ...prev, [userId]: null }));
    }
  };

  const statusColor = (s) => s === "Active" ? "#1A7A4A" : s === "Closed" ? "#4E6478" : "#D4730A";
  const priorityColor = (p) => p === "High" ? "#C0392B" : p === "Medium" ? "#D4730A" : "#1A7A4A";

  return (
    <div style={{ padding: 32 }}>

      {/* Welcome Banner */}
      <div style={{
        background: "#0B1F3A", borderRadius: 6, padding: "24px 28px",
        marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(11,31,58,0.12)",
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 4 }}>
            Welcome back, {session?.user?.name?.split(" ")[0]}.
          </div>
          <div style={{ fontSize: 12, color: "#4E6478" }}>
            Law Enforcement and Liaison Unit · Intelligence Management Platform
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/cases")} style={{
          background: "#1A5FA8", color: "white", border: "none",
          padding: "11px 24px", borderRadius: 4, fontSize: 12, fontWeight: 600,
          cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>+ New Case</button>
      </div>

      {/* Pending Approvals */}
      {isAdmin && pendingUsers.length > 0 && (
        <div style={{
          background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
          borderLeft: "4px solid #D4730A", marginBottom: 28,
          boxShadow: "0 1px 6px rgba(11,31,58,0.06)", overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 24px", borderBottom: "1px solid #EEF2F7",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#FFFBF5",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <UserPlus size={16} color="#D4730A" strokeWidth={2} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Pending Account Approvals</div>
                <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 1 }}>
                  {pendingUsers.length} {pendingUsers.length === 1 ? "account requires" : "accounts require"} your approval before they can log in.
                </div>
              </div>
            </div>
            <span style={{
              background: "#FEF3E2", color: "#D4730A", fontSize: 11,
              fontWeight: 700, padding: "4px 12px", borderRadius: 3, letterSpacing: "0.05em",
            }}>{pendingUsers.length} PENDING</span>
          </div>
          {pendingUsers.map((u, i) => (
            <div key={u.id} style={{
              padding: "16px 24px",
              borderBottom: i < pendingUsers.length - 1 ? "1px solid #F7F9FC" : "none",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "#0B1F3A",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0,
              }}>
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>{u.name}</div>
                <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 1 }}>{u.email}</div>
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700, color: "#1A5FA8", background: "#EBF3FB",
                padding: "4px 10px", borderRadius: 3, letterSpacing: "0.05em",
                textTransform: "uppercase", whiteSpace: "nowrap",
              }}>{roleLabel(u.role)}</div>
              <div style={{ fontSize: 11, color: "#8FA3BB", whiteSpace: "nowrap", minWidth: 90, textAlign: "right" }}>
                {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => handleApproval(u.id, "approve")} disabled={!!approving[u.id]}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#1A7A4A", color: "white", border: "none",
                    padding: "8px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                    opacity: approving[u.id] ? 0.6 : 1, transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#155f38"}
                  onMouseLeave={e => e.currentTarget.style.background = "#1A7A4A"}
                >
                  <CheckCircle size={13} />
                  {approving[u.id] === "approve" ? "Approving..." : "Approve"}
                </button>
                <button onClick={() => handleApproval(u.id, "reject")} disabled={!!approving[u.id]}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#FDECEA", color: "#C0392B", border: "1px solid #F5C6C2",
                    padding: "8px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                    opacity: approving[u.id] ? 0.6 : 1, transition: "opacity 0.15s",
                  }}
                >
                  <XCircle size={13} />
                  {approving[u.id] === "reject" ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
        <StatCard label="Total Cases" value={stats.cases} icon={FolderOpen} color="#1A5FA8" sub={`${stats.activeCases} active`} />
        <StatCard label="Pending CDRs" value={stats.pendingCdrs} icon={Phone} color="#D4730A" sub="Awaiting telco response" />
        <StatCard label="Fraud Entities" value={stats.fraudEntities} icon={ShieldAlert} color="#C0392B" sub="In database" />
        <StatCard label="Intl. Requests" value={stats.intlRequests} icon={Globe} color="#6B3FA0" sub="Pending response" />
      </div>

      {/* Team Overview — admin only */}
      {isAdmin && teamStats.length > 0 && (
        <div style={{
          background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
          overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.06)", marginBottom: 28,
        }}>
          <div style={{
            padding: "18px 24px", borderBottom: "1px solid #EEF2F7",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Team Overview</div>
            <button onClick={() => router.push("/dashboard/cases")}
              style={{ fontSize: 11, color: "#1A5FA8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, letterSpacing: "0.05em" }}>
              VIEW ALL CASES
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {teamStats.map((u, i) => (
              <div key={u.id}
                onClick={() => router.push(`/dashboard/cases?officerId=${u.id}`)}
                style={{
                  padding: "18px 20px",
                  borderRight: "1px solid #F7F9FC",
                  borderBottom: "1px solid #F7F9FC",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F7F9FC"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", background: "#0B1F3A",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0,
                  }}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>{u.name}</div>
                    <div style={{ fontSize: 10, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {roleLabel(u.role)}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#1A7A4A" }}>{u.cases?.length ?? 0}</div>
                    <div style={{ fontSize: 10, color: "#8FA3BB", fontWeight: 600 }}>ACTIVE CASES</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#D4730A" }}>{u._count?.cdrRequests ?? 0}</div>
                    <div style={{ fontSize: 10, color: "#8FA3BB", fontWeight: 600 }}>CDR REQUESTS</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

        {/* Recent Cases */}
        <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.06)" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Recent Cases</div>
            <button onClick={() => router.push("/dashboard/cases")} style={{ fontSize: 11, color: "#1A5FA8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, letterSpacing: "0.05em" }}>
              VIEW ALL
            </button>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#8FA3BB", fontSize: 12 }}>Loading...</div>
          ) : recentCases.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center" }}>
              <FolderOpen size={36} color="#D8E2EE" strokeWidth={1.2} style={{ margin: "0 auto 12px", display: "block" }} />
              <div style={{ fontSize: 13, color: "#8FA3BB" }}>No cases yet.</div>
              <div style={{ fontSize: 11, color: "#C4D0DC", marginTop: 4 }}>Open your first case to get started.</div>
            </div>
          ) : recentCases.map((c, i) => (
            <div key={c.id} onClick={() => router.push(`/dashboard/cases/${c.id}`)}
              style={{
                padding: "16px 24px", borderBottom: i < recentCases.length - 1 ? "1px solid #F7F9FC" : "none",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#F7F9FC"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "#1A5FA8", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 3 }}>{c.caseNumber}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2 }}>{c.category}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: statusColor(c.status), background: statusColor(c.status) + "15", padding: "3px 9px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {c.status}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, color: priorityColor(c.priority) }}>
                  {c.priority} Priority
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.06)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Quick Actions</div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Open New Case", href: "/dashboard/cases", icon: FolderOpen, color: "#1A5FA8" },
                { label: "Log CDR Request", href: "/dashboard/cdr", icon: Phone, color: "#D4730A" },
                { label: "Add Fraud Entity", href: "/dashboard/fraud", icon: ShieldAlert, color: "#C0392B" },
                { label: "International Request", href: "/dashboard/international", icon: Globe, color: "#6B3FA0" },
              ].map(a => (
                <button key={a.href} onClick={() => router.push(a.href)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                  background: "#F7F9FC", border: "1px solid #EEF2F7", borderRadius: 5,
                  cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                  fontSize: 12, fontWeight: 600, color: "#0B1F3A",
                  transition: "all 0.15s", textAlign: "left",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = a.color; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = a.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#F7F9FC"; e.currentTarget.style.color = "#0B1F3A"; e.currentTarget.style.borderColor = "#EEF2F7"; }}
                >
                  <a.icon size={15} />{a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}