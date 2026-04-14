"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, X, Phone, Upload, Download, CheckCircle, Clock, XCircle } from "lucide-react";

const TELCOS = ["MTN", "Vodafone", "AirtelTigo", "Other"];
const STATUSES = ["Pending", "Received", "Rejected"];
const ADMIN_ROLES = ["HEAD_OF_UNIT", "SUPERVISOR", "ADMIN"];

const statusStyle = (s) => {
  const map = {
    Pending:  { bg: "#FEF3E2", color: "#D4730A", icon: Clock },
    Received: { bg: "#E6F5EE", color: "#1A7A4A", icon: CheckCircle },
    Rejected: { bg: "#FDECEA", color: "#C0392B", icon: XCircle },
  };
  return map[s] || { bg: "#EEF2F7", color: "#4E6478", icon: Clock };
};

export default function CdrPage() {
  const { data: session } = useSession();
  const [cdrs, setCdrs] = useState([]);
  const [cases, setCases] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState({
    phoneNumber: "", telco: "MTN", otherTelco: "",
    periodStart: "", periodEnd: "", reason: "", caseId: "",
  });

  const isAdmin = ADMIN_ROLES.includes(session?.user?.role);

  const fetchCdrs = async (officerId = null) => {
    setLoading(true);
    try {
      const url = officerId ? `/api/cdr?officerId=${officerId}` : "/api/cdr";
      const res = await fetch(url);
      const data = await res.json();
      setCdrs(Array.isArray(data) ? data : []);
    } catch { setCdrs([]); }
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
    fetchCdrs();
    fetchCases();
    if (isAdmin) fetchOfficers();
  }, [isAdmin]);

  const handleOfficerSelect = (officerId) => {
    setSelectedOfficer(officerId);
    setStatusFilter("");
    fetchCdrs(officerId);
  };

  const handleSubmit = async () => {
    if (!form.phoneNumber.trim() || !form.periodStart || !form.periodEnd || !form.reason.trim()) {
      alert("Please fill all required fields."); return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/cdr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          telco: form.telco === "Other" ? form.otherTelco : form.telco,
          caseId: form.caseId || null,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ phoneNumber: "", telco: "MTN", otherTelco: "", periodStart: "", periodEnd: "", reason: "", caseId: "" });
        fetchCdrs(selectedOfficer);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to log request.");
      }
    } finally { setSubmitting(false); }
  };

  const handleStatusChange = async (cdrId, status) => {
    await fetch(`/api/cdr/${cdrId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(status === "Received" ? { receivedAt: new Date().toISOString() } : {}) }),
    });
    fetchCdrs(selectedOfficer);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this CDR request?")) return;
    await fetch(`/api/cdr/${id}`, { method: "DELETE" });
    fetchCdrs(selectedOfficer);
  };

  const handleFileUpload = async (cdrId, file) => {
    if (!file) return;
    setUploadingId(cdrId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) { alert("Upload failed."); return; }
      await fetch(`/api/cdr/${cdrId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attachmentPath: uploadData.path,
          attachmentName: uploadData.name,
          status: "Received",
          receivedAt: new Date().toISOString(),
        }),
      });
      fetchCdrs(selectedOfficer);
    } finally { setUploadingId(null); }
  };

  const filtered = statusFilter ? cdrs.filter(c => c.status === statusFilter) : cdrs;

  const stats = {
    total: cdrs.length,
    pending: cdrs.filter(c => c.status === "Pending").length,
    received: cdrs.filter(c => c.status === "Received").length,
    rejected: cdrs.filter(c => c.status === "Rejected").length,
  };

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
        .cdr-row:hover td { background: #F7F9FC; }
        .upload-btn:hover { border-color: #1A5FA8 !important; color: #1A5FA8 !important; }
        .officer-chip:hover { border-color: #1A5FA8 !important; }
      `}</style>

      {/* Officer Filter Bar — admin only */}
      {isAdmin && officers.length > 0 && (
        <div style={{
          background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
          padding: "16px 20px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(11,31,58,0.05)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            View CDR Requests By Officer
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

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Requests", value: stats.total, color: "#1A5FA8" },
          { label: "Pending", value: stats.pending, color: "#D4730A" },
          { label: "Received", value: stats.received, color: "#1A7A4A" },
          { label: "Rejected", value: stats.rejected, color: "#C0392B" },
        ].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 6, padding: "20px 22px", border: "1px solid #E2E8F0", borderTop: `3px solid ${s.color}`, boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
            <div style={{ fontSize: 11, color: "#8FA3BB", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
        {["All", ...STATUSES].map(s => (
          <button key={s} onClick={() => setStatusFilter(s === "All" ? "" : s)} style={{
            fontSize: 12, padding: "7px 16px", borderRadius: 4, cursor: "pointer",
            fontFamily: "'Segoe UI', sans-serif", border: "1px solid #E2E8F0",
            fontWeight: (s === "All" ? !statusFilter : statusFilter === s) ? 700 : 400,
            background: (s === "All" ? !statusFilter : statusFilter === s) ? "#0B1F3A" : "white",
            color: (s === "All" ? !statusFilter : statusFilter === s) ? "white" : "#4E6478",
            transition: "all 0.15s",
          }}>{s}</button>
        ))}
        <button onClick={() => setShowModal(true)} style={{
          marginLeft: "auto", background: "#1A5FA8", color: "white", border: "none",
          padding: "9px 20px", borderRadius: 4, fontSize: 12, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
          fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.05em",
        }}>
          <Plus size={14} /> New CDR Request
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F9FC", borderBottom: "1px solid #E2E8F0" }}>
              {["Phone Number", "Telco", "Period", "Officer", "Linked Case", "Reason", "Status", "Attachment", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ padding: 48, textAlign: "center", color: "#8FA3BB", fontSize: 13 }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: 72, textAlign: "center" }}>
                  <Phone size={40} color="#D8E2EE" strokeWidth={1} style={{ margin: "0 auto 14px", display: "block" }} />
                  <div style={{ fontSize: 13, color: "#8FA3BB" }}>No CDR requests yet.</div>
                  <div style={{ fontSize: 11, color: "#C4D0DC", marginTop: 4 }}>Log a new request to get started.</div>
                </td>
              </tr>
            ) : filtered.map((c, i) => {
              const ss = statusStyle(c.status);
              const StatusIcon = ss.icon;
              return (
                <tr key={c.id} className="cdr-row" style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F7F9FC" : "none" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>{c.phoneNumber}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#4E6478", background: "#F0F4F8", padding: "3px 10px", borderRadius: 3 }}>{c.telco}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 11, color: "#4E6478", whiteSpace: "nowrap" }}>
                    {new Date(c.periodStart).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    <span style={{ color: "#C4D0DC", margin: "0 4px" }}>→</span>
                    {new Date(c.periodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#0B1F3A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white", flexShrink: 0 }}>
                        {c.officer?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 12, color: "#4E6478" }}>{c.officer?.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {c.case ? (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1A5FA8", background: "#EBF3FB", padding: "3px 10px", borderRadius: 3 }}>{c.case?.caseNumber}</span>
                    ) : <span style={{ color: "#C4D0DC", fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#4E6478", maxWidth: 160 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.reason}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StatusIcon size={13} color={ss.color} />
                      <select value={c.status} onChange={e => handleStatusChange(c.id, e.target.value)}
                        style={{ fontSize: 11, fontWeight: 700, color: ss.color, background: ss.bg, border: "none", borderRadius: 3, padding: "3px 8px", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", outline: "none" }}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {c.attachmentPath ? (
                      <a href={c.attachmentPath} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "#1A7A4A", background: "#E6F5EE", padding: "4px 10px", borderRadius: 3, textDecoration: "none", whiteSpace: "nowrap" }}>
                        <Download size={11} /> {c.attachmentName?.length > 14 ? c.attachmentName.slice(0, 14) + "…" : c.attachmentName}
                      </a>
                    ) : (
                      <label className="upload-btn" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#8FA3BB", background: "#F7F9FC", border: "1px dashed #D8E2EE", padding: "4px 10px", borderRadius: 3, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>
                        {uploadingId === c.id ? <span style={{ color: "#1A5FA8" }}>Uploading...</span> : <><Upload size={11} /> Upload File</>}
                        <input type="file" style={{ display: "none" }} accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
                          onChange={e => handleFileUpload(c.id, e.target.files[0])} />
                      </label>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button onClick={() => handleDelete(c.id)}
                      style={{ fontSize: 11, color: "#C0392B", background: "#FDECEA", border: "none", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontFamily: "'Segoe UI', sans-serif" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 540, boxShadow: "0 24px 64px rgba(11,31,58,0.25)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>New CDR Request</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>Log a call detail record request to a telco.</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Phone Number *</label>
                <input className="modal-input" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+233244000000" />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Telco *</label>
                <select className="modal-input" value={form.telco} onChange={e => setForm({ ...form, telco: e.target.value, otherTelco: "" })}>
                  {TELCOS.map(t => <option key={t}>{t}</option>)}
                </select>
                {form.telco === "Other" && (
                  <input className="modal-input" value={form.otherTelco} onChange={e => setForm({ ...form, otherTelco: e.target.value })} placeholder="Specify telco..." style={{ marginTop: 8 }} />
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Period Start *</label>
                <input className="modal-input" type="date" value={form.periodStart} onChange={e => setForm({ ...form, periodStart: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Period End *</label>
                <input className="modal-input" type="date" value={form.periodEnd} onChange={e => setForm({ ...form, periodEnd: e.target.value })} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Link to Case (optional)</label>
              <select className="modal-input" value={form.caseId} onChange={e => setForm({ ...form, caseId: e.target.value })}>
                <option value="">— No case linked —</option>
                {cases.map(c => <option key={c.id} value={c.id}>{c.caseNumber} — {c.title}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Reason / Justification *</label>
              <textarea className="modal-input" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                placeholder="Why is this CDR being requested?" style={{ height: 80, resize: "none" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                {submitting ? "Saving..." : "Log Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}