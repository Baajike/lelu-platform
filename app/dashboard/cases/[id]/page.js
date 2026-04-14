"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit2, Trash2, X, ChevronDown } from "lucide-react";

const CLOSURE_REASONS = [
  "Case Resolved",
  "Suspect Arrested",
  "Referred to Prosecution",
  "Insufficient Evidence",
  "Duplicate Case",
  "Withdrawn by Complainant",
  "Other",
];

const StatusBadge = ({ status }) => {
  const map = { Active: { bg: "#E6F5EE", color: "#1A7A4A" }, Closed: { bg: "#EEF2F7", color: "#4E6478" } };
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

  const fetchCase = async () => {
    try {
      const res = await fetch(`/api/cases/${id}`);
      const data = await res.json();
      setCaseData(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCase(); }, [id]);

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
              <PriorityBadge priority={caseData.priority} />
              <span style={{ fontSize: 11, color: "#8FA3BB" }}>{caseData.category}</span>
              <span style={{ fontSize: 11, color: "#8FA3BB" }}>· Opened by {caseData.officer?.name}</span>
            </div>
          </div>
          {caseData.status === "Active" && (
            <button onClick={() => setShowCloseModal(true)} style={{
              background: "#C0392B", color: "white", border: "none",
              padding: "10px 22px", borderRadius: 4, fontSize: 12,
              fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
              letterSpacing: "0.05em",
            }}>
              Close Case
            </button>
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
              Day {entries.length + 1} Entry
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
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0B1F3A", letterSpacing: "0.05em" }}>Day {entry.dayNumber}</div>
                  <div style={{ fontSize: 10, color: "#8FA3BB", marginTop: 1 }}>
                    {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    {entry.author && ` · ${entry.author.name}`}
                  </div>
                </div>
              </div>
              {caseData.status === "Active" && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="action-btn" onClick={() => { setEditingEntry(entry.id); setEditContent(entry.content); }}
                    style={{ background: "#EBF3FB", border: "none", color: "#1A5FA8", padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <Edit2 size={11} /> Edit
                  </button>
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