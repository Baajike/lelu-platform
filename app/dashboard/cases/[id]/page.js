"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Plus, Edit2, Trash2, X, ChevronDown, Phone } from "lucide-react";

const CLOSURE_REASONS = [
  "Case Resolved",
  "Suspect Arrested",
  "Referred to Prosecution",
  "Insufficient Evidence",
  "Duplicate Case",
  "Withdrawn by Complainant",
  "Other",
];

const TELCOS = ["MTN", "Vodafone", "AirtelTigo", "Other"];

const StatusBadge = ({ status }) => {
  const map = { Active: { bg: "#E6F5EE", color: "#1A7A4A" }, Closed: { bg: "#EEF2F7", color: "#4E6478" }, Declined: { bg: "#FDECEA", color: "#C0392B" } };
  const s = map[status] || map["Active"];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
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
      {priority} Priority
    </span>
  );
};

export default function CaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [entryContent, setEntryContent] = useState("");
  const [entryActions, setEntryActions] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [closureReason, setClosureReason] = useState("Case Resolved");
  const [otherClosureReason, setOtherClosureReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showCdrModal, setShowCdrModal] = useState(false);
  const [cdrForm, setCdrForm] = useState({ phoneNumber: "", telco: "MTN", otherTelco: "", periodStart: "", periodEnd: "", reason: "" });
  const [cdrDupeWarning, setCdrDupeWarning] = useState(null);
  const [coViewers, setCoViewers] = useState([]);

  const fetchCase = async () => {
    try {
      const res = await fetch(`/api/cases/${id}`);
      const data = await res.json();
      setCaseData(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCase(); }, [id]);

  useEffect(() => {
    if (!id) return;
    const pollViewers = async () => {
      try {
        const res = await fetch(`/api/cases/${id}/viewers`);
        if (res.ok) {
          const data = await res.json();
          setCoViewers(Array.isArray(data) ? data : []);
        }
      } catch {}
    };
    pollViewers();
    const interval = setInterval(pollViewers, 30000);
    return () => {
      clearInterval(interval);
      fetch(`/api/cases/${id}/viewers`, { method: "DELETE" }).catch(() => {});
    };
  }, [id]);

  const handleAddEntry = async () => {
    if (!entryContent.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`/api/cases/${id}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: entryContent, actions: entryActions }),
      });
      setEntryContent(""); setEntryActions(""); setShowAddEntry(false);
      fetchCase();
    } finally { setSubmitting(false); }
  };

  const doCdrSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/cdr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: cdrForm.phoneNumber,
          telco: cdrForm.telco === "Other" ? cdrForm.otherTelco : cdrForm.telco,
          periodStart: cdrForm.periodStart,
          periodEnd: cdrForm.periodEnd,
          reason: cdrForm.reason,
          caseId: id,
        }),
      });
      if (res.ok) {
        setShowCdrModal(false);
        setCdrDupeWarning(null);
        setCdrForm({ phoneNumber: "", telco: "MTN", otherTelco: "", periodStart: "", periodEnd: "", reason: "" });
        fetchCase();
      }
    } finally { setSubmitting(false); }
  };

  const handleCdrSubmit = async () => {
    if (!cdrForm.phoneNumber.trim() || !cdrForm.periodStart || !cdrForm.periodEnd || !cdrForm.reason.trim()) {
      alert("Please fill all required fields."); return;
    }
    const normalised = cdrForm.phoneNumber.trim().replace(/\s+/g, "");
    try {
      const res = await fetch("/api/cdr");
      const all = await res.json();
      if (Array.isArray(all)) {
        const match = all.find(c => c.phoneNumber.replace(/\s+/g, "") === normalised);
        if (match) { setCdrDupeWarning(match); return; }
      }
    } catch {}
    doCdrSubmit();
  };

  const handleEditEntry = async (entryId) => {
    setSubmitting(true);
    try {
      await fetch(`/api/entries/${entryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      setEditingEntry(null); setEditContent("");
      fetchCase();
    } finally { setSubmitting(false); }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!confirm("Delete this journal entry?")) return;
    await fetch(`/api/entries/${entryId}`, { method: "DELETE" });
    fetchCase();
  };

  const handleCloseCase = async () => {
    if (closureReason === "Other" && !otherClosureReason.trim()) {
      alert("Please specify the closure reason."); return;
    }
    setSubmitting(true);
    try {
      await fetch(`/api/cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Closed",
          closedAt: new Date().toISOString(),
          closureReason: closureReason === "Other" ? otherClosureReason : closureReason,
        }),
      });
      setShowCloseModal(false);
      fetchCase();
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ padding: 32, textAlign: "center", color: "#8FA3BB", fontSize: 13 }}>Loading case...</div>
  );
  if (!caseData) return (
    <div style={{ padding: 32, textAlign: "center", color: "#C0392B", fontSize: 13 }}>Case not found.</div>
  );

  const entries = caseData.entries || [];

  return (
    <div style={{ padding: 32 }}>
      <style>{`
        .input-field {
          width: 100%; border: 1.5px solid #E2E8F0; border-radius: 4px;
          padding: 11px 14px; font-size: 13px; color: #0B1F3A;
          outline: none; box-sizing: border-box; font-family: 'Segoe UI', sans-serif;
          transition: border-color 0.2s; background: white;
        }
        .input-field:focus { border-color: #1A5FA8; }
        .input-field::placeholder { color: #A8BFCF; }
        .action-btn { transition: all 0.15s; }
        .action-btn:hover { opacity: 0.85; }
      `}</style>

      {/* Co-viewer warning — visible to HEAD_OF_UNIT and ADMIN only */}
      {coViewers.length > 0 && ["HEAD_OF_UNIT", "ADMIN"].includes(session?.user?.role) && (
        <div style={{ background: "#FEF9E7", border: "1px solid #F5D79E", borderRadius: 6, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15 }}>⚠</span>
          <div style={{ fontSize: 13, color: "#8A5200" }}>
            {coViewers.length === 1
              ? <><strong>{coViewers[0].userName}</strong> is also viewing this case right now.</>
              : <><strong>{coViewers.map(v => v.userName).join(", ")}</strong> are also viewing this case right now.</>
            }
          </div>
        </div>
      )}

      {/* Back + Header */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => router.push("/dashboard/cases")} style={{
          background: "none", border: "none", cursor: "pointer", color: "#8FA3BB",
          fontSize: 12, display: "flex", alignItems: "center", gap: 6,
          fontFamily: "'Segoe UI', sans-serif", marginBottom: 16, padding: 0,
        }}>
          <ArrowLeft size={14} /> Back to Cases
        </button>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1A5FA8", letterSpacing: "0.1em", marginBottom: 6 }}>
              {caseData.caseNumber}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0B1F3A", margin: "0 0 8px" }}>{caseData.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <StatusBadge status={caseData.status} />
              <span style={{ fontSize: 11, color: "#8FA3BB" }}>{caseData.category}</span>
              <span style={{ fontSize: 11, color: "#8FA3BB" }}>· Opened by {caseData.officer?.name}</span>
            </div>
          </div>
          {caseData.status === "Active" && (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeclineModal(true)} style={{
                background: "#C0392B", color: "white", border: "none",
                padding: "10px 22px", borderRadius: 4, fontSize: 12,
                fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                letterSpacing: "0.05em",
              }}>
                Decline
              </button>
              <button onClick={() => setShowCloseModal(true)} style={{
                background: "#0B1F3A", color: "white", border: "none",
                padding: "10px 22px", borderRadius: 4, fontSize: 12,
                fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                letterSpacing: "0.05em",
              }}>
                Close Case
              </button>
            </div>
          )}
          {caseData.status === "Closed" && (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
    <div style={{ background: "#F7F9FC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "12px 18px", textAlign: "right" }}>
      <div style={{ fontSize: 10, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Closure Reason</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>{caseData.closureReason}</div>
      <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 3 }}>
        {caseData.closedAt && new Date(caseData.closedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </div>
    </div>
    <button onClick={async () => {
      if (!confirm("Reopen this case? It will be set back to Active.")) return;
      await fetch(`/api/cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active", closedAt: null, closureReason: null }),
      });
      fetchCase();
    }} style={{
      background: "#1A7A4A", color: "white", border: "none",
      padding: "10px 22px", borderRadius: 4, fontSize: 12,
      fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
      letterSpacing: "0.05em",
    }}>
      Reopen Case
    </button>
  </div>
)}
          {caseData.status === "Declined" && (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
    {caseData.closureReason && (
      <div style={{ background: "#FDECEA", border: "1px solid #F5C6C2", borderRadius: 6, padding: "12px 18px", textAlign: "right" }}>
        <div style={{ fontSize: 10, color: "#C0392B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Decline Reason</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>{caseData.closureReason}</div>
      </div>
    )}
    <button onClick={async () => {
      if (!confirm("Re-open this case? It will be set back to Active.")) return;
      await fetch(`/api/cases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active", closureReason: null }),
      });
      fetchCase();
    }} style={{
      background: "#1A7A4A", color: "white", border: "none",
      padding: "10px 22px", borderRadius: 4, fontSize: 12,
      fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
      letterSpacing: "0.05em",
    }}>
      Re-open Case
    </button>
  </div>
)}
        </div>
      </div>

      {/* Description */}
      {caseData.description && (
        <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", padding: "18px 22px", marginBottom: 24, boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Case Description</div>
          <div style={{ fontSize: 13, color: "#4E6478", lineHeight: 1.7 }}>{caseData.description}</div>
        </div>
      )}

      {/* Journal */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Investigation Journal</div>
            <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2 }}>{entries.length} {entries.length === 1 ? "entry" : "entries"}</div>
          </div>
          {caseData.status === "Active" && (
            <button onClick={() => setShowAddEntry(!showAddEntry)} style={{
              background: showAddEntry ? "#F7F9FC" : "#1A5FA8", color: showAddEntry ? "#4E6478" : "white",
              border: showAddEntry ? "1px solid #E2E8F0" : "none",
              padding: "9px 18px", borderRadius: 4, fontSize: 12,
              fontWeight: 600, cursor: "pointer", display: "flex",
              alignItems: "center", gap: 7, fontFamily: "'Segoe UI', sans-serif",
            }}>
              {showAddEntry ? <><X size={13} /> Cancel</> : <><Plus size={13} /> Add Entry</>}
            </button>
          )}
        </div>

        {/* Add Entry Form */}
        {showAddEntry && (
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #EEF2F7", background: "#F7F9FC" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Input {entries.length + 1} Entry
            </div>
            <textarea className="input-field" value={entryContent} onChange={e => setEntryContent(e.target.value)}
              placeholder="Document what happened today — interviews conducted, evidence found, leads followed..."
              style={{ height: 110, resize: "none", marginBottom: 10 }} />
            <textarea className="input-field" value={entryActions} onChange={e => setEntryActions(e.target.value)}
              placeholder="Actions taken or next steps (optional)..."
              style={{ height: 70, resize: "none", marginBottom: 14 }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => { setShowAddEntry(false); setEntryContent(""); setEntryActions(""); }}
                style={{ background: "white", border: "1px solid #E2E8F0", padding: "9px 20px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleAddEntry} disabled={submitting || !entryContent.trim()} style={{
                background: submitting ? "#8FA3BB" : "#1A5FA8", color: "white", border: "none",
                padding: "9px 24px", borderRadius: 4, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
              }}>
                {submitting ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </div>
        )}

        {/* Entries List */}
        {entries.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#8FA3BB" }}>No journal entries yet.</div>
            <div style={{ fontSize: 11, color: "#C4D0DC", marginTop: 4 }}>Add the first entry to begin documenting this investigation.</div>
          </div>
        ) : entries.map((entry, i) => (
          <div key={entry.id} style={{ padding: "22px 24px", borderBottom: i < entries.length - 1 ? "1px solid #F7F9FC" : "none" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "#0B1F3A",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, color: "white", flexShrink: 0,
                }}>
                  {entry.dayNumber}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0B1F3A", letterSpacing: "0.05em" }}>Input {entry.dayNumber}</div>
                  <div style={{ fontSize: 10, color: "#8FA3BB", marginTop: 1 }}>
                    {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    {entry.author && ` · ${entry.author.name}`}
                  </div>
                </div>
              </div>
              {caseData.status === "Active" && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="action-btn" onClick={() => handleDeleteEntry(entry.id)}
                    style={{ background: "#FDECEA", border: "none", color: "#C0392B", padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              )}
            </div>

            {editingEntry === entry.id ? (
              <div>
                <textarea className="input-field" value={editContent} onChange={e => setEditContent(e.target.value)}
                  style={{ height: 100, resize: "none", marginBottom: 10 }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditingEntry(null); setEditContent(""); }}
                    style={{ background: "white", border: "1px solid #E2E8F0", padding: "8px 16px", borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>
                    Cancel
                  </button>
                  <button onClick={() => handleEditEntry(entry.id)} disabled={submitting}
                    style={{ background: "#1A5FA8", color: "white", border: "none", padding: "8px 20px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                    {submitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 13, color: "#1F3347", lineHeight: 1.7, marginBottom: entry.actions ? 12 : 0 }}>{entry.content}</div>
                {entry.actions && (
                  <div style={{ background: "#F7F9FC", border: "1px solid #EEF2F7", borderRadius: 4, padding: "10px 14px", marginTop: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8FA3BB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Actions Taken</div>
                    <div style={{ fontSize: 12, color: "#4E6478", lineHeight: 1.6 }}>{entry.actions}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CDR Requests */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(11,31,58,0.05)", marginTop: 24 }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A", display: "flex", alignItems: "center", gap: 8 }}>
              <Phone size={14} color="#1A5FA8" /> CDR Requests
            </div>
            <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2 }}>
              {(caseData.cdrRequests || []).length} {(caseData.cdrRequests || []).length === 1 ? "request" : "requests"}
            </div>
          </div>
          {caseData.status === "Active" && (
            <button onClick={() => setShowCdrModal(true)} style={{
              background: "#1A5FA8", color: "white", border: "none",
              padding: "9px 18px", borderRadius: 4, fontSize: 12,
              fontWeight: 600, cursor: "pointer", display: "flex",
              alignItems: "center", gap: 7, fontFamily: "'Segoe UI', sans-serif",
            }}>
              <Plus size={13} /> Log CDR Request
            </button>
          )}
        </div>

        {(caseData.cdrRequests || []).length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#8FA3BB" }}>No CDR requests linked to this case.</div>
          </div>
        ) : (caseData.cdrRequests || []).map((cdr, i) => {
          const statusColors = { Pending: { bg: "#FEF3E2", color: "#D4730A" }, Received: { bg: "#E6F5EE", color: "#1A7A4A" }, Rejected: { bg: "#FDECEA", color: "#C0392B" } };
          const sc = statusColors[cdr.status] || statusColors.Pending;
          return (
            <div key={cdr.id} style={{ padding: "16px 24px", borderBottom: i < (caseData.cdrRequests || []).length - 1 ? "1px solid #F7F9FC" : "none", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A", marginBottom: 4 }}>{cdr.phoneNumber}</div>
                <div style={{ fontSize: 11, color: "#8FA3BB" }}>
                  {cdr.telco} · {new Date(cdr.periodStart).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} — {new Date(cdr.periodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#4E6478", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cdr.reason}</div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 3, background: sc.bg, color: sc.color, letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>
                {cdr.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Case Activity Log */}
      {(caseData.caseActivities || []).length > 0 && (
        <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(11,31,58,0.05)", marginTop: 24 }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Case Activity</div>
            <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2 }}>Audit trail of actions on this case</div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {(caseData.caseActivities || []).map((a, i) => (
              <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1A5FA8", flexShrink: 0 }} />
                  {i < (caseData.caseActivities || []).length - 1 && (
                    <div style={{ width: 1, height: 28, background: "#E2E8F0", marginTop: 3 }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingBottom: i < (caseData.caseActivities || []).length - 1 ? 4 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>{a.action}</span>
                    <span style={{ fontSize: 11, color: "#8FA3BB" }}>by {a.userName}</span>
                  </div>
                  {a.detail && (
                    <div style={{ fontSize: 11, color: "#4E6478", marginTop: 2 }}>{a.detail}</div>
                  )}
                  <div style={{ fontSize: 10, color: "#A8BFCF", marginTop: 3 }}>
                    {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    {new Date(a.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CDR Modal */}
      {showCdrModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 520, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Log CDR Request</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>Linked to {caseData.caseNumber}</div>
              </div>
              <button onClick={() => { setShowCdrModal(false); setCdrDupeWarning(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Phone Number *</label>
                <input className="input-field" value={cdrForm.phoneNumber} onChange={e => setCdrForm({ ...cdrForm, phoneNumber: e.target.value })} placeholder="+233244000000" />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Telco *</label>
                <select className="input-field" value={cdrForm.telco} onChange={e => setCdrForm({ ...cdrForm, telco: e.target.value, otherTelco: "" })}>
                  {TELCOS.map(t => <option key={t}>{t}</option>)}
                </select>
                {cdrForm.telco === "Other" && (
                  <input className="input-field" value={cdrForm.otherTelco} onChange={e => setCdrForm({ ...cdrForm, otherTelco: e.target.value })} placeholder="Specify telco..." style={{ marginTop: 8 }} />
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Period Start *</label>
                <input className="input-field" type="date" value={cdrForm.periodStart} onChange={e => setCdrForm({ ...cdrForm, periodStart: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Period End *</label>
                <input className="input-field" type="date" value={cdrForm.periodEnd} onChange={e => setCdrForm({ ...cdrForm, periodEnd: e.target.value })} />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Reason / Justification *</label>
              <textarea className="input-field" value={cdrForm.reason} onChange={e => setCdrForm({ ...cdrForm, reason: e.target.value })}
                placeholder="Why is this CDR being requested?" style={{ height: 80, resize: "none" }} />
            </div>

            {cdrDupeWarning && (
              <div style={{ background: "#FEF3E2", border: "1px solid #F5D79E", borderRadius: 4, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#8A5200", marginBottom: 3 }}>⚠ Duplicate detected</div>
                <div style={{ fontSize: 12, color: "#8A5200", lineHeight: 1.6 }}>
                  This number already has a CDR request{cdrDupeWarning.case ? ` linked to ${cdrDupeWarning.case.caseNumber}` : ""}. Do you still want to proceed?
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => { setShowCdrModal(false); setCdrDupeWarning(null); }} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>
                Cancel
              </button>
              {cdrDupeWarning ? (
                <button onClick={doCdrSubmit} disabled={submitting} style={{
                  background: "#D4730A", color: "white", border: "none",
                  padding: "10px 28px", borderRadius: 4, fontSize: 13,
                  fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                }}>
                  {submitting ? "Saving..." : "Log Anyway"}
                </button>
              ) : (
                <button onClick={handleCdrSubmit} disabled={submitting} style={{
                  background: "#1A5FA8", color: "white", border: "none",
                  padding: "10px 28px", borderRadius: 4, fontSize: 13,
                  fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
                }}>
                  {submitting ? "Saving..." : "Log Request"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 480, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Decline Case</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>{caseData.caseNumber} · {caseData.title}</div>
              </div>
              <button onClick={() => { setShowDeclineModal(false); setDeclineReason(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Reason for Declining *
              </label>
              <textarea className="input-field" value={declineReason} onChange={e => setDeclineReason(e.target.value)}
                placeholder="Provide a reason for declining this case..."
                style={{ height: 100, resize: "none" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => { setShowDeclineModal(false); setDeclineReason(""); }} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>
                Cancel
              </button>
              <button onClick={async () => {
                if (!declineReason.trim()) return;
                setSubmitting(true);
                try {
                  await fetch(`/api/cases/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Declined", closureReason: declineReason }),
                  });
                  setShowDeclineModal(false); setDeclineReason("");
                  fetchCase();
                } finally { setSubmitting(false); }
              }} disabled={submitting || !declineReason.trim()} style={{
                background: submitting || !declineReason.trim() ? "#8FA3BB" : "#C0392B", color: "white", border: "none",
                padding: "10px 28px", borderRadius: 4, fontSize: 13,
                fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
              }}>
                {submitting ? "Declining..." : "Confirm Decline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Case Modal */}
      {showCloseModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 480, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Close Case</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>{caseData.caseNumber} · {caseData.title}</div>
              </div>
              <button onClick={() => setShowCloseModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Closure Reason *
              </label>
              <select className="input-field" value={closureReason} onChange={e => { setClosureReason(e.target.value); setOtherClosureReason(""); }}>
                {CLOSURE_REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
              {closureReason === "Other" && (
                <input className="input-field" value={otherClosureReason} onChange={e => setOtherClosureReason(e.target.value)}
                  placeholder="Please specify reason for closure..."
                  style={{ marginTop: 10 }} />
              )}
            </div>

            <div style={{ background: "#FEF3E2", border: "1px solid #F5D79E", borderRadius: 4, padding: "12px 16px", marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: "#8A5200", lineHeight: 1.6 }}>
                <strong>Warning:</strong> Closing this case will lock all journal entries. This action can only be undone by an administrator.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowCloseModal(false)} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleCloseCase} disabled={submitting} style={{
                background: "#C0392B", color: "white", border: "none",
                padding: "10px 28px", borderRadius: 4, fontSize: 13,
                fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
              }}>
                {submitting ? "Closing..." : "Close Case"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}