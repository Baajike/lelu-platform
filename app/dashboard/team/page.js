"use client";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, FolderOpen, Search } from "lucide-react";

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

const formatLastActive = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / (1000 * 60));
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function TeamPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetch("/api/users?withStats=true")
      .then(r => r.json())
      .then(d => setTeam(Array.isArray(d) ? d : []))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return team.filter(u => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    });
  }, [team, query, roleFilter]);

  const roles = useMemo(() => {
    const seen = new Set();
    team.forEach(u => { if (u.role) seen.add(u.role); });
    return Array.from(seen);
  }, [team]);

  return (
    <div style={{ padding: 32 }}>
      <style>{`
        @keyframes lelu-spin { to { transform: rotate(360deg); } }
        .lelu-spinner { width: 28px; height: 28px; border: 3px solid #EEF2F7; border-top-color: #1A5FA8; border-radius: 50%; animation: lelu-spin 0.7s linear infinite; margin: 0 auto; }
        .team-row:hover td { background: #F7F9FC; }
        .team-search:focus { border-color: #1A5FA8; }
      `}</style>

      {/* Page header */}
      <div style={{
        background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
        padding: "20px 24px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: "0 1px 4px rgba(11,31,58,0.05)",
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 6, background: "#EBF3FB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Users size={20} color="#1A5FA8" strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0B1F3A" }}>Team</div>
          <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 2 }}>
            {loading ? "Loading…" : `${team.length} ${team.length === 1 ? "member" : "members"} across the unit`}
          </div>
        </div>
      </div>

      {/* Toolbar: search + role filter */}
      <div style={{
        background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
        padding: "14px 20px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        boxShadow: "0 1px 4px rgba(11,31,58,0.05)",
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={13} color="#8FA3BB" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="team-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 4,
              padding: "9px 14px 9px 34px", fontSize: 13, color: "#0B1F3A",
              outline: "none", boxSizing: "border-box",
              fontFamily: "'Segoe UI', sans-serif", background: "white",
              transition: "border-color 0.2s",
            }}
          />
        </div>
        <button onClick={() => setRoleFilter("")} style={{
          fontSize: 12, padding: "7px 16px", borderRadius: 4, cursor: "pointer",
          fontFamily: "'Segoe UI', sans-serif", border: "1px solid #E2E8F0",
          fontWeight: !roleFilter ? 700 : 400,
          background: !roleFilter ? "#0B1F3A" : "white",
          color: !roleFilter ? "white" : "#4E6478",
          transition: "all 0.15s",
        }}>All Roles</button>
        {roles.map(r => {
          const isActive = roleFilter === r;
          const rc = roleColor(r);
          return (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              fontSize: 12, padding: "7px 14px", borderRadius: 4, cursor: "pointer",
              fontFamily: "'Segoe UI', sans-serif",
              border: `1px solid ${isActive ? rc.color : "#E2E8F0"}`,
              fontWeight: isActive ? 700 : 400,
              background: isActive ? rc.bg : "white",
              color: isActive ? rc.color : "#4E6478",
              transition: "all 0.15s",
            }}>{roleLabel(r)}</button>
          );
        })}
      </div>

      {/* Team Table */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F9FC", borderBottom: "1px solid #E2E8F0" }}>
              {["Officer", "Role", "Active Cases", "Last Active"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: 48, textAlign: "center" }}><div className="lelu-spinner" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 72, textAlign: "center" }}>
                  <Users size={40} color="#D8E2EE" strokeWidth={1} style={{ margin: "0 auto 14px", display: "block" }} />
                  <div style={{ fontSize: 13, color: "#8FA3BB" }}>
                    {team.length === 0 ? "No approved team members yet." : "No members match your filters."}
                  </div>
                </td>
              </tr>
            ) : filtered.map((u, i) => {
              const rc = roleColor(u.role);
              const activeCases = u.cases?.length ?? 0;
              const isMe = session?.user?.id === u.id;
              return (
                <tr key={u.id} className="team-row" style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F7F9FC" : "none" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%", background: "#0B1F3A",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0,
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>{u.name}</span>
                          {isMe && (
                            <span style={{ fontSize: 9, fontWeight: 700, color: "#1A5FA8", background: "#EBF3FB", padding: "2px 7px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>You</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 1 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, background: rc.bg, color: rc.color, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button
                      onClick={() => router.push(`/dashboard/cases?officerId=${u.id}`)}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        background: "#F7F9FC", border: "1px solid #EEF2F7", borderRadius: 4,
                        padding: "5px 12px", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#EBF3FB"; e.currentTarget.style.borderColor = "#C8DFF5"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#F7F9FC"; e.currentTarget.style.borderColor = "#EEF2F7"; }}
                      title="View this officer's cases"
                    >
                      <FolderOpen size={13} color="#1A7A4A" strokeWidth={1.8} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>{activeCases}</span>
                    </button>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 12, color: "#4E6478", whiteSpace: "nowrap" }}>
                    {formatLastActive(u.lastActive)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
