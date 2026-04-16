"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FolderOpen, Plus, Search, ChevronRight, X } from "lucide-react";

const CATEGORIES = ["Computer Access Offences", "Data Interference", "System Interference", "Electronic Fraud", "Cyberstalking", "Child Exploitation", "Identity Related Crimes", "Critical Infrastructure Attacks", "Other"];
const STATUSES = ["All", "Active", "Closed"];
const ADMIN_ROLES = ["HEAD_OF_UNIT", "SUPERVISOR", "ADMIN"];

const StatusBadge = ({ status }) => {
  const map = { Active: { bg: "#E6F5EE", color: "#1A7A4A" }, Closed: { bg: "#EEF2F7", color: "#4E6478" } };
  const s = map[status] || map["Active"];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {status}
    </span>
  );
};

export default function CasesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cases, setCases] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Computer Access Offences", description: "" });
  const [otherCategory, setOtherCategory] = useState("");

  const isAdmin = ADMIN_ROLES.includes(session?.user?.role);

  const fetchCases = async (officerId = null) => {
    setLoading(true);
    try {
      const url = officerId ? `/api/cases?officerId=${officerId}` : "/api/cases";
      const res = await fetch(url);
      const data = await res.json();
      setCases(Array.isArray(data) ? data : []);
    } catch { setCases([]); }
    finally { setLoading(false); }
  };

  const fetchOfficers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setOfficers(Array.isArray(data) ? data : []);
    } catch { setOfficers([]); }
  };

  useEffect(() => {
    fetchCases();
    if (isAdmin) fetchOfficers();
  }, [isAdmin]);

  const handleOfficerSelect = (officerId) => {
    setSelectedOfficer(officerId);
    fetchCases(officerId);
    setSearch("");
    setStatusFilter("All");
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert("Case title is required."); return; }
    if (form.category === "Other" && !otherCategory.trim()) { alert("Please specify the category."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: form.category === "Other" ? otherCategory : form.category,
        }),
      });
      if (res.ok) {
        const newCase = await res.json();
        setShowModal(false);
        setForm({ title: "", category: "Computer Access Offences", description: "" });
        setOtherCategory("");
        router.push(`/dashboard/cases/${newCase.id}`);
      }
    } finally { setSubmitting(false); }
  };

  const filtered = cases.filter(c => {
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const active = cases.filter(c => c.status === "Active").length;
  const closed = cases.filter(c => c.status === "Closed").length;

  const daysOpen = (c) =>
    Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  const isStale = (c) => {
    if (c.status !== "Active") return false;
    if (daysOpen(c) <= 30) return false;
    const entries = c.entries || [];
    if (entries.length === 0) return true;
    const lastEntry = entries.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);
    return (Date.now() - new Date(lastEntry.createdAt).getTime()) > 7 * 24 * 60 * 60 * 1000;
  };

  const selectedOfficerName = selectedOfficer
    ? officers.find(o => o.id === selectedOfficer)?.name
    : null;

  return (
    <div style={{ padding: 32 }}>
      <style>{`
        .modal-input {
          width: 100%; border: 1.5px solid #E2E8F0; border-radius: 4px;
          padding: 11px 14px; font-size: 13px; color: #0B1F3A;
          outline: none; box-sizing: border-box; font-family: 'Segoe UI', sans-serif;
          transition: border-color 0.2s; background: white;
        }
        .modal-input:focus { border-color: #1A5FA8; }
        .modal-input::placeholder { color: #A8BFCF; }
        .case-row:hover { background: #F7F9FC !important; cursor: pointer; }
        .primary-btn:hover { background: #154d8a !important; }
        .filter-btn:hover { background: #F0F4F8 !important; }
        .officer-chip:hover { border-color: #1A5FA8 !important; }
      `}</style>

      {/* Officer Filter Bar — admin roles only */}
      {isAdmin && officers.length > 0 && (
        <div style={{
          background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
          padding: "16px 20px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(11,31,58,0.05)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            View Cases By Officer
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>

            {/* All button */}
            <button onClick={() => handleOfficerSelect(null)}
              className="officer-chip"
              style={{
                padding: "7px 16px", borderRadius: 4, fontSize: 12, cursor: "pointer",
                fontFamily: "'Segoe UI', sans-serif", border: "1px solid #E2E8F0",
                fontWeight: !selectedOfficer ? 700 : 400,
                background: !selectedOfficer ? "#0B1F3A" : "white",
                color: !selectedOfficer ? "white" : "#4E6478",
                transition: "all 0.15s",
              }}>
              All Officers
            </button>

            {/* Officer chips */}
            {officers.map(o => (
              <button key={o.id} onClick={() => handleOfficerSelect(o.id)}
                className="officer-chip"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 14px", borderRadius: 4, fontSize: 12,
                  cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                  border: `1px solid ${selectedOfficer === o.id ? "#1A5FA8" : "#E2E8F0"}`,
                  fontWeight: selectedOfficer === o.id ? 700 : 400,
                  background: selectedOfficer === o.id ? "#EBF3FB" : "white",
                  color: selectedOfficer === o.id ? "#1A5FA8" : "#4E6478",
                  transition: "all 0.15s",
                }}>
                {/* Avatar */}
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: selectedOfficer === o.id ? "#1A5FA8" : "#0B1F3A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0,
                }}>
                  {o.name?.charAt(0).toUpperCase()}
                </div>
                {o.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: selectedOfficerName ? `${selectedOfficerName}'s Cases` : "Total Cases", value: cases.length, color: "#1A5FA8" },
          { label: "Active", value: active, color: "#1A7A4A" },
          { label: "Closed", value: closed, color: "#4E6478" },
        ].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 6, padding: "18px 22px", border: "1px solid #E2E8F0", borderTop: `3px solid ${s.color}`, boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
            <div style={{ fontSize: 11, color: "#8FA3BB", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        {STATUSES.map(s => (
          <button key={s} className="filter-btn" onClick={() => setStatusFilter(s)} style={{
            fontSize: 12, padding: "8px 18px", borderRadius: 4, cursor: "pointer",
            fontWeight: statusFilter === s ? 700 : 400, fontFamily: "'Segoe UI', sans-serif",
            background: statusFilter === s ? "#0B1F3A" : "white",
            color: statusFilter === s ? "white" : "#4E6478",
            border: "1px solid #E2E8F0", transition: "all 0.15s",
          }}>{s}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8FA3BB" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cases..."
              style={{ border: "1px solid #E2E8F0", borderRadius: 4, padding: "9px 14px 9px 34px", fontSize: 13, outline: "none", width: 220, fontFamily: "'Segoe UI', sans-serif", color: "#0B1F3A", background: "white" }} />
          </div>
          <button className="primary-btn" onClick={() => setShowModal(true)} style={{
            background: "#1A5FA8", color: "white", border: "none", padding: "9px 20px",
            borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.05em", transition: "background 0.15s",
          }}>
            <Plus size={14} /> New Case
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F9FC", borderBottom: "1px solid #E2E8F0" }}>
              {["Case No.", "Title", "Category", "Officer", "Entries", "Status", "Days Open", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 48, textAlign: "center", color: "#8FA3BB", fontSize: 13 }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 72, textAlign: "center" }}>
                  <FolderOpen size={40} color="#D8E2EE" strokeWidth={1} style={{ margin: "0 auto 14px", display: "block" }} />
                  <div style={{ fontSize: 14, color: "#8FA3BB", fontWeight: 500 }}>No cases found.</div>
                  <div style={{ fontSize: 12, color: "#C4D0DC", marginTop: 4 }}>
                    {selectedOfficerName ? `${selectedOfficerName} has no cases yet.` : "Adjust your filters or open a new case."}
                  </div>
                </td>
              </tr>
            ) : filtered.map((c, i) => (
              <tr key={c.id} className="case-row"
                onClick={() => router.push(`/dashboard/cases/${c.id}`)}
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F7F9FC" : "none", background: "white", transition: "background 0.15s" }}
              >
                <td style={{ padding: "15px 16px", fontSize: 11, fontWeight: 700, color: "#1A5FA8", letterSpacing: "0.05em" }}>{c.caseNumber}</td>
                <td style={{ padding: "15px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>{c.title}</div>
                  {c.description && <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description}</div>}
                </td>
                <td style={{ padding: "15px 16px", fontSize: 12, color: "#4E6478" }}>{c.category}</td>
                <td style={{ padding: "15px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#0B1F3A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0 }}>
                      {c.officer?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 12, color: "#4E6478" }}>{c.officer?.name}</span>
                  </div>
                </td>
                <td style={{ padding: "15px 16px", fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>{c._count?.entries ?? c.entries?.length ?? 0}</td>
                <td style={{ padding: "15px 16px" }}><StatusBadge status={c.status} /></td>
                <td style={{ padding: "15px 16px", whiteSpace: "nowrap" }}>
                  {c.status === "Active" ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: isStale(c) ? "#D4730A" : "#4E6478" }}>
                      {isStale(c) && <span title="No activity in 7+ days">⚠</span>}
                      {daysOpen(c)}d
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: "#C4D0DC" }}>—</span>
                  )}
                </td>
                <td style={{ padding: "15px 16px" }}><ChevronRight size={16} color="#D8E2EE" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 520, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Open New Case</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>Create a new investigation case file.</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB", padding: 4 }}><X size={18} /></button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Case Title *</label>
              <input className="modal-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief descriptive title..." />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Category *</label>
              <select className="modal-input" value={form.category} onChange={e => { setForm({ ...form, category: e.target.value }); setOtherCategory(""); }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {form.category === "Other" && (
                <input className="modal-input" value={otherCategory} onChange={e => setOtherCategory(e.target.value)}
                  placeholder="Specify category..." style={{ marginTop: 8 }} />
              )}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Description</label>
              <textarea className="modal-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Brief overview of the case..." style={{ height: 90, resize: "none" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>Cancel</button>
              <button className="primary-btn" onClick={handleSubmit} disabled={submitting} style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.15s" }}>
                {submitting ? "Opening..." : "Open Case"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}