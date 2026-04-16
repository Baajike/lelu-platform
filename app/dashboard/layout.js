"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, Phone, ShieldAlert,
  Globe, FileBarChart2, ChevronRight, LogOut,
  Bell, Settings, Users
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "cases", label: "Case Management", icon: FolderOpen, href: "/dashboard/cases" },
  { id: "cdr", label: "CDR", icon: Phone, href: "/dashboard/cdr" },
  { id: "fraud", label: "Intel DB", icon: ShieldAlert, href: "/dashboard/fraud" },
  { id: "international", label: "24/7 Network", icon: Globe, href: "/dashboard/international" },
  { id: "reports", label: "Reports", icon: FileBarChart2, href: "/dashboard/reports" },
];

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
    HEAD_OF_UNIT: { bg: "#FEF3E2", color: "#D4730A" },
    SUPERVISOR: { bg: "#F3EDFC", color: "#6B3FA0" },
    OFFICE_ADMINISTRATOR: { bg: "#EBF3FB", color: "#1A5FA8" },
    OFFICER: { bg: "#E6F5EE", color: "#1A7A4A" },
    ADMIN: { bg: "#FDECEA", color: "#C0392B" },
  };
  return map[role] || { bg: "#EEF2F7", color: "#4E6478" };
};

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [pageDate, setPageDate] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pageKey, setPageKey] = useState(pathname);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  useEffect(() => {
    const active = navItems.find(n => pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href)));
    if (active) setPageTitle(active.label.toUpperCase());
    else if (pathname.startsWith("/dashboard/admin")) setPageTitle("USER MANAGEMENT");
    setPageDate(new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    setPageKey(pathname);
  }, [pathname]);

  useEffect(() => {
    if (session && ["HEAD_OF_UNIT", "OFFICE_ADMINISTRATOR", "ADMIN"].includes(session.user.role)) {
      fetch("/api/users?pending=true")
        .then(r => r.json())
        .then(d => setPendingCount(Array.isArray(d) ? d.length : 0))
        .catch(() => setPendingCount(0));
    }
  }, [session]);

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
  const rc = roleColor(role);

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
        .nav-btn { transition: background 0.2s, border-color 0.2s, color 0.2s; }
        .nav-btn:hover { background: #112847 !important; }
        .nav-btn:hover span { color: white !important; }
        .nav-btn:hover svg { color: white !important; stroke: white !important; }
        .signout-btn:hover { background: #1E3A5F !important; }
      `}</style>

      {/* Sidebar */}
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
                  transition: `opacity 1s cubic-bezier(.4,0,.2,1) 0.7s, transform 1s cubic-bezier(.4,0,.2,1) 0.7s, background 0.2s`,
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

      {/* Main */}
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

            {/* Bell with badge */}
            <button
              onClick={() => router.push("/dashboard")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative" }}>
              <Bell size={18} color="#4E6478" strokeWidth={1.8} />
              {pendingCount > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 0,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#C0392B", color: "white",
                  fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid #0B1F3A",
                }}>{pendingCount}</span>
              )}
            </button>

            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#4E6478", padding: 4 }}>
              <Settings size={18} color="#4E6478" strokeWidth={1.8} />
            </button>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1A5FA8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white" }}>
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page Content with fade transition */}
        <div key={pageKey} style={{
          flex: 1, overflowY: "auto",
          animation: "fadeInPage 0.4s cubic-bezier(.4,0,.2,1) both",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}