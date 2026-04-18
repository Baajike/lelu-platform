"use client";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FolderOpen, Phone, ShieldAlert, Globe,
  CheckCircle, XCircle, UserPlus, AlertTriangle,
  TrendingUp, BookOpen, BarChart2,
} from "lucide-react";

const CATEGORY_COLORS = {
  "Electronic Fraud":                "#C0392B",
  "Cyberstalking":                   "#D4730A",
  "Computer Access Offences":        "#1A5FA8",
  "Child Exploitation":              "#7D1616",
  "Identity Related Crimes":         "#6B3FA0",
  "Data Interference":               "#1A7A4A",
  "System Interference":             "#0B6B7A",
  "Critical Infrastructure Attacks": "#5D2E8C",
  "Other":                           "#8FA3BB",
};

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

const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const DAY_MS = 1000 * 60 * 60 * 24;

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [stats,        setStats]        = useState({ cases: 0, pendingCdrs: 0, intelItems: 0, activeCases: 0, intlRequests: 0 });
  const [recentCases,  setRecentCases]  = useState([]);
  const [allCases,     setAllCases]     = useState([]);
  const [allCdrs,      setAllCdrs]      = useState([]);
  const [allIntl,      setAllIntl]      = useState([]);
  const [allEntries,   setAllEntries]   = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [teamStats,    setTeamStats]    = useState([]);
  const [approving,    setApproving]    = useState({});
  const [loading,      setLoading]      = useState(true);

  const isAdmin    = ["HEAD_OF_UNIT", "SUPERVISOR", "OFFICE_ADMINISTRATOR", "ADMIN"].includes(session?.user?.role);
  const isHeadAdmin = ["HEAD_OF_UNIT", "ADMIN"].includes(session?.user?.role);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, cdrsRes, intlRes, entriesRes] = await Promise.all([
          fetch("/api/cases"),
          fetch("/api/cdr"),
          fetch("/api/international"),
          fetch("/api/entries"),
        ]);
        const cases   = await casesRes.json();
        const cdrs    = await cdrsRes.json();
        const intl    = await intlRes.json();
        const entries = await entriesRes.json();

        const caseList    = Array.isArray(cases)   ? cases   : [];
        const cdrList     = Array.isArray(cdrs)    ? cdrs    : [];
        const intlList    = Array.isArray(intl)    ? intl    : [];
        const entryList   = Array.isArray(entries) ? entries : [];

        setStats({
          cases:        caseList.length,
          activeCases:  caseList.filter(c => c.status === "Active").length,
          pendingCdrs:  cdrList.filter(c => c.status === "Pending").length,
          intelItems:   caseList.length + cdrList.length + intlList.length,
          intlRequests: intlList.filter(r => r.status === "Pending").length,
        });
        setRecentCases(caseList.slice(0, 6));
        setAllCases(caseList);
        setAllCdrs(cdrList);
        setAllIntl(intlList);
        setAllEntries(entryList);
      } catch { }
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

  // ── Stale cases: Active + 30+ days old + no entry in 7 days ─────────────
  const staleCases = useMemo(() => {
    if (!isHeadAdmin) return [];
    const now = Date.now();
    return allCases.filter(c => {
      if (c.status !== "Active") return false;
      if ((now - new Date(c.createdAt).getTime()) / DAY_MS < 30) return false;
      const latestEntry = c.entries?.[0]; // take:1 — most recent entry
      if (!latestEntry) return true;
      return (now - new Date(latestEntry.createdAt).getTime()) / DAY_MS >= 7;
    });
  }, [allCases, isHeadAdmin]);

  // ── Weekly digest ─────────────────────────────────────────────────────────
  const weeklyDigest = useMemo(() => {
    const weekStart = getWeekStart();
    const isThisWeek = (dateStr) => new Date(dateStr) >= weekStart;

    const casesThisWeek = allCases.filter(c => isThisWeek(c.createdAt));
    const cdrsThisWeek  = allCdrs.filter(c  => isThisWeek(c.requestedAt));
    const intlThisWeek  = allIntl.filter(r  => isThisWeek(r.createdAt));
    const entriesThisWeek = allEntries.filter(e => isThisWeek(e.createdAt));

    // Most active officer by entry count
    const authorCount = {};
    entriesThisWeek.forEach(e => {
      const name = e.author?.name;
      if (name) authorCount[name] = (authorCount[name] || 0) + 1;
    });
    const topEntry = Object.entries(authorCount).sort((a, b) => b[1] - a[1])[0];
    const topOfficer = topEntry ? { name: topEntry[0], count: topEntry[1] } : null;

    return {
      cases:   casesThisWeek.length,
      entries: entriesThisWeek.length,
      cdrs:    cdrsThisWeek.length,
      intl:    intlThisWeek.length,
      topOfficer,
    };
  }, [allCases, allCdrs, allIntl, allEntries]);

  // ── Personal stats for non-head-admin roles ───────────────────────────────
  const personalStats = useMemo(() => {
    const userId = session?.user?.id;
    const weekStart = getWeekStart();
    const activeCases   = allCases.filter(c => c.status === "Active").length;
    const myCdrs        = userId ? allCdrs.filter(c => c.officerId === userId) : [];
    const pendingCdrs   = myCdrs.filter(c => c.status === "Pending").length;
    const myCdrTotal    = myCdrs.length;
    const myWeekEntries = userId
      ? allEntries.filter(e => e.authorId === userId && new Date(e.createdAt) >= weekStart).length
      : 0;
    const casesThisWeek = allCases.filter(c => new Date(c.createdAt) >= weekStart).length;
    return { activeCases, pendingCdrs, myCdrTotal, myWeekEntries, casesThisWeek };
  }, [allCases, allCdrs, allEntries, session]);

  // ── Category breakdown for heatmap ───────────────────────────────────────
  const categoryBreakdown = useMemo(() => {
    if (!allCases.length) return [];
    const map = {};
    allCases.forEach(c => {
      const cat = c.category || "Other";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({
        category: cat,
        count,
        pct: Math.round(count / allCases.length * 100),
        color: CATEGORY_COLORS[cat] || "#8FA3BB",
      }));
  }, [allCases]);

  const statusColor   = (s) => s === "Active" ? "#1A7A4A" : s === "Closed" ? "#4E6478" : "#D4730A";
  const priorityColor = (p) => p === "High"   ? "#C0392B" : p === "Medium" ? "#D4730A" : "#1A7A4A";

  return (
    <div style={{ padding: 32 }}>
      <style>{`
        @keyframes lelu-spin { to { transform: rotate(360deg); } }
        .lelu-spinner { width: 28px; height: 28px; border: 3px solid #EEF2F7; border-top-color: #1A5FA8; border-radius: 50%; animation: lelu-spin 0.7s linear infinite; margin: 0 auto; }
      `}</style>

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
          cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#154d8a"}
          onMouseLeave={e => e.currentTarget.style.background = "#1A5FA8"}
        >+ New Case</button>
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
        <StatCard label="Total Cases"    value={stats.cases}        icon={FolderOpen} color="#1A5FA8" sub={`${stats.activeCases} active`} />
        <StatCard label="Pending CDRs"   value={stats.pendingCdrs}  icon={Phone}      color="#D4730A" sub="Awaiting telco response" />
        <StatCard label="Intel Items"    value={stats.intelItems}   icon={ShieldAlert} color="#C0392B" sub="Cases, CDR & network" />
        <StatCard label="Intl. Requests" value={stats.intlRequests} icon={Globe}      color="#6B3FA0" sub="Pending response" />
      </div>

      {/* Crime Intelligence Overview — heatmap by category */}
      {isHeadAdmin && !loading && categoryBreakdown.length > 0 && (
        <div style={{
          background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
          overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.06)", marginBottom: 28,
        }}>
          <div style={{
            padding: "18px 24px", borderBottom: "1px solid #EEF2F7", background: "#0B1F3A",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <BarChart2 size={14} color="#4E6478" strokeWidth={1.8} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Crime Intelligence Overview</div>
              <div style={{ fontSize: 11, color: "#4E6478", marginTop: 1 }}>
                {allCases.length} total cases · distribution by offence category
              </div>
            </div>
          </div>
          <div style={{ padding: "8px 24px 16px" }}>
            {categoryBreakdown.map((item, i) => (
              <div key={item.category} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "9px 0",
                borderBottom: i < categoryBreakdown.length - 1 ? "1px solid #F7F9FC" : "none",
              }}>
                {/* Category label */}
                <div style={{ width: 220, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: i === 0 ? 700 : 400, color: "#0B1F3A" }}>
                    {item.category}
                  </span>
                  {i === 0 && (
                    <span style={{ marginLeft: 7, fontSize: 9, fontWeight: 700, background: "#FEF3E2", color: "#D4730A", padding: "1px 6px", borderRadius: 2, letterSpacing: "0.04em" }}>
                      TOP
                    </span>
                  )}
                </div>
                {/* Bar track */}
                <div style={{ flex: 1, height: 8, background: "#EEF2F7", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.max(item.pct, 2)}%`,
                    background: item.color,
                    borderRadius: 4,
                    opacity: i === 0 ? 1 : 0.75,
                  }} />
                </div>
                {/* Count + pct */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0, minWidth: 72, justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.count}</span>
                  <span style={{ fontSize: 11, color: "#8FA3BB", minWidth: 34, textAlign: "right" }}>{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Overview — HEAD_OF_UNIT and ADMIN only */}
      {isHeadAdmin && teamStats.length > 0 && (
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
              style={{ fontSize: 11, color: "#1A5FA8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, letterSpacing: "0.05em", transition: "opacity 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.65"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              VIEW ALL CASES
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}>
            {teamStats.map((u) => {
              const activeCases    = u.cases?.length ?? 0;
              const weeklyEntries  = u.entries?.length ?? 0;
              const cdrCount       = u._count?.cdrRequests ?? 0;
              const score          = activeCases * 3 + weeklyEntries * 2 + cdrCount;
              const scoreCol       = score > 10 ? "#1A7A4A" : score >= 5 ? "#D4730A" : "#8FA3BB";

              return (
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
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
                      <div style={{ fontSize: 10, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {roleLabel(u.role)}
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#1A7A4A" }}>{activeCases}</div>
                      <div style={{ fontSize: 9, color: "#8FA3BB", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Active</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#D4730A" }}>{cdrCount}</div>
                      <div style={{ fontSize: 9, color: "#8FA3BB", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>CDRs</div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{
                        fontSize: 20, fontWeight: 800, color: scoreCol,
                        background: scoreCol + "18", borderRadius: 4,
                        padding: "2px 8px", display: "inline-block", minWidth: 36, textAlign: "center",
                      }}>{score}</div>
                      <div style={{ fontSize: 9, color: "#8FA3BB", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>Score</div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div style={{ marginTop: 10, height: 3, background: "#EEF2F7", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(score * 4, 100)}%`, background: scoreCol, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cases Needing Attention — HEAD_OF_UNIT and ADMIN only */}
      {isHeadAdmin && !loading && (
        <div style={{
          background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
          overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.06)", marginBottom: 28,
        }}>
          <div style={{
            padding: "18px 24px", borderBottom: "1px solid #EEF2F7",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: staleCases.length > 0 ? "#FFFBF5" : "white",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle size={16} color={staleCases.length > 0 ? "#D4730A" : "#1A7A4A"} strokeWidth={2} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Cases Needing Attention</div>
                <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 1 }}>
                  Active cases open 30+ days with no journal entry in the last 7 days.
                </div>
              </div>
            </div>
            {staleCases.length > 0 && (
              <span style={{
                background: "#FEF3E2", color: "#D4730A", fontSize: 11,
                fontWeight: 700, padding: "4px 12px", borderRadius: 3, letterSpacing: "0.05em",
              }}>{staleCases.length} {staleCases.length === 1 ? "CASE" : "CASES"}</span>
            )}
          </div>

          {staleCases.length === 0 ? (
            <div style={{ padding: "24px 24px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E6F5EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CheckCircle size={16} color="#1A7A4A" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A7A4A" }}>All cases are active</div>
                <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 1 }}>Every open case has had a journal entry within the last 7 days.</div>
              </div>
            </div>
          ) : staleCases.map((c, i) => {
            const latestEntry = c.entries?.[0];
            const daysSinceEntry = latestEntry
              ? Math.floor((Date.now() - new Date(latestEntry.createdAt).getTime()) / DAY_MS)
              : null;
            const daysOpen = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / DAY_MS);

            return (
              <div key={c.id} style={{
                padding: "16px 24px",
                borderBottom: i < staleCases.length - 1 ? "1px solid #F7F9FC" : "none",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                {/* Case info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#1A5FA8", letterSpacing: "0.05em" }}>{c.caseNumber}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, background: "#FEF3E2", color: "#D4730A", padding: "2px 7px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {daysOpen}d open
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 400 }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2 }}>
                    {c.officer?.name || "Unassigned"}
                    {daysSinceEntry !== null
                      ? <span style={{ color: "#D4730A", fontWeight: 600 }}> · {daysSinceEntry}d since last entry</span>
                      : <span style={{ color: "#C0392B", fontWeight: 600 }}> · No entries yet</span>}
                  </div>
                </div>

                {/* View Case button */}
                <button
                  onClick={() => router.push(`/dashboard/cases/${c.id}`)}
                  style={{
                    background: "#0B1F3A", color: "white", border: "none",
                    padding: "8px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                    flexShrink: 0, whiteSpace: "nowrap", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1A5FA8"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0B1F3A"}
                >
                  View Case
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Personal Stats Widget — officer / non-head-admin view */}
      {!isHeadAdmin && !loading && (
        <div style={{ marginBottom: 28 }}>
          {/* Motivational status banner */}
          <div style={{
            borderRadius: 6, padding: "14px 20px", marginBottom: 20,
            display: "flex", alignItems: "center", gap: 14,
            background: personalStats.activeCases > 0 ? "#EBF3FB" : "#E6F5EE",
            border: `1px solid ${personalStats.activeCases > 0 ? "#C8DFF5" : "#B3E0C8"}`,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: personalStats.activeCases > 0 ? "#1A5FA8" : "#1A7A4A",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FolderOpen size={16} color="white" strokeWidth={2} />
            </div>
            <div style={{ fontSize: 13, color: "#0B1F3A", lineHeight: 1.6 }}>
              {personalStats.activeCases > 0 ? (
                <>
                  You have{" "}
                  <strong>{personalStats.activeCases} active case{personalStats.activeCases !== 1 ? "s" : ""}</strong>{" "}
                  requiring your attention.
                </>
              ) : (
                <strong style={{ color: "#1A7A4A" }}>No active cases at the moment.</strong>
              )}
              {personalStats.myWeekEntries > 0 && (
                <span style={{ color: "#1A7A4A" }}>
                  {" "}·{" "}{personalStats.myWeekEntries} journal {personalStats.myWeekEntries === 1 ? "entry" : "entries"} logged this week.
                </span>
              )}
            </div>
          </div>

          {/* Personal mini stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div style={{ background: "white", borderRadius: 6, padding: "20px 22px", border: "1px solid #E2E8F0", borderTop: "3px solid #1A5FA8", boxShadow: "0 1px 6px rgba(11,31,58,0.06)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>My Active Cases</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#0B1F3A", lineHeight: 1 }}>{personalStats.activeCases}</div>
              <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 6 }}>
                {personalStats.casesThisWeek > 0 ? `${personalStats.casesThisWeek} opened this week` : "No new cases this week"}
              </div>
            </div>
            <div style={{ background: "white", borderRadius: 6, padding: "20px 22px", border: "1px solid #E2E8F0", borderTop: "3px solid #D4730A", boxShadow: "0 1px 6px rgba(11,31,58,0.06)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>My CDR Requests</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#0B1F3A", lineHeight: 1 }}>{personalStats.myCdrTotal}</div>
              <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 6 }}>
                {personalStats.pendingCdrs > 0 ? <span style={{ color: "#D4730A", fontWeight: 600 }}>{personalStats.pendingCdrs} pending response</span> : "No pending CDRs"}
              </div>
            </div>
            <div style={{ background: "white", borderRadius: 6, padding: "20px 22px", border: "1px solid #E2E8F0", borderTop: "3px solid #1A7A4A", boxShadow: "0 1px 6px rgba(11,31,58,0.06)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Entries This Week</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#0B1F3A", lineHeight: 1 }}>{personalStats.myWeekEntries}</div>
              <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 6 }}>
                {personalStats.myWeekEntries > 0 ? "Journal entries logged" : "No entries yet this week"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

        {/* Recent Cases */}
        <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.06)" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Recent Cases</div>
            <button onClick={() => router.push("/dashboard/cases")} style={{ fontSize: 11, color: "#1A5FA8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, letterSpacing: "0.05em", transition: "opacity 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.65"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              VIEW ALL
            </button>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center" }}><div className="lelu-spinner" /></div>
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

        {/* Right column — Quick Actions + Weekly Digest */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Quick Actions */}
          <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.06)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Quick Actions</div>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Open New Case",          href: "/dashboard/cases",         icon: FolderOpen, color: "#1A5FA8" },
                { label: "Log CDR Request",         href: "/dashboard/cdr",           icon: Phone,      color: "#D4730A" },
                { label: "Intel DB",                href: "/dashboard/fraud",         icon: ShieldAlert, color: "#C0392B" },
                { label: "International Request",   href: "/dashboard/international", icon: Globe,      color: "#6B3FA0" },
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

          {/* This Week's Activity — HEAD_OF_UNIT and ADMIN only */}
          {isHeadAdmin && (
            <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.06)" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7", background: "#0B1F3A" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={14} color="#4E6478" strokeWidth={1.8} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>This Week's Activity</div>
                </div>
                <div style={{ fontSize: 10, color: "#4E6478", marginTop: 2 }}>
                  {getWeekStart().toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – today
                </div>
              </div>

              <div style={{ padding: "6px 0" }}>
                {[
                  { label: "Cases Opened",     value: weeklyDigest.cases,   icon: FolderOpen,  color: "#1A5FA8" },
                  { label: "Journal Entries",  value: weeklyDigest.entries, icon: BookOpen,    color: "#1A7A4A" },
                  { label: "CDR Requests",     value: weeklyDigest.cdrs,    icon: Phone,       color: "#D4730A" },
                  { label: "Network Requests", value: weeklyDigest.intl,    icon: Globe,       color: "#6B3FA0" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderBottom: "1px solid #F7F9FC" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 5, background: row.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <row.icon size={13} color={row.color} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1, fontSize: 12, color: "#4E6478" }}>{row.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: row.value > 0 ? "#0B1F3A" : "#C4D0DC" }}>
                      {loading ? "—" : row.value}
                    </div>
                  </div>
                ))}

                {/* Most active officer */}
                <div style={{ padding: "12px 20px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    Most Active This Week
                  </div>
                  {loading ? (
                    <div style={{ fontSize: 12, color: "#C4D0DC" }}>—</div>
                  ) : weeklyDigest.topOfficer ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1A5FA8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
                        {weeklyDigest.topOfficer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0B1F3A" }}>{weeklyDigest.topOfficer.name}</div>
                        <div style={{ fontSize: 10, color: "#8FA3BB" }}>{weeklyDigest.topOfficer.count} journal {weeklyDigest.topOfficer.count === 1 ? "entry" : "entries"}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: "#C4D0DC" }}>No entries logged yet this week.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Your Activity — officer / non-head-admin view */}
          {!isHeadAdmin && (
            <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.06)" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7", background: "#0B1F3A" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={14} color="#4E6478" strokeWidth={1.8} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Your Activity</div>
                </div>
                <div style={{ fontSize: 10, color: "#4E6478", marginTop: 2 }}>
                  {getWeekStart().toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – today
                </div>
              </div>
              <div style={{ padding: "6px 0" }}>
                {[
                  { label: "Cases Opened",       value: personalStats.casesThisWeek, icon: FolderOpen, color: "#1A5FA8" },
                  { label: "Journal Entries",     value: personalStats.myWeekEntries, icon: BookOpen,   color: "#1A7A4A" },
                  { label: "My CDR Requests",     value: personalStats.myCdrTotal,    icon: Phone,      color: "#D4730A" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderBottom: "1px solid #F7F9FC" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 5, background: row.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <row.icon size={13} color={row.color} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1, fontSize: 12, color: "#4E6478" }}>{row.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: row.value > 0 ? "#0B1F3A" : "#C4D0DC" }}>
                      {loading ? "—" : row.value}
                    </div>
                  </div>
                ))}
                <div style={{ padding: "12px 20px" }}>
                  <div style={{ fontSize: 11, color: "#8FA3BB", lineHeight: 1.6 }}>
                    {personalStats.pendingCdrs > 0
                      ? <><span style={{ color: "#D4730A", fontWeight: 600 }}>{personalStats.pendingCdrs} CDR request{personalStats.pendingCdrs !== 1 ? "s" : ""}</span> awaiting telco response.</>
                      : "All CDR requests fulfilled."}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
