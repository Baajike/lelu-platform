"use client";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, Phone, ShieldAlert,
  Globe, FileBarChart2, ChevronRight, LogOut,
  Bell, Settings, Users, AlertCircle, Clock, X,
  User, KeyRound, Eye, EyeOff, Mail, Check,
} from "lucide-react";

const navItems = [
  { id: "dashboard",     label: "Dashboard",      icon: LayoutDashboard, href: "/dashboard" },
  { id: "cases",         label: "Case Management", icon: FolderOpen,      href: "/dashboard/cases" },
  { id: "cdr",           label: "CDR",             icon: Phone,           href: "/dashboard/cdr" },
  { id: "fraud",         label: "Intel DB",        icon: ShieldAlert,     href: "/dashboard/fraud" },
  { id: "international", label: "24/7 Network",    icon: Globe,           href: "/dashboard/international" },
  { id: "reports",       label: "Reports",         icon: FileBarChart2,   href: "/dashboard/reports" },
];

const APPROVAL_ROLES = ["HEAD_OF_UNIT", "OFFICE_ADMINISTRATOR", "ADMIN"];
const HEAD_ONLY      = ["HEAD_OF_UNIT"];

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

const daysSince = (dateStr) =>
  Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router   = useRouter();

  const [pageTitle,  setPageTitle]  = useState("Dashboard");
  const [pageDate,   setPageDate]   = useState("");
  const [mounted,    setMounted]    = useState(false);
  const [pageKey,    setPageKey]    = useState(pathname);
  const [bellOpen,     setBellOpen]     = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showPwModal,  setShowPwModal]  = useState(false);
  const [pwForm,       setPwForm]       = useState({ current: "", next: "", confirm: "" });
  const [pwState,      setPwState]      = useState({ loading: false, error: "", success: false });
  const [showCurrent,  setShowCurrent]  = useState(false);
  const [showNext,     setShowNext]     = useState(false);

  // Notification buckets
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [staleCases,       setStaleCases]       = useState([]);
  const [staleCdrs,        setStaleCdrs]        = useState([]);
  const [staleIntl,        setStaleIntl]        = useState([]);
  const [personalNotifs,   setPersonalNotifs]   = useState([]);
  const [notifWorking,     setNotifWorking]     = useState(null); // "id_accept" | "id_decline"

  const bellRef     = useRef(null);
  const settingsRef = useRef(null);

  // ── Auth redirect ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  // ── Page title + key ──────────────────────────────────────────────────────
  useEffect(() => {
    const active = navItems.find(n =>
      pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href))
    );
    if (active) setPageTitle(active.label.toUpperCase());
    else if (pathname.startsWith("/dashboard/admin")) setPageTitle("USER MANAGEMENT");
    setPageDate(new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    setPageKey(pathname);
    setBellOpen(false);
    setSettingsOpen(false); // close panels on navigation
  }, [pathname]);

  // ── Fetch notifications ───────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    const role = session.user.role;
    const DAY = 1000 * 60 * 60 * 24;
    const now  = Date.now();

    // Pending approvals (all admin roles)
    if (APPROVAL_ROLES.includes(role)) {
      fetch("/api/users?pending=true")
        .then(r => r.json())
        .then(d => setPendingApprovals(Array.isArray(d) ? d : []))
        .catch(() => setPendingApprovals([]));
    }

    // Stale cases, CDR, international (HEAD_OF_UNIT only)
    if (HEAD_ONLY.includes(role)) {
      // Stale cases: Active + opened 30+ days ago + no journal entry in last 7 days
      fetch("/api/cases")
        .then(r => r.json())
        .then(d => {
          if (!Array.isArray(d)) return;
          const stale = d.filter(c => {
            if (c.status !== "Active") return false;
            if ((now - new Date(c.createdAt).getTime()) / DAY < 30) return false;
            const hasRecentEntry = (c.entries || []).some(
              e => (now - new Date(e.createdAt).getTime()) / DAY < 7
            );
            return !hasRecentEntry;
          });
          setStaleCases(stale);
        })
        .catch(() => setStaleCases([]));

      // Pending CDR requests older than 14 days
      fetch("/api/cdr")
        .then(r => r.json())
        .then(d => {
          if (!Array.isArray(d)) return;
          setStaleCdrs(
            d.filter(c => c.status === "Pending" && (now - new Date(c.requestedAt).getTime()) / DAY > 14)
          );
        })
        .catch(() => setStaleCdrs([]));

      // Pending international requests older than 14 days
      fetch("/api/international")
        .then(r => r.json())
        .then(d => {
          if (!Array.isArray(d)) return;
          setStaleIntl(
            d.filter(r => r.status === "Pending" && (now - new Date(r.createdAt).getTime()) / DAY > 14)
          );
        })
        .catch(() => setStaleIntl([]));
    }
  }, [session]);

  // ── Personal notifications (all users) — poll every 30 s ─────────────────
  useEffect(() => {
    if (!session) return;
    const fetchPersonalNotifs = () => {
      fetch("/api/notifications")
        .then(r => r.json())
        .then(d => setPersonalNotifs(Array.isArray(d) ? d : []))
        .catch(() => {});
    };
    fetchPersonalNotifs();
    const interval = setInterval(fetchPersonalNotifs, 30000);
    return () => clearInterval(interval);
  }, [session]);

  // ── Close bell panel on outside click ────────────────────────────────────
  useEffect(() => {
    if (!bellOpen) return;
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bellOpen]);

  // ── Close settings panel on outside click ────────────────────────────────
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [settingsOpen]);

  // ── Change password submit ────────────────────────────────────────────────
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
        setTimeout(() => { setShowPwModal(false); setPwState({ loading: false, error: "", success: false }); }, 1400);
      }
    } catch {
      setPwState({ loading: false, error: "Network error. Please try again.", success: false });
    }
  };

  // ── Handle case invitation accept / decline ───────────────────────────────
  const handleInvitationResponse = async (notif, action) => {
    setNotifWorking(notif.id + "_" + action);
    try {
      const meta = JSON.parse(notif.meta || "{}");
      if (!meta.assignmentId || !meta.caseId) return;

      await fetch(`/api/cases/${meta.caseId}/assignments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: meta.assignmentId, action }),
      });

      // Mark notification read and remove from local state immediately
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notif.id }),
      }).catch(() => {});

      setPersonalNotifs(prev => prev.filter(n => n.id !== notif.id));

      if (action === "accept") {
        setBellOpen(false);
        router.push(notif.link || `/dashboard/cases/${meta.caseId}`);
      }
    } finally {
      setNotifWorking(null);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalNotifs = pendingApprovals.length + staleCases.length + staleCdrs.length + staleIntl.length + personalNotifs.length;

  const navigate = (href) => {
    setBellOpen(false);
    router.push(href);
  };

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B1F3A" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <img src="/csa-logo.png" alt="CSA" style={{ width: 42, height: 42, borderRadius: "50%" }} />
          </div>
          <div style={{ fontSize: 12, color: "#4E6478", letterSpacing: "0.1em" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const role = session.user.role;
  const rc   = roleColor(role);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F7F9FC", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInPage {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nav-btn { transition: background 0.2s, border-color 0.2s, color 0.2s; }
        .nav-btn:hover { background: #112847 !important; }
        .nav-btn:hover span { color: white !important; }
        .nav-btn:hover svg { color: white !important; stroke: white !important; }
        .signout-btn:hover { background: #1E3A5F !important; }
        .notif-item { transition: background 0.12s; cursor: pointer; }
        .notif-item:hover { background: #F7F9FC !important; }
        .settings-item:hover { background: #F7F9FC !important; }
      `}</style>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <div style={{
        width: 240,
        background: "#0B1F3A",
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateX(0)" : "translateX(-32px)",
        transition: "opacity 1s cubic-bezier(.4,0,.2,1), transform 1s cubic-bezier(.4,0,.2,1)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1E3A5F" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              <img src="/csa-logo.png" alt="CSA" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "white", letterSpacing: "0.05em" }}>LELU</div>
              <div style={{ fontSize: 9, color: "#4E6478", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 1 }}>Intelligence Platform</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <button key={item.id} className="nav-btn"
                onClick={() => router.push(item.href)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 20px", border: "none", cursor: "pointer",
                  background: isActive ? "#112847" : "transparent",
                  borderLeft: isActive ? "3px solid #1A5FA8" : "3px solid transparent",
                  textAlign: "left",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 1s cubic-bezier(.4,0,.2,1) ${0.1 + i * 0.06}s, transform 1s cubic-bezier(.4,0,.2,1) ${0.1 + i * 0.06}s, background 0.2s`,
                }}>
                <Icon size={16} color={isActive ? "white" : "#4E6478"} strokeWidth={1.8} />
                <span style={{ fontSize: 13, color: isActive ? "white" : "#8FA3BB", fontWeight: isActive ? 600 : 400, flex: 1 }}>
                  {item.label}
                </span>
                {isActive && <ChevronRight size={12} color="#4E6478" />}
              </button>
            );
          })}

          {/* User Management — HEAD_OF_UNIT only */}
          {role === "HEAD_OF_UNIT" && (() => {
            const isActive = pathname.startsWith("/dashboard/admin");
            return (
              <button className="nav-btn"
                onClick={() => router.push("/dashboard/admin")}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 20px", border: "none", cursor: "pointer",
                  background: isActive ? "#112847" : "transparent",
                  borderLeft: isActive ? "3px solid #1A5FA8" : "3px solid transparent",
                  textAlign: "left",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-16px)",
                  transition: "opacity 1s cubic-bezier(.4,0,.2,1) 0.7s, transform 1s cubic-bezier(.4,0,.2,1) 0.7s, background 0.2s",
                }}>
                <Users size={16} color={isActive ? "white" : "#4E6478"} strokeWidth={1.8} />
                <span style={{ fontSize: 13, color: isActive ? "white" : "#8FA3BB", fontWeight: isActive ? 600 : 400, flex: 1 }}>
                  User Management
                </span>
                {isActive && <ChevronRight size={12} color="#4E6478" />}
              </button>
            );
          })()}
        </nav>

        {/* User Profile */}
        <div style={{
          padding: "16px 20px", borderTop: "1px solid #1E3A5F",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s cubic-bezier(.4,0,.2,1) 0.5s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1A5FA8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session.user.name}
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: rc.bg, color: rc.color, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {roleLabel(role)}
              </span>
            </div>
          </div>
          <button className="signout-btn" onClick={() => signOut({ callbackUrl: "/login" })}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "#112847", border: "none", borderRadius: 4, cursor: "pointer", transition: "background 0.2s" }}>
            <LogOut size={14} color="#4E6478" />
            <span style={{ fontSize: 12, color: "#8FA3BB" }}>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, marginLeft: 240,
        display: "flex", flexDirection: "column", minHeight: "100vh",
        opacity: mounted ? 1 : 0,
        transition: "opacity 1s cubic-bezier(.4,0,.2,1) 0.2s",
      }}>

        {/* Top Bar */}
        <div style={{
          background: "#0B1F3A", padding: "0 32px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 40,
          boxShadow: "0 2px 8px rgba(11,31,58,0.2)",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "0.15em" }}>{pageTitle}</div>
            <div style={{ fontSize: 10, color: "#4E6478", marginTop: 1 }}>{pageDate}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

            {/* Bell with notification dropdown */}
            <div style={{ position: "relative" }} ref={bellRef}>
              <button
                onClick={() => setBellOpen(o => !o)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative" }}>
                <Bell size={18} color={bellOpen ? "white" : "#4E6478"} strokeWidth={1.8} />
                {totalNotifs > 0 && (
                  <span style={{
                    position: "absolute", top: 0, right: 0,
                    minWidth: 16, height: 16, borderRadius: 8,
                    background: "#C0392B", color: "white",
                    fontSize: 9, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 3px",
                    border: "2px solid #0B1F3A",
                  }}>{totalNotifs > 99 ? "99+" : totalNotifs}</span>
                )}
              </button>

              {/* Notification Panel */}
              {bellOpen && (
                <div style={{
                  position: "absolute", top: 44, right: -8,
                  width: 380,
                  background: "white",
                  borderRadius: 6,
                  boxShadow: "0 8px 32px rgba(11,31,58,0.22), 0 2px 8px rgba(11,31,58,0.1)",
                  border: "1px solid #E2E8F0",
                  zIndex: 60,
                  animation: "dropIn 0.18s cubic-bezier(.4,0,.2,1) both",
                  overflow: "hidden",
                }}>

                  {/* Panel header */}
                  <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #EEF2F7", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0B1F3A" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "white", letterSpacing: "0.08em", textTransform: "uppercase" }}>Notifications</div>
                      <div style={{ fontSize: 10, color: "#4E6478", marginTop: 1 }}>
                        {totalNotifs === 0 ? "No new notifications" : `${totalNotifs} item${totalNotifs !== 1 ? "s" : ""} requiring attention`}
                      </div>
                    </div>
                    <button onClick={() => setBellOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4E6478", padding: 4 }}>
                      <X size={14} color="#4E6478" />
                    </button>
                  </div>

                  <div style={{ maxHeight: 480, overflowY: "auto" }}>
                    {totalNotifs === 0 ? (
                      <div style={{ padding: "40px 20px", textAlign: "center" }}>
                        <Bell size={32} color="#D8E2EE" strokeWidth={1} style={{ margin: "0 auto 12px", display: "block" }} />
                        <div style={{ fontSize: 13, color: "#8FA3BB", fontWeight: 500 }}>All clear</div>
                        <div style={{ fontSize: 11, color: "#C4D0DC", marginTop: 4 }}>No items require your attention.</div>
                      </div>
                    ) : (
                      <>
                        {/* ── Case Invitations (personal, all users) ─── */}
                        {personalNotifs.length > 0 && (
                          <NotifSection
                            dot="#1A5FA8"
                            title="Case Invitations"
                            count={personalNotifs.length}
                            emptyText=""
                          >
                            {personalNotifs.map(n => (
                              <InvitationNotifItem
                                key={n.id}
                                notif={n}
                                working={notifWorking}
                                onAccept={() => handleInvitationResponse(n, "accept")}
                                onDecline={() => handleInvitationResponse(n, "decline")}
                                daysSince={daysSince}
                              />
                            ))}
                          </NotifSection>
                        )}

                        {/* ── Pending Approvals ──────────────────────── */}
                        {APPROVAL_ROLES.includes(role) && (
                          <NotifSection
                            dot="#C0392B"
                            title="Pending Approvals"
                            count={pendingApprovals.length}
                            emptyText="No pending registrations."
                          >
                            {pendingApprovals.map(u => (
                              <NotifItem
                                key={u.id}
                                icon={<AlertCircle size={13} color="#C0392B" strokeWidth={2} />}
                                label={u.name}
                                sub={`${roleLabel(u.role)} — registered ${daysSince(u.createdAt)}d ago`}
                                onClick={() => navigate("/dashboard/admin")}
                              />
                            ))}
                          </NotifSection>
                        )}

                        {/* ── Stale Cases ────────────────────────────── */}
                        {HEAD_ONLY.includes(role) && (
                          <NotifSection
                            dot="#D4730A"
                            title="Stale Cases"
                            count={staleCases.length}
                            emptyText="No stale cases."
                            sub="Active 30+ days, no entry in 7 days"
                          >
                            {staleCases.map(c => (
                              <NotifItem
                                key={c.id}
                                icon={<Clock size={13} color="#D4730A" strokeWidth={2} />}
                                label={c.title}
                                sub={`${c.caseNumber} — open ${daysSince(c.createdAt)} days${c.officer?.name ? ` · ${c.officer.name}` : ""}`}
                                onClick={() => navigate(`/dashboard/cases/${c.id}`)}
                              />
                            ))}
                          </NotifSection>
                        )}

                        {/* ── Stale CDR Requests ─────────────────────── */}
                        {HEAD_ONLY.includes(role) && (
                          <NotifSection
                            dot="#B7791F"
                            title="Overdue CDR Requests"
                            count={staleCdrs.length}
                            emptyText="No overdue CDR requests."
                            sub="Pending for 14+ days"
                          >
                            {staleCdrs.map(c => (
                              <NotifItem
                                key={c.id}
                                icon={<Phone size={13} color="#B7791F" strokeWidth={2} />}
                                label={c.phoneNumber}
                                sub={`${c.telco} — pending ${daysSince(c.requestedAt)} days${c.case?.caseNumber ? ` · ${c.case.caseNumber}` : ""}`}
                                onClick={() => navigate("/dashboard/cdr")}
                              />
                            ))}
                          </NotifSection>
                        )}

                        {/* ── Stale Network Requests ─────────────────── */}
                        {HEAD_ONLY.includes(role) && (
                          <NotifSection
                            dot="#1A5FA8"
                            title="Overdue Network Requests"
                            count={staleIntl.length}
                            emptyText="No overdue network requests."
                            sub="Pending for 14+ days"
                          >
                            {staleIntl.map(r => (
                              <NotifItem
                                key={r.id}
                                icon={<Globe size={13} color="#1A5FA8" strokeWidth={2} />}
                                label={r.subject?.length > 48 ? r.subject.slice(0, 48) + "…" : r.subject}
                                sub={`${r.country} · ${r.agency} — pending ${daysSince(r.createdAt)} days`}
                                onClick={() => navigate("/dashboard/international")}
                              />
                            ))}
                          </NotifSection>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings dropdown */}
            <div style={{ position: "relative" }} ref={settingsRef}>
              <button
                onClick={() => { setSettingsOpen(o => !o); setBellOpen(false); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <Settings size={18} color={settingsOpen ? "white" : "#4E6478"} strokeWidth={1.8} />
              </button>

              {settingsOpen && (
                <div style={{
                  position: "absolute", top: 44, right: -8,
                  width: 260,
                  background: "white",
                  borderRadius: 6,
                  boxShadow: "0 8px 32px rgba(11,31,58,0.22), 0 2px 8px rgba(11,31,58,0.1)",
                  border: "1px solid #E2E8F0",
                  zIndex: 60,
                  animation: "dropIn 0.18s cubic-bezier(.4,0,.2,1) both",
                  overflow: "hidden",
                }}>
                  {/* Profile card */}
                  <div style={{ padding: "16px 18px", background: "#0B1F3A", borderBottom: "1px solid #1E3A5F" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1A5FA8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white", flexShrink: 0 }}>
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user.name}</div>
                        <div style={{ fontSize: 10, color: "#8FA3BB", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user.email}</div>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: rc.bg, color: rc.color, letterSpacing: "0.05em", textTransform: "uppercase", display: "inline-block", marginTop: 3 }}>
                          {roleLabel(role)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "6px 0" }}>
                    <button
                      onClick={() => setSettingsOpen(false)}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", background: "none", border: "none", cursor: "default", textAlign: "left" }}>
                      <User size={14} color="#8FA3BB" strokeWidth={1.8} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1F3A" }}>{session.user.name}</div>
                        <div style={{ fontSize: 10, color: "#8FA3BB", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user.email}</div>
                      </div>
                    </button>

                    <div style={{ height: 1, background: "#EEF2F7", margin: "4px 0" }} />

                    <button
                      className="settings-item"
                      onClick={() => { setSettingsOpen(false); setPwForm({ current: "", next: "", confirm: "" }); setPwState({ loading: false, error: "", success: false }); setShowPwModal(true); }}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.12s" }}>
                      <KeyRound size={14} color="#4E6478" strokeWidth={1.8} />
                      <span style={{ fontSize: 13, color: "#0B1F3A" }}>Change Password</span>
                    </button>

                    <div style={{ height: 1, background: "#EEF2F7", margin: "4px 0" }} />

                    <button
                      className="settings-item"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.12s" }}>
                      <LogOut size={14} color="#C0392B" strokeWidth={1.8} />
                      <span style={{ fontSize: 13, color: "#C0392B", fontWeight: 500 }}>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1A5FA8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white" }}>
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div key={pageKey} style={{
          flex: 1, overflowY: "auto",
          animation: "fadeInPage 0.4s cubic-bezier(.4,0,.2,1) both",
        }}>
          {children}
        </div>
      </div>

      {/* ── Change Password Modal ─────────────────────────────────────── */}
      {showPwModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, width: 420, boxShadow: "0 24px 64px rgba(11,31,58,0.25)", overflow: "hidden" }}>

            {/* Modal header */}
            <div style={{ background: "#0B1F3A", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <KeyRound size={16} color="#4E6478" strokeWidth={1.8} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Change Password</div>
                  <div style={{ fontSize: 11, color: "#4E6478", marginTop: 1 }}>Update your account password.</div>
                </div>
              </div>
              <button onClick={() => setShowPwModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4E6478", padding: 4 }}>
                <X size={16} color="#4E6478" />
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: "24px 24px 20px" }}>

              {pwState.success ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E6F5EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <KeyRound size={22} color="#1A7A4A" strokeWidth={1.8} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1A7A4A" }}>Password updated</div>
                  <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 4 }}>Your password has been changed successfully.</div>
                </div>
              ) : (
                <>
                  {/* Current password */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Current Password *</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={pwForm.current}
                        onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && handleChangePassword()}
                        placeholder="Enter current password"
                        style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 4, padding: "10px 40px 10px 14px", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Segoe UI',sans-serif", color: "#0B1F3A" }}
                      />
                      <button onClick={() => setShowCurrent(v => !v)} tabIndex={-1}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2, color: "#8FA3BB" }}>
                        {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>New Password *</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showNext ? "text" : "password"}
                        value={pwForm.next}
                        onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && handleChangePassword()}
                        placeholder="At least 8 characters"
                        style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 4, padding: "10px 40px 10px 14px", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Segoe UI',sans-serif", color: "#0B1F3A" }}
                      />
                      <button onClick={() => setShowNext(v => !v)} tabIndex={-1}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2, color: "#8FA3BB" }}>
                        {showNext ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm new password */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Confirm New Password *</label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && handleChangePassword()}
                      placeholder="Re-enter new password"
                      style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 4, padding: "10px 14px", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Segoe UI',sans-serif", color: "#0B1F3A" }}
                    />
                  </div>

                  {/* Error */}
                  {pwState.error && (
                    <div style={{ background: "#FDECEA", border: "1px solid #F5C6C2", borderRadius: 4, padding: "9px 14px", marginBottom: 16, fontSize: 12, color: "#C0392B", display: "flex", alignItems: "center", gap: 8 }}>
                      <AlertCircle size={13} color="#C0392B" strokeWidth={2} />
                      {pwState.error}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button onClick={() => setShowPwModal(false)}
                      style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI',sans-serif" }}>
                      Cancel
                    </button>
                    <button onClick={handleChangePassword} disabled={pwState.loading}
                      style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: pwState.loading ? "not-allowed" : "pointer", fontFamily: "'Segoe UI',sans-serif", opacity: pwState.loading ? 0.7 : 1 }}>
                      {pwState.loading ? "Saving..." : "Update Password"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function NotifSection({ dot, title, count, sub, emptyText, children }) {
  return (
    <div style={{ borderBottom: "1px solid #EEF2F7" }}>
      <div style={{ padding: "10px 18px 8px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0, display: "inline-block" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#0B1F3A", textTransform: "uppercase", letterSpacing: "0.07em", flex: 1 }}>{title}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: count > 0 ? dot : "#C4D0DC", background: count > 0 ? dot + "18" : "#F7F9FC", padding: "2px 8px", borderRadius: 10 }}>{count}</span>
      </div>
      {sub && <div style={{ fontSize: 10, color: "#8FA3BB", padding: "0 18px 6px" }}>{sub}</div>}
      {count === 0 ? (
        <div style={{ padding: "8px 18px 12px", fontSize: 11, color: "#C4D0DC" }}>{emptyText}</div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}

function NotifItem({ icon, label, sub, onClick }) {
  return (
    <div className="notif-item" onClick={onClick}
      style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 18px", background: "white" }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1F3A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
        <div style={{ fontSize: 10, color: "#8FA3BB", marginTop: 1 }}>{sub}</div>
      </div>
      <ChevronRight size={11} color="#C4D0DC" style={{ flexShrink: 0, marginTop: 3 }} />
    </div>
  );
}

function InvitationNotifItem({ notif, working, onAccept, onDecline, daysSince }) {
  const isWorking = working && working.startsWith(notif.id);
  const daysAgo   = daysSince(notif.createdAt);

  return (
    <div style={{ padding: "11px 18px 12px", borderBottom: "1px solid #F7F9FC", background: "white" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: "#EBF3FB", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
        }}>
          <Mail size={13} color="#1A5FA8" strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0B1F3A" }}>{notif.title}</div>
          <div style={{ fontSize: 11, color: "#4E6478", marginTop: 2, lineHeight: 1.5 }}>{notif.message}</div>
          <div style={{ fontSize: 10, color: "#C4D0DC", marginTop: 3 }}>
            {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
          </div>
        </div>
      </div>

      {notif.assignmentStatus === "Pending" ? (
        <div style={{ display: "flex", gap: 8, paddingLeft: 38 }}>
          <button
            onClick={onAccept}
            disabled={isWorking}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: "#1A7A4A", color: "white", border: "none",
              padding: "7px 0", borderRadius: 4, fontSize: 11, fontWeight: 700,
              cursor: isWorking ? "default" : "pointer",
              opacity: isWorking ? 0.6 : 1, transition: "opacity 0.15s",
            }}
          >
            <Check size={11} strokeWidth={2.5} />
            {working === notif.id + "_accept" ? "Accepting…" : "Accept"}
          </button>
          <button
            onClick={onDecline}
            disabled={isWorking}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: "#FDECEA", color: "#C0392B",
              border: "1px solid #F5C6C2",
              padding: "7px 0", borderRadius: 4, fontSize: 11, fontWeight: 700,
              cursor: isWorking ? "default" : "pointer",
              opacity: isWorking ? 0.6 : 1, transition: "opacity 0.15s",
            }}
          >
            <X size={11} strokeWidth={2.5} />
            {working === notif.id + "_decline" ? "Declining…" : "Decline"}
          </button>
        </div>
      ) : notif.assignmentStatus === "Accepted" ? (
        <div style={{ paddingLeft: 38, fontSize: 11, color: "#1A7A4A", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
          <Check size={11} strokeWidth={2.5} /> Accepted
        </div>
      ) : (
        <div style={{ paddingLeft: 38, fontSize: 11, color: "#C0392B", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
          <X size={11} strokeWidth={2.5} /> Declined
        </div>
      )}
    </div>
  );
}
