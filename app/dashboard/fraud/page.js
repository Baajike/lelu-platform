"use client";
import { useState, useEffect } from "react";
import { Plus, Search, X, ShieldAlert, Phone, Globe, Mail, User, CreditCard, FileText, Filter, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

const TYPES = ["Phone Number", "URL", "Email Address", "Nickname", "Bank Account", "ID Document", "Other"];
const CATEGORIES = ["Extortion", "Investment Scams", "Impersonation", "Mobile Money Fraud", "SIM Swap", "Phishing", "Other"];

const TYPE_ICON = {
  "Phone Number": Phone, "URL": Globe, "Email Address": Mail,
  "Nickname": User, "Bank Account": CreditCard, "ID Document": FileText, "Other": ShieldAlert,
};

const categoryColor = (cat) => {
  const map = {
    "Extortion": "#C0392B", "Investment Scams": "#6B3FA0",
    "Impersonation": "#1A5FA8", "Mobile Money Fraud": "#D4730A",
    "SIM Swap": "#1A7A4A", "Phishing": "#8A6200",
  };
  return map[cat] || "#4E6478";
};

export default function FraudPage() {
  const router = useRouter();
  const [entities, setEntities] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [form, setForm] = useState({ type: "Phone Number", otherType: "", value: "", category: "Extortion", otherCategory: "", notes: "", caseId: "" });
  const [editOtherCategory, setEditOtherCategory] = useState("");

  const fetchEntities = async (s = "", t = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (s) params.set("search", s);
      if (t && t !== "Other") params.set("type", t);
      const res = await fetch(`/api/fraud?${params.toString()}`);
      const data = await res.json();
      setEntities(Array.isArray(data) ? data : []);
    } catch { setEntities([]); }
    finally { setLoading(false); }
  };

  const fetchCases = async () => {
    try {
      const res = await fetch("/api/cases");
      const data = await res.json();
      setCases(Array.isArray(data) ? data : []);
    } catch { setCases([]); }
  };

  useEffect(() => { fetchEntities(); fetchCases(); }, []);

  const handleSearch = () => { setSearch(searchInput); fetchEntities(searchInput, typeFilter); };
  const handleTypeFilter = (t) => { setTypeFilter(t); fetchEntities(search, t); };

  const handleSubmit = async () => {
    if (!form.value.trim()) { alert("Value is required."); return; }
    if (form.type === "Other" && !form.otherType.trim()) { alert("Please specify the entity type."); return; }
    if (form.category === "Other" && !form.otherCategory.trim()) { alert("Please specify the category."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          type: form.type === "Other" ? form.otherType : form.type,
          category: form.category === "Other" ? form.otherCategory : form.category,
          caseId: form.caseId || null,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ type: "Phone Number", otherType: "", value: "", category: "Extortion", otherCategory: "", notes: "", caseId: "" });
        fetchEntities(search, typeFilter);
      }
    } finally { setSubmitting(false); }
  };

  const handleEdit = async () => {
    if (selectedEntity.category === "Other" && !editOtherCategory.trim()) { alert("Please specify the category."); return; }
    setSubmitting(true);
    try {
      await fetch(`/api/fraud/${selectedEntity.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: selectedEntity.notes,
          category: selectedEntity.category === "Other" ? editOtherCategory : selectedEntity.category,
          caseId: selectedEntity.caseId || null,
        }),
      });
      setShowEditModal(false); setSelectedEntity(null); setEditOtherCategory("");
      fetchEntities(search, typeFilter);
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this entity from the fraud database?")) return;
    await fetch(`/api/fraud/${id}`, { method: "DELETE" });
    fetchEntities(search, typeFilter);
  };

  const TypeIcon = ({ type, size = 14, color = "#4E6478" }) => {
    const Icon = TYPE_ICON[type] || ShieldAlert;
    return <Icon size={size} color={color} strokeWidth={1.8} />;
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
        .fraud-row:hover td { background: #F7F9FC; }
        .primary-btn:hover { background: #154d8a !important; }
        .type-chip { transition: all 0.15s; cursor: pointer; }
        .type-chip:hover { border-color: #1A5FA8 !important; color: #1A5FA8 !important; }
        .case-link:hover { text-decoration: underline; color: #1A5FA8 !important; }
      `}</style>

      {/* Top: Search + Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, background: "white", borderRadius: 6, border: "1px solid #E2E8F0", padding: "20px 24px", boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0B1F3A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Entity Search</div>
          <div style={{ fontSize: 11, color: "#8FA3BB", marginBottom: 14 }}>Search phone numbers, URLs, emails, nicknames or bank accounts across all fraud records.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8FA3BB" }} />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search any entity..."
                style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 4, padding: "10px 14px 10px 34px", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Segoe UI', sans-serif", color: "#0B1F3A", transition: "border-color 0.2s" }}
              />
            </div>
            <button onClick={handleSearch} style={{ background: "#0B1F3A", color: "white", border: "none", padding: "10px 22px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
              Search
            </button>
            {search && (
              <button onClick={() => { setSearch(""); setSearchInput(""); fetchEntities("", typeFilter); }}
                style={{ background: "#F7F9FC", color: "#4E6478", border: "1px solid #E2E8F0", padding: "10px 14px", borderRadius: 4, fontSize: 12, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                Clear
              </button>
            )}
          </div>
          {search && (
            <div style={{ marginTop: 10, fontSize: 12, color: "#4E6478" }}>
              Showing <strong style={{ color: "#0B1F3A" }}>{entities.length}</strong> {entities.length === 1 ? "result" : "results"} for <strong style={{ color: "#1A5FA8" }}>"{search}"</strong>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 180 }}>
          {[
            { label: "Total Entities", value: entities.length, color: "#1A5FA8" },
            { label: "Phone Numbers", value: entities.filter(e => e.type === "Phone Number").length, color: "#D4730A" },
            { label: "Other Types", value: entities.filter(e => e.type !== "Phone Number").length, color: "#6B3FA0" },
          ].map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: 6, padding: "12px 18px", border: "1px solid #E2E8F0", borderLeft: `3px solid ${s.color}`, boxShadow: "0 1px 4px rgba(11,31,58,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "#8FA3BB", fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8FA3BB", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4 }}>
          <Filter size={12} /> Filter
        </div>
        {["All", ...TYPES.filter(t => t !== "Other")].map(t => {
          const isActive = t === "All" ? !typeFilter : typeFilter === t;
          const Icon = t === "All" ? null : TYPE_ICON[t];
          return (
            <button key={t} className="type-chip"
              onClick={() => handleTypeFilter(t === "All" ? "" : t)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 20, fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                background: isActive ? "#0B1F3A" : "white",
                color: isActive ? "white" : "#4E6478",
                border: `1px solid ${isActive ? "#0B1F3A" : "#E2E8F0"}`,
                fontFamily: "'Segoe UI', sans-serif",
              }}>
              {Icon && <Icon size={12} strokeWidth={2} />}
              {t}
            </button>
          );
        })}
        <button className="primary-btn" onClick={() => setShowModal(true)} style={{
          marginLeft: "auto", background: "#1A5FA8", color: "white", border: "none",
          padding: "9px 20px", borderRadius: 4, fontSize: 12, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
          fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.05em", transition: "background 0.15s",
        }}>
          <Plus size={14} /> Add Entity
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F9FC", borderBottom: "1px solid #E2E8F0" }}>
              {["Type", "Value", "Category", "Linked Case", "Notes", "Date Added", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#8FA3BB", fontSize: 13 }}>Loading...</td></tr>
            ) : entities.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 72, textAlign: "center" }}>
                  <ShieldAlert size={40} color="#D8E2EE" strokeWidth={1} style={{ margin: "0 auto 14px", display: "block" }} />
                  <div style={{ fontSize: 13, color: "#8FA3BB", fontWeight: 500 }}>
                    {search ? `No results for "${search}"` : "No fraud entities in the database."}
                  </div>
                  <div style={{ fontSize: 11, color: "#C4D0DC", marginTop: 4 }}>
                    {!search && "Add confirmed fraud entities from your cases to build intelligence."}
                  </div>
                </td>
              </tr>
            ) : entities.map((e, i) => {
              const color = categoryColor(e.category);
              return (
                <tr key={e.id} className="fraud-row"
                  style={{ borderBottom: i < entities.length - 1 ? "1px solid #F7F9FC" : "none" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 6, background: "#F0F4F8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <TypeIcon type={e.type} size={14} color="#4E6478" />
                      </div>
                      <div style={{ fontSize: 12, color: "#4E6478", fontWeight: 500 }}>{e.type}</div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#0B1F3A", maxWidth: 180 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.value}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ background: color + "15", color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {e.category}
                    </span>
                  </td>
                  {/* Linked Case */}
                  <td style={{ padding: "14px 16px" }}>
                    {e.case ? (
                      <button className="case-link"
                        onClick={() => router.push(`/dashboard/cases/${e.case.id}`)}
                        style={{ background: "#EBF3FB", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "'Segoe UI', sans-serif" }}>
                        <ExternalLink size={11} color="#1A5FA8" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#1A5FA8" }}>{e.case.caseNumber}</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: "#C4D0DC" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#4E6478", maxWidth: 180 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.notes || <span style={{ color: "#C4D0DC" }}>—</span>}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 11, color: "#8FA3BB", whiteSpace: "nowrap" }}>
                    {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setSelectedEntity(e); setEditOtherCategory(""); setShowEditModal(true); }}
                        style={{ fontSize: 11, color: "#1A5FA8", background: "#EBF3FB", border: "none", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontFamily: "'Segoe UI', sans-serif" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(e.id)}
                        style={{ fontSize: 11, color: "#C0392B", background: "#FDECEA", border: "none", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontFamily: "'Segoe UI', sans-serif" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Add Entity */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 540, boxShadow: "0 24px 64px rgba(11,31,58,0.25)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Add Fraud Entity</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>Add a confirmed fraud entity to the intelligence database.</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Entity Type *</label>
                <select className="modal-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value, otherType: "" })}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {form.type === "Other" && (
                  <input className="modal-input" value={form.otherType} onChange={e => setForm({ ...form, otherType: e.target.value })}
                    placeholder="Specify type..." style={{ marginTop: 8 }} />
                )}
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Fraud Category *</label>
                <select className="modal-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value, otherCategory: "" })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                {form.category === "Other" && (
                  <input className="modal-input" value={form.otherCategory} onChange={e => setForm({ ...form, otherCategory: e.target.value })}
                    placeholder="Specify category..." style={{ marginTop: 8 }} />
                )}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Value *</label>
              <input className="modal-input" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                placeholder={
                  form.type === "Phone Number" ? "+233244000000" :
                  form.type === "URL" ? "https://scam-site.com" :
                  form.type === "Email Address" ? "scammer@fake.com" :
                  form.type === "Bank Account" ? "Account number..." : "Enter value..."
                } />
            </div>

            {/* Link to Case */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Link to Case (optional)</label>
              <select className="modal-input" value={form.caseId} onChange={e => setForm({ ...form, caseId: e.target.value })}>
                <option value="">— No case linked —</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.caseNumber} — {c.title}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Notes</label>
              <textarea className="modal-input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Any relevant context about this entity..."
                style={{ height: 80, resize: "none" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>Cancel</button>
              <button className="primary-btn" onClick={handleSubmit} disabled={submitting} style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.15s" }}>
                {submitting ? "Saving..." : "Add to Database"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Entity */}
      {showEditModal && selectedEntity && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 480, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Edit Entity</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>Update the category, case link or notes.</div>
              </div>
              <button onClick={() => { setShowEditModal(false); setSelectedEntity(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            <div style={{ background: "#F7F9FC", borderRadius: 4, padding: "14px 16px", marginBottom: 18, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, background: "white", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TypeIcon type={selectedEntity.type} size={16} color="#4E6478" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#8FA3BB", marginBottom: 2 }}>{selectedEntity.type}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0B1F3A" }}>{selectedEntity.value}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Fraud Category</label>
              <select className="modal-input" value={selectedEntity.category}
                onChange={e => { setSelectedEntity({ ...selectedEntity, category: e.target.value }); setEditOtherCategory(""); }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              {selectedEntity.category === "Other" && (
                <input className="modal-input" value={editOtherCategory} onChange={e => setEditOtherCategory(e.target.value)}
                  placeholder="Specify category..." style={{ marginTop: 8 }} />
              )}
            </div>

            {/* Link to Case */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Linked Case</label>
              <select className="modal-input" value={selectedEntity.caseId || ""}
                onChange={e => setSelectedEntity({ ...selectedEntity, caseId: e.target.value })}>
                <option value="">— No case linked —</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.caseNumber} — {c.title}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Notes</label>
              <textarea className="modal-input" value={selectedEntity.notes || ""}
                onChange={e => setSelectedEntity({ ...selectedEntity, notes: e.target.value })}
                style={{ height: 80, resize: "none" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => { setShowEditModal(false); setSelectedEntity(null); }} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI', sans-serif" }}>Cancel</button>
              <button onClick={handleEdit} disabled={submitting} style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}