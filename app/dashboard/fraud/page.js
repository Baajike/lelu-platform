"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, X, Briefcase, PhoneCall, BookOpen, Globe, AlertTriangle, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

const TYPE_CONFIG = {
  CASE:    { label: "CASE",    color: "#1A5FA8", bg: "#EBF3FB", Icon: Briefcase },
  CDR:     { label: "CDR",     color: "#D4730A", bg: "#FEF3E2", Icon: PhoneCall },
  JOURNAL: { label: "JOURNAL", color: "#1A7A4A", bg: "#E6F5EE", Icon: BookOpen },
  NETWORK: { label: "NETWORK", color: "#6B3FA0", bg: "#F3EDFC", Icon: Globe },
};

const TYPE_MAP = { Cases: "CASE", CDR: "CDR", Journal: "JOURNAL", Network: "NETWORK" };

const extractPhoneTokens = (text) => {
  if (!text) return [];
  const raw = text.match(/\+?[\d][\d\s\-\.\(\)]{5,}[\d]/g) || [];
  return [...new Set(raw.map(m => m.replace(/[^\d]/g, "")).filter(m => m.length >= 7))];
};

const computeCrossRefs = (cases, cdrs, entries, intl) => {
  const tokenToItems = new Map();

  const addTokens = (id, tokens) => {
    tokens.forEach(token => {
      if (token.length < 7) return;
      if (!tokenToItems.has(token)) tokenToItems.set(token, new Set());
      tokenToItems.get(token).add(id);
    });
  };

  cases.forEach(c => addTokens(c.id, extractPhoneTokens(`${c.title} ${c.description || ""}`)));
  cdrs.forEach(c => {
    const norm = c.phoneNumber.replace(/[^\d]/g, "");
    addTokens(c.id, [...new Set([norm, ...extractPhoneTokens(c.phoneNumber)])]);
  });
  entries.forEach(e => addTokens(e.id, extractPhoneTokens(`${e.content} ${e.actions || ""}`)));
  intl.forEach(r => addTokens(r.id, extractPhoneTokens(`${r.subject} ${r.details || ""}`)));

  const crossRefs = {};
  tokenToItems.forEach((itemSet) => {
    if (itemSet.size >= 2) {
      itemSet.forEach(id => {
        crossRefs[id] = Math.max(crossRefs[id] || 0, itemSet.size);
      });
    }
  });
  return crossRefs;
};

const isThisWeek = (dateStr) => {
  const now = new Date();
  const d = new Date(dateStr);
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  start.setHours(0, 0, 0, 0);
  return d >= start;
};

const isThisMonth = (dateStr) => {
  const now = new Date();
  const d = new Date(dateStr);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

function SearchSection({ title, icon: Icon, color, count, children }) {
  return (
    <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.05)" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #E2E8F0", background: "#F7F9FC", display: "flex", alignItems: "center", gap: 10 }}>
        <Icon size={14} color={color} strokeWidth={2} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#0B1F3A", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</span>
        <span style={{ fontSize: 11, color: "#8FA3BB", background: "#EEF2F7", padding: "1px 8px", borderRadius: 10, fontWeight: 600 }}>{count}</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default function FraudPage() {
  const router = useRouter();
  const [allData, setAllData] = useState({ cases: [], cdrs: [], entries: [], international: [] });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    const safeGet = async (url) => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    };
    const [cases, cdrs, entries, international] = await Promise.all([
      safeGet("/api/cases"),
      safeGet("/api/cdr"),
      safeGet("/api/entries"),
      safeGet("/api/international"),
    ]);
    setAllData({ cases, cdrs, entries, international });
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();

    const onFocus = () => fetchAll();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const crossRefs = useMemo(
    () => computeCrossRefs(allData.cases, allData.cdrs, allData.entries, allData.international),
    [allData]
  );

  const feedItems = useMemo(() => {
    const { cases, cdrs, entries, international } = allData;
    const items = [
      ...cases.map(c => ({
        id: c.id, type: "CASE", date: c.createdAt,
        label: c.title,
        sub: `${c.caseNumber} · ${c.category}`,
        officer: c.officer?.name,
        navigateTo: `/dashboard/cases/${c.id}`,
        status: c.status,
      })),
      ...cdrs.map(c => ({
        id: c.id, type: "CDR", date: c.requestedAt,
        label: c.phoneNumber,
        sub: `${c.telco}${c.case ? ` · ${c.case.caseNumber}` : ""}`,
        officer: c.officer?.name,
        navigateTo: `/dashboard/cdr`,
        status: c.status,
      })),
      ...entries.map(e => ({
        id: e.id, type: "JOURNAL", date: e.createdAt,
        label: e.content?.length > 90 ? e.content.slice(0, 90) + "…" : e.content,
        sub: `Input ${e.dayNumber}${e.case ? ` · ${e.case.caseNumber}` : ""}`,
        officer: e.author?.name,
        navigateTo: e.case?.id ? `/dashboard/cases/${e.case.id}` : null,
      })),
      ...international.map(r => ({
        id: r.id, type: "NETWORK", date: r.createdAt,
        label: r.subject,
        sub: `${r.country} · ${r.agency}`,
        officer: r.officer?.name,
        navigateTo: `/dashboard/international`,
        status: r.status,
      })),
    ];
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allData]);

  const filteredFeed = useMemo(() => {
    return feedItems.filter(item => {
      if (typeFilter !== "All" && item.type !== TYPE_MAP[typeFilter]) return false;
      if (dateFilter === "This Week" && !isThisWeek(item.date)) return false;
      if (dateFilter === "This Month" && !isThisMonth(item.date)) return false;
      return true;
    });
  }, [feedItems, typeFilter, dateFilter]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return {
      cases: allData.cases.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.caseNumber?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      ),
      entries: allData.entries.filter(e =>
        e.content?.toLowerCase().includes(q) ||
        e.actions?.toLowerCase().includes(q)
      ),
      cdrs: allData.cdrs.filter(c => c.phoneNumber?.toLowerCase().includes(q)),
      international: allData.international.filter(r =>
        r.subject?.toLowerCase().includes(q) ||
        r.agency?.toLowerCase().includes(q) ||
        r.country?.toLowerCase().includes(q)
      ),
    };
  }, [search, allData]);

  const handleSearch = () => setSearch(searchInput);
  const handleClear = () => { setSearch(""); setSearchInput(""); };

  const total = allData.cases.length + allData.cdrs.length + allData.entries.length + allData.international.length;

  return (
    <div style={{ padding: 32 }}>
      <style>{`
        @keyframes lelu-spin { to { transform: rotate(360deg); } }
        .lelu-spinner { width: 28px; height: 28px; border: 3px solid #EEF2F7; border-top-color: #1A5FA8; border-radius: 50%; animation: lelu-spin 0.7s linear infinite; margin: 0 auto; }
        .intel-item { transition: background 0.12s; cursor: pointer; }
        .intel-item:hover { background: #F7F9FC !important; }
        .filter-pill { transition: all 0.15s; cursor: pointer; }
        .filter-pill:hover { border-color: #1A5FA8 !important; }
        .fraud-row:hover td { background: #F7F9FC; }
      `}</style>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Intel Items", value: total,                          color: "#0B1F3A" },
          { label: "Cases",             value: allData.cases.length,           color: "#1A5FA8" },
          { label: "CDR Requests",      value: allData.cdrs.length,            color: "#D4730A" },
          { label: "Network Requests",  value: allData.international.length,   color: "#6B3FA0" },
          { label: "Journal Entries",   value: allData.entries.length,         color: "#1A7A4A" },
        ].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 6, padding: "16px 20px", border: "1px solid #E2E8F0", borderTop: `3px solid ${s.color}`, boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
            <div style={{ fontSize: 10, color: "#8FA3BB", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{loading ? "—" : s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#0B1F3A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Master Search</div>
        <div style={{ fontSize: 11, color: "#8FA3BB", marginBottom: 14 }}>Search across Cases, CDR Requests, Journal Entries and Network Requests simultaneously.</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8FA3BB" }} />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Search any value, case number, phone number, subject..."
              style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 4, padding: "10px 14px 10px 34px", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Segoe UI', sans-serif", color: "#0B1F3A", transition: "border-color 0.2s" }}
            />
          </div>
          <button onClick={handleSearch}
            style={{ background: "#0B1F3A", color: "white", border: "none", padding: "10px 22px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.05em", whiteSpace: "nowrap", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1A5FA8"}
            onMouseLeave={e => e.currentTarget.style.background = "#0B1F3A"}
          >
            Search
          </button>
          {search && (
            <button onClick={handleClear}
              style={{ background: "#F7F9FC", color: "#4E6478", border: "1px solid #E2E8F0", padding: "10px 14px", borderRadius: 4, fontSize: 12, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#EEF2F7"; e.currentTarget.style.borderColor = "#C4D0DC"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F7F9FC"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
        {search && searchResults && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#4E6478" }}>
            {(() => {
              const t = (searchResults.cases?.length || 0) + (searchResults.entries?.length || 0) + (searchResults.cdrs?.length || 0) + (searchResults.international?.length || 0);
              return <><strong style={{ color: "#0B1F3A" }}>{t}</strong> {t === 1 ? "result" : "results"} across all modules for <strong style={{ color: "#1A5FA8" }}>"{search}"</strong></>;
            })()}
          </div>
        )}
      </div>

      {/* Filter Bar — live feed only */}
      {!search && (
        <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 4 }}>Type</div>
          {["All", "Cases", "CDR", "Journal", "Network"].map(t => {
            const cfg = TYPE_CONFIG[TYPE_MAP[t]];
            const isActive = typeFilter === t;
            return (
              <button key={t} className="filter-pill" onClick={() => setTypeFilter(t)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: isActive ? 700 : 400, background: isActive ? "#0B1F3A" : "white", color: isActive ? "white" : "#4E6478", border: `1px solid ${isActive ? "#0B1F3A" : "#E2E8F0"}`, fontFamily: "'Segoe UI', sans-serif", cursor: "pointer" }}>
                {cfg && <cfg.Icon size={11} strokeWidth={2} />}
                {t}
              </button>
            );
          })}
          <div style={{ width: 1, height: 20, background: "#E2E8F0", margin: "0 4px" }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: "#8FA3BB", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 4 }}>Date</div>
          {["All Time", "This Month", "This Week"].map(d => {
            const isActive = dateFilter === d;
            return (
              <button key={d} className="filter-pill" onClick={() => setDateFilter(d)}
                style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: isActive ? 700 : 400, background: isActive ? "#1A5FA8" : "white", color: isActive ? "white" : "#4E6478", border: `1px solid ${isActive ? "#1A5FA8" : "#E2E8F0"}`, fontFamily: "'Segoe UI', sans-serif", cursor: "pointer" }}>
                {d}
              </button>
            );
          })}
          <div style={{ marginLeft: "auto", fontSize: 11, color: "#8FA3BB" }}>
            {filteredFeed.length} item{filteredFeed.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Search Results View */}
      {search && searchResults ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {searchResults.cases?.length > 0 && (
            <SearchSection title="Cases" icon={Briefcase} color="#1A5FA8" count={searchResults.cases.length}>
              {searchResults.cases.map((c, i) => (
                <tr key={c.id} className="fraud-row"
                  onClick={() => router.push(`/dashboard/cases/${c.id}`)}
                  style={{ borderBottom: i < searchResults.cases.length - 1 ? "1px solid #F7F9FC" : "none", cursor: "pointer" }}>
                  <td style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#1A5FA8", whiteSpace: "nowrap" }}>{c.caseNumber}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#0B1F3A", maxWidth: 280 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "#F3EDFC", color: "#6B3FA0", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>{c.category}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase", background: c.status === "Active" ? "#E6F5EE" : "#EEF2F7", color: c.status === "Active" ? "#1A7A4A" : "#4E6478" }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#4E6478" }}>{c.officer?.name || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#C4D0DC" }}>›</td>
                </tr>
              ))}
            </SearchSection>
          )}

          {searchResults.entries?.length > 0 && (
            <SearchSection title="Journal Entries" icon={BookOpen} color="#1A7A4A" count={searchResults.entries.length}>
              {searchResults.entries.map((e, i) => (
                <tr key={e.id} className="fraud-row"
                  onClick={() => e.case?.id && router.push(`/dashboard/cases/${e.case.id}`)}
                  style={{ borderBottom: i < searchResults.entries.length - 1 ? "1px solid #F7F9FC" : "none", cursor: "pointer" }}>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1A5FA8" }}>{e.case?.caseNumber || "—"}</div>
                    <div style={{ fontSize: 10, color: "#8FA3BB", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.case?.title}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#4E6478" }}>Input {e.dayNumber}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#0B1F3A", maxWidth: 380 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.content}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#4E6478" }}>{e.author?.name || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: "#8FA3BB", whiteSpace: "nowrap" }}>
                    {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#C4D0DC" }}>›</td>
                </tr>
              ))}
            </SearchSection>
          )}

          {searchResults.cdrs?.length > 0 && (
            <SearchSection title="CDR Requests" icon={PhoneCall} color="#D4730A" count={searchResults.cdrs.length}>
              {searchResults.cdrs.map((c, i) => (
                <tr key={c.id} className="fraud-row"
                  onClick={() => router.push("/dashboard/cdr")}
                  style={{ borderBottom: i < searchResults.cdrs.length - 1 ? "1px solid #F7F9FC" : "none", cursor: "pointer" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>{c.phoneNumber}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#4E6478" }}>{c.telco}</td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: "#8FA3BB", whiteSpace: "nowrap" }}>
                    {new Date(c.periodStart).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(c.periodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase", background: c.status === "Pending" ? "#FEF3E2" : "#E6F5EE", color: c.status === "Pending" ? "#D4730A" : "#1A7A4A" }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {c.case ? <span style={{ fontSize: 11, fontWeight: 700, color: "#1A5FA8" }}>{c.case.caseNumber}</span> : <span style={{ color: "#C4D0DC", fontSize: 11 }}>—</span>}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#4E6478" }}>{c.officer?.name || "—"}</td>
                </tr>
              ))}
            </SearchSection>
          )}

          {searchResults.international?.length > 0 && (
            <SearchSection title="Network Requests" icon={Globe} color="#6B3FA0" count={searchResults.international.length}>
              {searchResults.international.map((r, i) => (
                <tr key={r.id} className="fraud-row"
                  style={{ borderBottom: i < searchResults.international.length - 1 ? "1px solid #F7F9FC" : "none" }}>
                  <td style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#1A5FA8", whiteSpace: "nowrap" }}>{r.refNumber}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, background: r.direction === "Outgoing" ? "#F3EDFC" : "#E6F5EE", color: r.direction === "Outgoing" ? "#6B3FA0" : "#1A7A4A", padding: "3px 10px", borderRadius: 3 }}>{r.direction}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1F3A" }}>{r.country}</div>
                    <div style={{ fontSize: 11, color: "#8FA3BB" }}>{r.agency}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#0B1F3A", maxWidth: 260 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.subject}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase", background: r.status === "Pending" ? "#FEF3E2" : r.status === "Responded" ? "#E6F5EE" : "#EEF2F7", color: r.status === "Pending" ? "#D4730A" : r.status === "Responded" ? "#1A7A4A" : "#4E6478" }}>{r.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {r.case ? <span style={{ fontSize: 11, fontWeight: 700, color: "#1A5FA8" }}>{r.case.caseNumber}</span> : <span style={{ color: "#C4D0DC", fontSize: 11 }}>—</span>}
                  </td>
                </tr>
              ))}
            </SearchSection>
          )}

          {searchResults.cases?.length === 0 && searchResults.entries?.length === 0 && searchResults.cdrs?.length === 0 && searchResults.international?.length === 0 && (
            <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", padding: 72, textAlign: "center", boxShadow: "0 1px 6px rgba(11,31,58,0.05)" }}>
              <Activity size={40} color="#D8E2EE" strokeWidth={1} style={{ margin: "0 auto 14px", display: "block" }} />
              <div style={{ fontSize: 13, color: "#8FA3BB", fontWeight: 500 }}>No results for "{search}" across any module.</div>
              <div style={{ fontSize: 11, color: "#C4D0DC", marginTop: 4 }}>Try a different term or check the spelling.</div>
            </div>
          )}
        </div>
      ) : (
        /* Live Intelligence Feed */
        <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 6px rgba(11,31,58,0.05)" }}>
          {loading ? (
            <div style={{ padding: 64, textAlign: "center" }}><div className="lelu-spinner" /></div>
          ) : filteredFeed.length === 0 ? (
            <div style={{ padding: 72, textAlign: "center" }}>
              <Activity size={40} color="#D8E2EE" strokeWidth={1} style={{ margin: "0 auto 14px", display: "block" }} />
              <div style={{ fontSize: 13, color: "#8FA3BB", fontWeight: 500 }}>No intelligence items match your filters.</div>
              <div style={{ fontSize: 11, color: "#C4D0DC", marginTop: 4 }}>Try a different type or date range.</div>
            </div>
          ) : filteredFeed.map((item, i) => {
            const cfg = TYPE_CONFIG[item.type];
            const xref = crossRefs[item.id];
            return (
              <div key={item.id} className="intel-item"
                onClick={() => item.navigateTo && router.push(item.navigateTo)}
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: i < filteredFeed.length - 1 ? "1px solid #F7F9FC" : "none", background: "white" }}>

                {/* Type badge */}
                <div style={{ flexShrink: 0, width: 80 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, color: cfg.color, fontSize: 9, fontWeight: 800, padding: "4px 10px", borderRadius: 3, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    <cfg.Icon size={10} strokeWidth={2.5} />
                    {cfg.label}
                  </span>
                </div>

                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 500 }}>
                      {item.label}
                    </div>
                    {xref >= 2 && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#FEF3E2", color: "#D4730A", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 3, letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0 }}>
                        <AlertTriangle size={9} strokeWidth={2.5} />
                        {xref} RECORDS
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.sub}{item.officer && <span> · {item.officer}</span>}
                  </div>
                </div>

                {/* Status badge */}
                {item.status && (
                  <div style={{ flexShrink: 0 }}>
                    {item.type === "CASE" && (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase", background: item.status === "Active" ? "#E6F5EE" : "#EEF2F7", color: item.status === "Active" ? "#1A7A4A" : "#4E6478" }}>{item.status}</span>
                    )}
                    {(item.type === "CDR" || item.type === "NETWORK") && (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 3, letterSpacing: "0.05em", textTransform: "uppercase", background: item.status === "Pending" ? "#FEF3E2" : item.status === "Responded" ? "#E6F5EE" : "#EEF2F7", color: item.status === "Pending" ? "#D4730A" : item.status === "Responded" ? "#1A7A4A" : "#4E6478" }}>{item.status}</span>
                    )}
                  </div>
                )}

                {/* Date */}
                <div style={{ flexShrink: 0, fontSize: 11, color: "#8FA3BB", minWidth: 84, textAlign: "right" }}>
                  {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>

                {/* Arrow */}
                {item.navigateTo && (
                  <div style={{ flexShrink: 0, fontSize: 14, color: "#C4D0DC" }}>›</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
