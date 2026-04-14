"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, Search, X, Globe, ArrowUpRight, ArrowDownLeft, Upload, Download } from "lucide-react";

const COUNTRIES = ["United States", "United Kingdom", "Nigeria", "South Africa", "Kenya", "Ghana", "Interpol", "Other"];
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["All", "Pending", "Responded", "Closed"];
const DIRECTIONS = ["Outgoing", "Incoming"];
const ADMIN_ROLES = ["HEAD_OF_UNIT", "SUPERVISOR", "ADMIN"];

const StatusBadge = ({ status }) => {
  const map = {
    Pending: { bg: "#FEF3E2", color: "#D4730A" },
    Responded: { bg: "#E6F5EE", color: "#1A7A4A" },
    Closed: { bg: "#EEF2F7", color: "#4E6478" },
  };
  const s = map[status] || map["Pending"];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const map = { High: "#C0392B", Medium: "#D4730A", Low: "#1A7A4A" };
  const color = map[priority] || "#4E6478";
  return (
    <span style={{ color, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block" }} />
      {priority}
    </span>
  );
};

export default function InternationalPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [cases, setCases] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [directionFilter, setDirectionFilter] = useState("All");
  const [form, setForm] = useState({
    direction: "Outgoing", country: "United States", otherCountry: "",
    agency: "", subject: "", details: "", priority: "Medium", caseId: "",
  });

  const isAdmin = ADMIN_ROLES.includes(session?.user?.role);

  const fetchRequests = async (officerId = null) => {
    setLoading(true);
    try {
      const url = officerId ? `/api/international?officerId=${officerId}` : "/api/international";
      const res = await fetch(url);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  };

  const fetchCases = async () => {
    try {
      const res = await fetch("/api/cases");
      const data = await res.json();
      setCases(Array.isArray(data) ? data : []);
    } catch { setCases([]); }
  };

  const fetchOfficers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setOfficers(Array.isArray(data) ? data : []);
    } catch { setOfficers([]); }
  };

  useEffect(() => {
    fetchRequests();
    fetchCases();
    if (isAdmin) fetchOfficers();
  }, [isAdmin]);

  const handleOfficerSelect = (officerId) => {
    setSelectedOfficer(officerId);
    setStatusFilter("All");
    setDirectionFilter("All");
    setSearch("");
    fetchRequests(officerId);
  };

  const handleSubmit = async () => {
    if (!form.agency.trim() || !form.subject.trim()) { alert("Agency and subject are required."); return; }
    if (form.country === "Other" && !form.otherCountry.trim()) { alert("Please specify the country."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/international", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          country: form.country === "Other" ? form.otherCountry : form.country,
          caseId: form.caseId || null,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ direction: "Outgoing", country: "United States", otherCountry: "", agency: "", subject: "", details: "", priority: "Medium", caseId: "" });
        fetchRequests(selectedOfficer);
      }
    } finally { setSubmitting(false); }
  };

  const handleUpdateStatus = async (id, status) => {
    await fetch(`/api/international/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, respondedAt: status === "Responded" ? new Date().toISOString() : undefined }),
    });
    fetchRequests(selectedOfficer);
    if (selectedReq?.id === id) setSelectedReq(prev => ({ ...prev, status }));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this international request?")) return;
    await fetch(`/api/international/${id}`, { method: "DELETE" });
    setShowDetailModal(false);
    fetchRequests(selectedOfficer);
  };

  const handleFileUpload = async (reqId, file) => {
    if (!file) return;
    setUploadingId(reqId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) { alert("Upload failed."); return; }
      await fetch(`/api/international/${reqId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attachmentPath: uploadData.path,
          attachmentName: uploadData.name,
          status: "Responded",
          respondedAt: new Date().toISOString(),
        }),
      });
      fetchRequests(selectedOfficer);
      if (selectedReq?.id === reqId) setSelectedReq(prev => ({ ...prev, attachmentPath: uploadData.path, attachmentName: uploadData.name, status: "Responded" }));
    } finally { setUploadingId(null); }
  };

  const daysSince = (date) => Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));

  const filtered = requests.filter(r => {
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const matchDir = directionFilter === "All" || r.direction === directionFilter;
    const matchSearch = !search ||
      r.refNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.country.toLowerCase().includes(search.toLowerCase()) ||
      r.agency.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchDir && matchSearch;
  });

  const outgoing = requests.filter(r => r.direction === "Outgoing").length;
  const incoming = requests.filter(r => r.direction === "Incoming").length;
  const pending = requests.filter(r => r.status === "Pending").length;

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
        .req-row:hover { background: #F7F9FC !important; cursor: pointer; }
        .primary-btn:hover { background: #154d8a !important; }
        .filter-btn:hover { background: #F0F4F8 !important; }
        .officer-chip:hover { border-color: #1A5FA8 !important; }
        .upload-btn:hover { border-color: #1A5FA8 !important; color: #1A5FA8 !important; }
      `}</style>

      {/* Officer Filter Bar — admin only */}
      {isAdmin && officers.length > 0 && (
        <div style={{
          background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
          padding: "16px 20px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(11,31,58,0.05)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            View Requests By Officer
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => handleOfficerSelect(null)} className="officer-chip"
              style={{
                padding: "7px 16px", borderRadius: 4, fontSize: 12, cursor: "pointer",
                fontFamily: "'Segoe UI', sans-serif", border: "1px solid #E2E8F0",
                fontWeight: !selectedOfficer ? 700 : 400,
                background: !selectedOfficer ? "#0B1F3A" : "white",
                color: !selectedOfficer ? "white" : "#4E6478",
                transition: "all 0.15s",
              }}>All Officers</button>
            {officers.map(o => (
              <button key={o.id} onClick={() => handleOfficerSelect(o.id)} className="officer-chip"
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

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Requests", value: requests.length, color: "#1A5FA8" },
          { label: "Outgoing", value: outgoing, color: "#6B3FA0" },
          { label: "Incoming", value: incoming, color: "#1A7A4A" },
          { label: "Pending Response", value: pending, color: "#D4730A" },
        ].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 6, padding: "18px 22px", border: "1px solid #E2E8F0", borderTop: `3px solid ${s.color}`, boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
            <div style={{ fontSize: 11, color: "#8FA3BB", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {STATUSES.map(s => (
          <button key={s} className="filter-btn" onClick={() => setStatusFilter(s)} style={{
            fontSize: 12, padding: "8px 16px", borderRadius: 4, cursor: "pointer",
            fontWeight: statusFilter === s ? 700 : 400, fontFamily: "'Segoe UI', sans-serif",
            background: statusFilter === s ? "#0B1F3A" : "white",
            color: statusFilter === s ? "white" : "#4E6478",
            border: "1px solid #E2E8F0", transition: "all 0.15s",
          }}>{s}</button>
        ))}
        <div style={{ width: 1, height: 24, background: "#E2E8F0" }} />
        {["All", "Outgoing", "Incoming"].map(d => (
          <button key={d} className="filter-btn" onClick={() => setDirectionFilter(d)} style={{
            fontSize: 12, padding: "8px 16px", borderRadius: 4, cursor: "pointer",
            fontWeight: directionFilter === d ? 700 : 400, fontFamily: "'Segoe UI', sans-serif",
            background: directionFilter === d ? "#1A5FA8" : "white",
            color: directionFilter === d ? "white" : "#4E6478",
            border: "1px solid #E2E8F0", transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {d === "Outgoing" && <ArrowUpRight size={12} />}
            {d === "Incoming" && <ArrowDownLeft size={12} />}
            {d}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8FA3BB" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..."
              style={{ border: "1px solid #E2E8F0", borderRadius: 4, padding: "9px 14px 9px 34px", fontSize: 13, outline: "none", width: 220, fontFamily: "'Segoe UI', sans-serif", color: "#0B1F3A", background: "white" }} />
          </div>
          <button className="primary-btn" onClick={() => setShowModal(true)} style={{
            background: "#1A5FA8", color: "white", border: "none", padding: "9px 20px",
            borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.05em", transition: "background 0.15s",
          }}>
            <Plus size={14} /> New Request
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F9FC", borderBottom: "1px solid #E2E8F0" }}>
              {["Ref No.", "Direction", "Country / Agency", "Officer", "Subject", "Linked Case", "Days Open", "Priority", "Status", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ padding: 48, textAlign: "center", color: "#8FA3BB", fontSize: 13 }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ padding: 72, textAlign: "center" }}>
                  <Globe size={40} color="#D8E2EE" strokeWidth={1} style={{ margin: "0 auto 14px", display: "block" }} />
                  <div style={{ fontSize: 13, color: "#8FA3BB", fontWeight: 500 }}>No international requests found.</div>
                  <div style={{ fontSize: 11, color: "#C4D0DC", marginTop: 4 }}>Log outgoing requests or record incoming ones from partner agencies.</div>
                </td>
              </tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id} className="req-row"
                onClick={() => { setSelectedReq(r); setShowDetailModal(true); }}
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F7F9FC" : "none", background: "white", transition: "background 0.15s" }}>
                <td style={{ padding: "14px 16px", fontSize: 11, fontWeight: 700, color: "#1A5FA8", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{r.refNumber}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600,
                    color: r.direction === "Outgoing" ? "#6B3FA0" : "#1A7A4A",
                    background: r.direction === "Outgoing" ? "#F3EDFC" : "#E6F5EE",
                    padding: "3px 10px", borderRadius: 3,
                  }}>
                    {r.direction === "Outgoing" ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
                    {r.direction}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>{r.country}</div>
                  <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2 }}>{r.agency}</div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#0B1F3A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white", flexShrink: 0 }}>
                      {r.officer?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 12, color: "#4E6478" }}>{r.officer?.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#0B1F3A", maxWidth: 180 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.subject}</div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {r.case ? (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#1A5FA8" }}>{r.case.caseNumber}</div>
                      <div style={{ fontSize: 11, color: "#8FA3BB", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.case.title}</div>
                    </div>
                  ) : <span style={{ fontSize: 11, color: "#C4D0DC" }}>—</span>}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: r.status === "Pending" && daysSince(r.createdAt) > 30 ? "#C0392B" : "#4E6478" }}>
                    {daysSince(r.createdAt)}d
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}><PriorityBadge priority={r.priority} /></td>
                <td style={{ padding: "14px 16px" }}><StatusBadge status={r.status} /></td>
                <td style={{ padding: "14px 16px", fontSize: 11, color: "#C4D0DC" }}>›</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: New Request */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>New International Request</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>Log an outgoing request or record an incoming one.</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Direction *</label>
              <div style={{ display: "flex", gap: 10 }}>
                {DIRECTIONS.map(d => (
                  <button key={d} onClick={() => setForm({ ...form, direction: d })} style={{
                    flex: 1, padding: "12px", borderRadius: 4, cursor: "pointer",
                    fontFamily: "'Segoe UI', sans-serif", fontSize: 13, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: form.direction === d ? "#0B1F3A" : "white",
                    color: form.direction === d ? "white" : "#4E6478",
                    border: `1.5px solid ${form.direction === d ? "#0B1F3A" : "#E2E8F0"}`,
                    transition: "all 0.15s",
                  }}>
                    {d === "Outgoing" ? <ArrowUpRight size={15} /> : <ArrowDownLeft size={15} />}
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Country *</label>
                <select className="modal-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value, otherCountry: "" })}>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {form.country === "Other" && (
                  <input className="modal-input" value={form.otherCountry} onChange={e => setForm({ ...form, otherCountry: e.target.value })}
                    placeholder="Specify country..." style={{ marginTop: 8 }} />
                )}
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Priority</label>
                <select className="modal-input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Agency / Unit *</label>
              <input className="modal-input" value={form.agency} onChange={e => setForm({ ...form, agency: e.target.value })}
                placeholder="e.g. FBI Cyber Division, Interpol Cybercrime Unit..." />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Subject *</label>
              <input className="modal-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief subject of the request..." />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Linked Case</label>
              <select className="modal-input" value={form.caseId} onChange={e => setForm({ ...form, caseId: e.target.value })}>
                <option value="">No linked case</option>
                {cases.map(c => <option key={c.id} value={c.id}>{c.caseNumber} — {c.title}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Details</label>
              <textarea className="modal-input" value={form.details} onChange={e => setForm({ ...form, details: e.target.value })}
                placeholder="Full details of the request..." style={{ height: 100, resize: "none" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>Cancel</button>
              <button className="primary-btn" onClick={handleSubmit} disabled={submitting} style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.15s" }}>
                {submitting ? "Saving..." : "Log Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detail View */}
      {showDetailModal && selectedReq && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, width: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ background: "#0B1F3A", padding: "24px 28px", borderRadius: "6px 6px 0 0" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#4E6478", letterSpacing: "0.1em", marginBottom: 6 }}>{selectedReq.refNumber}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 8 }}>{selectedReq.subject}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <StatusBadge status={selectedReq.status} />
                    <PriorityBadge priority={selectedReq.priority} />
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4E6478" }}><X size={18} /></button>
              </div>
            </div>

            <div style={{ padding: "24px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Direction", value: selectedReq.direction },
                  { label: "Country", value: selectedReq.country },
                  { label: "Agency", value: selectedReq.agency },
                  { label: "Logged By", value: selectedReq.officer?.name },
                  { label: "Date Logged", value: new Date(selectedReq.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Days Open", value: `${daysSince(selectedReq.createdAt)} days` },
                ].map(item => (
                  <div key={item.label} style={{ background: "#F7F9FC", borderRadius: 4, padding: "12px 14px", border: "1px solid #EEF2F7" }}>
                    <div style={{ fontSize: 10, color: "#8FA3BB", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {selectedReq.case && (
                <div style={{ background: "#EBF3FB", borderRadius: 4, padding: "12px 14px", border: "1px solid #C8DFF5", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: "#1A5FA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Linked Case</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A5FA8" }}>{selectedReq.case.caseNumber}</div>
                  <div style={{ fontSize: 12, color: "#4E6478" }}>{selectedReq.case.title}</div>
                </div>
              )}

              {selectedReq.details && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Request Details</div>
                  <div style={{ fontSize: 13, color: "#1F3347", lineHeight: 1.7, background: "#F7F9FC", borderRadius: 4, padding: "14px 16px", border: "1px solid #EEF2F7" }}>{selectedReq.details}</div>
                </div>
              )}

              {/* Attachment */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Attachment</div>
                {selectedReq.attachmentPath ? (
                  <a href={selectedReq.attachmentPath} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#1A7A4A", background: "#E6F5EE", padding: "8px 14px", borderRadius: 4, textDecoration: "none" }}>
                    <Download size={13} /> {selectedReq.attachmentName}
                  </a>
                ) : (
                  <label className="upload-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8FA3BB", background: "#F7F9FC", border: "1px dashed #D8E2EE", padding: "8px 14px", borderRadius: 4, cursor: "pointer", transition: "all 0.15s" }}>
                    {uploadingId === selectedReq.id ? <span style={{ color: "#1A5FA8" }}>Uploading...</span> : <><Upload size={13} /> Attach Document</>}
                    <input type="file" style={{ display: "none" }} accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
                      onChange={e => handleFileUpload(selectedReq.id, e.target.files[0])} />
                  </label>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => handleDelete(selectedReq.id)} style={{ fontSize: 12, color: "#C0392B", background: "#FDECEA", border: "none", padding: "9px 16px", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontFamily: "'Segoe UI', sans-serif" }}>
                  Delete
                </button>
                <div style={{ display: "flex", gap: 8 }}>
                  {selectedReq.status === "Pending" && (
                    <button onClick={() => handleUpdateStatus(selectedReq.id, "Responded")} style={{ background: "#1A7A4A", color: "white", border: "none", padding: "9px 20px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                      Mark Responded
                    </button>
                  )}
                  {selectedReq.status !== "Closed" && (
                    <button onClick={() => handleUpdateStatus(selectedReq.id, "Closed")} style={{ background: "#4E6478", color: "white", border: "none", padding: "9px 20px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                      Close Request
                    </button>
                  )}
                  {selectedReq.status === "Closed" && (
                    <button onClick={() => handleUpdateStatus(selectedReq.id, "Pending")} style={{ background: "#1A5FA8", color: "white", border: "none", padding: "9px 20px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}