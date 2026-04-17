"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FileBarChart2, Plus, X, ChevronRight, Download, Clock, Users, BarChart2 } from "lucide-react";

const ADMIN_ROLES   = ["HEAD_OF_UNIT", "ADMIN"];
const VISIBLE_ROLES = ["HEAD_OF_UNIT", "ADMIN", "SUPERVISOR", "OFFICER", "OFFICE_ADMINISTRATOR"];

const REPORT_TYPES = [
  { id: "case",    label: "Case Report",             desc: "Full investigation file for a single case including journal entries, CDRs and linked data." },
  { id: "weekly",  label: "Weekly Activity Report",  desc: "Officer activity summary for a specific week." },
  { id: "monthly", label: "Monthly Summary",         desc: "Aggregated operational statistics for a calendar month." },
  { id: "annual",  label: "Annual Intelligence Summary", desc: "Full year overview of all LELU operations and intelligence activity." },
];

export default function ReportsPage() {
  const { data: session } = useSession();
  const isAdmin = ADMIN_ROLES.includes(session?.user?.role);

  const [cases,            setCases]            = useState([]);
  const [users,            setUsers]            = useState([]);
  const [activityReports,  setActivityReports]  = useState([]);
  const [recentlyGenerated,setRecentlyGenerated]= useState([]);

  // Officer selector
  const [selectedOfficer, setSelectedOfficer] = useState(null); // null = no filter

  // Modals
  const [showLogModal,    setShowLogModal]    = useState(false);
  const [showGenModal,    setShowGenModal]    = useState(false);
  const [showTeamModal,   setShowTeamModal]   = useState(false);
  const [selectedType,    setSelectedType]    = useState(null);

  // Loading states
  const [submitting,       setSubmitting]       = useState(false);
  const [generating,       setGenerating]       = useState(false);
  const [teamGenerating,   setTeamGenerating]   = useState(false);

  const [genForm,  setGenForm]  = useState({ caseId: "", from: "", to: "", month: "", year: new Date().getFullYear().toString() });
  const [teamForm, setTeamForm] = useState({ year: new Date().getFullYear().toString(), from: "", to: "" });
  const [logForm,  setLogForm]  = useState({ weekStart: "", weekEnd: "", summary: "", casesWorked: "", challenges: "", nextSteps: "" });

  useEffect(() => {
    fetch("/api/cases").then(r => r.json()).then(d => setCases(Array.isArray(d) ? d : []));
    fetch("/api/users").then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : []));
    fetch("/api/reports/activity").then(r => r.json()).then(d => setActivityReports(Array.isArray(d) ? d : []));
    const stored = localStorage.getItem("lelu_recent_reports");
    if (stored) try { setRecentlyGenerated(JSON.parse(stored)); } catch {}
  }, []);

  const trackGenerated = (label, officerName) => {
    const entry = {
      id: Date.now(),
      type: label,
      generatedAt: new Date().toISOString(),
      by: session?.user?.name,
      officer: officerName || null,
    };
    const updated = [entry, ...recentlyGenerated].slice(0, 5);
    setRecentlyGenerated(updated);
    localStorage.setItem("lelu_recent_reports", JSON.stringify(updated));
  };

  // Cases visible in the dropdown — filter by selected officer for admins
  const visibleCases = selectedOfficer
    ? cases.filter(c => c.officer?.id === selectedOfficer.id)
    : cases;

  // ── Log Weekly Activity ───────────────────────────────────────────────────
  const handleLogSubmit = async () => {
    if (!logForm.weekStart || !logForm.weekEnd || !logForm.summary.trim()) {
      alert("Week dates and summary are required."); return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logForm),
      });
      if (res.ok) {
        setShowLogModal(false);
        setLogForm({ weekStart: "", weekEnd: "", summary: "", casesWorked: "", challenges: "", nextSteps: "" });
        fetch("/api/reports/activity").then(r => r.json()).then(d => setActivityReports(Array.isArray(d) ? d : []));
      }
    } finally { setSubmitting(false); }
  };

  // ── Generate individual officer report ────────────────────────────────────
  const generateReport = async () => {
    setGenerating(true);
    try {
      let url = "/api/reports/data?type=" + selectedType;
      if (selectedOfficer) url += "&officerId=" + selectedOfficer.id;

      if (selectedType === "case") {
        url += "&caseId=" + genForm.caseId;
      } else if (selectedType === "weekly") {
        url += "&from=" + genForm.from + "&to=" + genForm.to;
      } else if (selectedType === "monthly") {
        const year  = genForm.year;
        const month = genForm.month.padStart(2, "0");
        const from  = `${year}-${month}-01`;
        const lastDay = new Date(parseInt(year), parseInt(genForm.month), 0).getDate();
        const to    = `${year}-${month}-${lastDay}`;
        url += `&from=${from}&to=${to}`;
      } else if (selectedType === "annual") {
        url += `&from=${genForm.year}-01-01&to=${genForm.year}-12-31`;
      }

      const res  = await fetch(url);
      const data = await res.json();
      setShowGenModal(false);
      const officerName = selectedOfficer?.name || null;
      trackGenerated(REPORT_TYPES.find(r => r.id === selectedType)?.label, officerName);
      printReport(selectedType, data, genForm, officerName);
    } finally { setGenerating(false); }
  };

  // ── Generate Team Report ──────────────────────────────────────────────────
  const generateTeamReport = async () => {
    setTeamGenerating(true);
    try {
      const from = teamForm.from || `${teamForm.year}-01-01`;
      const to   = teamForm.to   || `${teamForm.year}-12-31`;
      const res  = await fetch(`/api/reports/data?team=true&from=${from}&to=${to}`);
      const data = await res.json();
      setShowTeamModal(false);
      trackGenerated("Team Intelligence Report", "All Officers");
      printTeamReport(data, { from, to, year: teamForm.year });
    } finally { setTeamGenerating(false); }
  };

  const escHtml = (str) =>
    (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // ── Print individual report ───────────────────────────────────────────────
  const printReport = (type, data, form, officerName) => {
    const now    = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const refNo  = `CSA/LELU/${type.toUpperCase().slice(0,3)}/${now.getFullYear()}/${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const officerLine = officerName ? `<span>Officer: <strong>${officerName}</strong></span>` : "";

    let title = "", periodStr = "", bodyHTML = "";

    if (type === "case" && data.caseData) {
      const c = data.caseData;
      title     = "CASE INTELLIGENCE REPORT";
      periodStr = `Case Reference: ${c.caseNumber}`;
      bodyHTML  = `
        <div class="section">
          <div class="section-title">1. CASE OVERVIEW</div>
          <table class="info-table">
            <tr><td class="label">Case Number</td><td>${c.caseNumber}</td></tr>
            <tr><td class="label">Case Title</td><td>${c.title}</td></tr>
            <tr><td class="label">Category</td><td>${c.category}</td></tr>
            <tr><td class="label">Status</td><td>${c.status}</td></tr>
            <tr><td class="label">Investigating Officer</td><td>${c.officer?.name || "—"}</td></tr>
            <tr><td class="label">Date Opened</td><td>${new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
            ${c.closedAt ? `<tr><td class="label">Date Closed</td><td>${new Date(c.closedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</td></tr>` : ""}
            ${c.closureReason ? `<tr><td class="label">Closure Reason</td><td>${c.closureReason}</td></tr>` : ""}
          </table>
          ${c.description ? `<p class="desc">${c.description}</p>` : ""}
        </div>
        <div class="section">
          <div class="section-title">2. INVESTIGATION JOURNAL</div>
          ${!c.entries?.length ? "<p>No journal entries recorded.</p>" : c.entries.map(e => `
            <div class="entry-block">
              <div class="entry-day">Day ${e.dayNumber} &mdash; ${new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} &mdash; ${e.author?.name || "—"}</div>
              <p>${e.content}</p>
              ${e.actions ? `<div class="actions-block"><strong>Actions Taken:</strong> ${e.actions}</div>` : ""}
            </div>
          `).join("")}
        </div>
        <div class="section">
          <div class="section-title">3. CDR REQUESTS</div>
          ${!c.cdrRequests?.length ? "<p>No CDR requests logged for this case.</p>" : `
            <table class="data-table">
              <thead><tr><th>Phone Number</th><th>Telco</th><th>Period</th><th>Status</th></tr></thead>
              <tbody>${c.cdrRequests.map(r => `<tr><td>${r.phoneNumber}</td><td>${r.telco}</td><td>${new Date(r.periodStart).toLocaleDateString("en-GB")} – ${new Date(r.periodEnd).toLocaleDateString("en-GB")}</td><td>${r.status}</td></tr>`).join("")}</tbody>
            </table>`}
        </div>
        <div class="section">
          <div class="section-title">4. INTERNATIONAL REQUESTS</div>
          ${!c.internationalRequests?.length ? "<p>No international requests linked to this case.</p>" : `
            <table class="data-table">
              <thead><tr><th>Reference</th><th>Direction</th><th>Country</th><th>Agency</th><th>Status</th></tr></thead>
              <tbody>${c.internationalRequests.map(r => `<tr><td>${r.refNumber}</td><td>${r.direction}</td><td>${r.country}</td><td>${r.agency}</td><td>${r.status}</td></tr>`).join("")}</tbody>
            </table>`}
        </div>`;
    } else {
      const cs         = data.cases || [];
      const cdrs       = data.cdrs  || [];
      const intl       = data.internationalRequests || [];
      const activities = data.activityReports || [];

      if (type === "weekly") {
        title     = "WEEKLY ACTIVITY REPORT";
        periodStr = `Period: ${new Date(form.from).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} to ${new Date(form.to).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
      } else if (type === "monthly") {
        const monthName = new Date(parseInt(form.year), parseInt(form.month) - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
        title     = "MONTHLY OPERATIONS SUMMARY";
        periodStr = `Period: ${monthName}`;
      } else {
        title     = "ANNUAL INTELLIGENCE SUMMARY";
        periodStr = `Period: 1 January ${form.year} – 31 December ${form.year}`;
      }

      bodyHTML = `
        <div class="section">
          <div class="section-title">1. EXECUTIVE SUMMARY</div>
          <p>This report provides a summary of operational activities conducted by the Law Enforcement and Liaison Unit (LELU) of the Cyber Security Authority (CSA) for the stated reporting period. The report covers case management activity, Call Detail Record (CDR) requests, and international cooperation requests.</p>
        </div>
        <div class="section">
          <div class="section-title">2. CASE MANAGEMENT</div>
          <table class="info-table">
            <tr><td class="label">Total Cases in Period</td><td>${cs.length}</td></tr>
            <tr><td class="label">Active Cases</td><td>${cs.filter(c => c.status === "Active").length}</td></tr>
            <tr><td class="label">Closed Cases</td><td>${cs.filter(c => c.status === "Closed").length}</td></tr>
            <tr><td class="label">Total Journal Entries</td><td>${cs.reduce((a, c) => a + (c.entries?.length || 0), 0)}</td></tr>
          </table>
          ${cs.length > 0 ? `<br/><table class="data-table"><thead><tr><th>Case No.</th><th>Title</th><th>Category</th><th>Officer</th><th>Status</th></tr></thead><tbody>${cs.map(c => `<tr><td>${c.caseNumber}</td><td>${c.title}</td><td>${c.category}</td><td>${c.officer?.name || "—"}</td><td>${c.status}</td></tr>`).join("")}</tbody></table>` : ""}
        </div>
        <div class="section">
          <div class="section-title">3. CDR REQUEST STATUS</div>
          <table class="info-table">
            <tr><td class="label">Total CDR Requests</td><td>${cdrs.length}</td></tr>
            <tr><td class="label">Pending</td><td>${cdrs.filter(c => c.status === "Pending").length}</td></tr>
            <tr><td class="label">Received</td><td>${cdrs.filter(c => c.status === "Received").length}</td></tr>
          </table>
          ${cdrs.length > 0 ? `<br/><table class="data-table"><thead><tr><th>Phone Number</th><th>Telco</th><th>Linked Case</th><th>Status</th></tr></thead><tbody>${cdrs.map(c => `<tr><td>${c.phoneNumber}</td><td>${c.telco}</td><td>${c.case?.caseNumber || "—"}</td><td>${c.status}</td></tr>`).join("")}</tbody></table>` : ""}
        </div>
        <div class="section">
          <div class="section-title">4. INTELLIGENCE DATABASE</div>
          <table class="info-table">
            <tr><td class="label">Total Cases</td><td>${cs.length}</td></tr>
            <tr><td class="label">Total CDR Requests</td><td>${cdrs.length}</td></tr>
            <tr><td class="label">Total Network Requests</td><td>${intl.length}</td></tr>
            <tr><td class="label">Total Journal Entries</td><td>${cs.reduce((a, c) => a + (c.entries?.length || 0), 0)}</td></tr>
          </table>
        </div>
        <div class="section">
          <div class="section-title">5. INTERNATIONAL COOPERATION</div>
          <table class="info-table">
            <tr><td class="label">Total International Requests</td><td>${intl.length}</td></tr>
            <tr><td class="label">Outgoing Requests</td><td>${intl.filter(r => r.direction === "Outgoing").length}</td></tr>
            <tr><td class="label">Incoming Requests</td><td>${intl.filter(r => r.direction === "Incoming").length}</td></tr>
            <tr><td class="label">Pending Response</td><td>${intl.filter(r => r.status === "Pending").length}</td></tr>
          </table>
        </div>
        ${activities.length > 0 ? `
        <div class="section">
          <div class="section-title">6. OFFICER ACTIVITY REPORTS</div>
          ${activities.map(a => `
            <div class="entry-block">
              <div class="entry-day">${a.officer?.name || "—"} &mdash; Week of ${new Date(a.weekStart).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
              <p>${a.summary}</p>
              ${a.casesWorked ? `<p><strong>Cases Worked:</strong> ${a.casesWorked}</p>` : ""}
              ${a.challenges  ? `<p><strong>Challenges:</strong> ${a.challenges}</p>`   : ""}
              ${a.nextSteps   ? `<p><strong>Next Steps:</strong> ${a.nextSteps}</p>`    : ""}
            </div>`).join("")}
        </div>` : ""}`;
    }

    const officerHeaderLine = officerName
      ? `<div style="font-size:10pt; color:#1A5FA8; font-weight:bold; margin-top:4px;">Intelligence Report — Officer: ${officerName}</div>`
      : "";

    openReportWindow(title, periodStr, refNo, dateStr, bodyHTML, officerName, officerHeaderLine, officerLine);
  };

  // ── Print Team Report ─────────────────────────────────────────────────────
  const printTeamReport = (data, form) => {
    const now      = new Date();
    const dateStr  = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const refNo    = `CSA/LELU/TEAM/${now.getFullYear()}/${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const fromDate = new Date(form.from);
    const toDate   = new Date(form.to);
    const periodStr = `${fromDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} – ${toDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;

    const cs    = data.cases    || [];
    const cdrs  = data.cdrs     || [];
    const intl  = data.internationalRequests || [];
    const entr  = data.entries  || [];
    const users = data.users    || [];

    // Per-officer stats
    const officerStats = {};
    users.forEach(u => { officerStats[u.id] = { name: u.name, role: u.role, cases: 0, cdrs: 0, intl: 0, entries: 0 }; });
    cs.forEach(c   => { if (c.officer?.id && officerStats[c.officer.id])   officerStats[c.officer.id].cases++;   });
    cdrs.forEach(c => { if (c.officer?.id && officerStats[c.officer.id])   officerStats[c.officer.id].cdrs++;    });
    intl.forEach(r => { if (r.officer?.id && officerStats[r.officer.id])   officerStats[r.officer.id].intl++;    });
    entr.forEach(e => { if (e.author?.id  && officerStats[e.author.id])    officerStats[e.author.id].entries++;  });

    const statsArr    = Object.values(officerStats).filter(o => VISIBLE_ROLES.includes(o.role));
    const mostActive  = statsArr.sort((a, b) => (b.cases + b.cdrs + b.intl) - (a.cases + a.cdrs + a.intl))[0];

    // Category breakdown
    const categoryMap = {};
    cs.forEach(c => { categoryMap[c.category] = (categoryMap[c.category] || 0) + 1; });
    const categories  = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

    const bodyHTML = `
      <div class="section">
        <div class="section-title">1. EXECUTIVE SUMMARY</div>
        <p>This report provides a consolidated intelligence overview for the Law Enforcement and Liaison Unit (LELU) of the Cyber Security Authority (CSA), covering all officers for the stated reporting period. It includes team-wide case statistics, CDR request activity, international cooperation, and per-officer performance metrics.</p>
      </div>

      <div class="section">
        <div class="section-title">2. TEAM OVERVIEW</div>
        <table class="info-table">
          <tr><td class="label">Total Cases</td><td>${cs.length}</td></tr>
          <tr><td class="label">Active Cases</td><td>${cs.filter(c => c.status === "Active").length}</td></tr>
          <tr><td class="label">Closed Cases</td><td>${cs.filter(c => c.status === "Closed").length}</td></tr>
          <tr><td class="label">Total CDR Requests</td><td>${cdrs.length}</td></tr>
          <tr><td class="label">CDR Requests Received</td><td>${cdrs.filter(c => c.status === "Received").length}</td></tr>
          <tr><td class="label">Total Network Requests</td><td>${intl.length}</td></tr>
          <tr><td class="label">Total Journal Entries</td><td>${entr.length}</td></tr>
          <tr><td class="label">Active Officers</td><td>${statsArr.length}</td></tr>
          ${mostActive ? `<tr><td class="label">Most Active Officer</td><td><strong>${mostActive.name}</strong> — ${mostActive.cases} cases, ${mostActive.cdrs} CDRs, ${mostActive.intl} network requests</td></tr>` : ""}
        </table>
      </div>

      <div class="section">
        <div class="section-title">3. CASES BY CATEGORY</div>
        ${categories.length === 0 ? "<p>No cases in this period.</p>" : `
          <table class="data-table">
            <thead><tr><th>Category</th><th>Count</th><th>Share</th></tr></thead>
            <tbody>${categories.map(([cat, count]) => `<tr><td>${cat}</td><td>${count}</td><td>${Math.round(count / cs.length * 100)}%</td></tr>`).join("")}</tbody>
          </table>`}
      </div>

      <div class="section">
        <div class="section-title">4. PER-OFFICER ACTIVITY</div>
        <table class="data-table">
          <thead><tr><th>Officer</th><th>Role</th><th>Cases</th><th>CDR Requests</th><th>Network Requests</th><th>Journal Entries</th></tr></thead>
          <tbody>${statsArr.map(o => `<tr><td>${o.name}</td><td>${o.role.replace(/_/g, " ")}</td><td>${o.cases}</td><td>${o.cdrs}</td><td>${o.intl}</td><td>${o.entries}</td></tr>`).join("")}</tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">5. ALL CASES</div>
        ${cs.length === 0 ? "<p>No cases in this period.</p>" : `
          <table class="data-table">
            <thead><tr><th>Case No.</th><th>Title</th><th>Category</th><th>Officer</th><th>Status</th></tr></thead>
            <tbody>${cs.map(c => `<tr><td>${c.caseNumber}</td><td>${c.title}</td><td>${c.category}</td><td>${c.officer?.name || "—"}</td><td>${c.status}</td></tr>`).join("")}</tbody>
          </table>`}
      </div>

      <div class="section">
        <div class="section-title">6. INTERNATIONAL COOPERATION</div>
        <table class="info-table">
          <tr><td class="label">Total Requests</td><td>${intl.length}</td></tr>
          <tr><td class="label">Outgoing</td><td>${intl.filter(r => r.direction === "Outgoing").length}</td></tr>
          <tr><td class="label">Incoming</td><td>${intl.filter(r => r.direction === "Incoming").length}</td></tr>
          <tr><td class="label">Pending Response</td><td>${intl.filter(r => r.status === "Pending").length}</td></tr>
          <tr><td class="label">Responded</td><td>${intl.filter(r => r.status === "Responded").length}</td></tr>
        </table>
      </div>`;

    const officerHeaderLine = `<div style="font-size:10pt; color:#6B3FA0; font-weight:bold; margin-top:4px;">Team Intelligence Report — All Officers</div>`;
    openReportWindow("TEAM INTELLIGENCE REPORT", `Period: ${periodStr}`, refNo, dateStr, bodyHTML, "All Officers", officerHeaderLine, "");
  };

  // ── Shared window opener ──────────────────────────────────────────────────
  const openReportWindow = (title, periodStr, refNo, dateStr, bodyHTML, officerName, officerHeaderLine, officerSubLine) => {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <title>${title}</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Tahoma, sans-serif; font-size: 12pt; color: #000; background: #E8ECEF; }
        .toolbar { background: #0B1F3A; padding: 12px 40px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
        .toolbar-title { color: white; font-family: Tahoma; font-size: 11pt; font-weight: bold; letter-spacing: 1px; }
        .toolbar-btns { display: flex; gap: 10px; }
        .btn { padding: 8px 20px; font-family: Tahoma; font-size: 10pt; font-weight: bold; cursor: pointer; border: none; border-radius: 3px; display: flex; align-items: center; gap: 6px; }
        .btn-print { background: #1A5FA8; color: white; }
        .btn-download { background: #1A7A4A; color: white; }
        .btn:hover { opacity: 0.9; }
        .page { max-width: 780px; margin: 30px auto; padding: 50px 60px; background: white; box-shadow: 0 4px 24px rgba(0,0,0,0.12); }
        .header { display: flex; align-items: center; gap: 20px; padding-bottom: 16px; border-bottom: 3px solid #0B1F3A; margin-bottom: 6px; }
        .header img { width: 70px; height: 70px; border-radius: 50%; border: 2px solid #E2E8F0; }
        .org-name { font-size: 11pt; font-weight: bold; color: #0B1F3A; letter-spacing: 1px; text-transform: uppercase; }
        .unit-name { font-size: 9pt; color: #4E6478; margin-top: 2px; }
        .classification { background: #0B1F3A; color: white; font-size: 8pt; font-weight: bold; letter-spacing: 2px; padding: 3px 12px; border-radius: 2px; text-align: center; margin-top: 4px; display: inline-block; }
        .sub-header { display: flex; justify-content: space-between; font-size: 9pt; color: #4E6478; padding: 6px 0 16px; border-bottom: 1px solid #D8E2EE; margin-bottom: 24px; flex-wrap: wrap; gap: 4px; }
        .report-title { text-align: center; margin-bottom: 24px; }
        .report-title h1 { font-size: 14pt; font-weight: bold; color: #0B1F3A; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
        .report-title .period { font-size: 10pt; color: #4E6478; }
        .report-title .officer-scope { font-size: 10pt; color: #1A5FA8; font-weight: bold; margin-top: 4px; }
        .title-rule { width: 60px; height: 3px; background: #1A5FA8; margin: 12px auto; }
        .section { margin-bottom: 28px; }
        .section-title { font-size: 11pt; font-weight: bold; color: #0B1F3A; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 10px; background: #F0F4F8; border-left: 4px solid #1A5FA8; margin-bottom: 14px; }
        p { text-align: justify; line-height: 1.7; margin-bottom: 10px; }
        .desc { text-align: justify; line-height: 1.7; color: #333; margin-top: 10px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .info-table tr { border-bottom: 1px solid #EEF2F7; }
        .info-table td { padding: 7px 10px; font-size: 11pt; }
        .info-table td.label { font-weight: bold; color: #0B1F3A; width: 220px; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 10pt; }
        .data-table thead tr { background: #0B1F3A; color: white; }
        .data-table thead th { padding: 8px 10px; text-align: left; font-weight: bold; }
        .data-table tbody tr:nth-child(even) { background: #F7F9FC; }
        .data-table tbody td { padding: 7px 10px; border-bottom: 1px solid #EEF2F7; }
        .entry-block { border-left: 3px solid #1A5FA8; padding: 10px 14px; margin-bottom: 16px; background: #F7F9FC; }
        .entry-day { font-size: 10pt; font-weight: bold; color: #0B1F3A; margin-bottom: 6px; }
        .actions-block { margin-top: 8px; padding: 8px 10px; background: white; border: 1px solid #E2E8F0; font-size: 10pt; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 2px solid #0B1F3A; display: flex; justify-content: space-between; align-items: flex-end; }
        .footer-left { font-size: 9pt; color: #4E6478; line-height: 1.8; }
        .sig-line { border-top: 1px solid #000; width: 200px; padding-top: 4px; font-size: 9pt; margin-top: 50px; line-height: 1.6; }
        .confidential { font-size: 8pt; color: #C0392B; font-weight: bold; letter-spacing: 1px; text-align: center; margin-top: 12px; }
        @media print {
          body { background: white; }
          .toolbar { display: none; }
          .page { margin: 0; box-shadow: none; padding: 40px 50px; }
          * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      </style></head>
      <body>
        <div class="toolbar">
          <div class="toolbar-title">CSA / LELU — ${title}</div>
          <div class="toolbar-btns">
            <button class="btn btn-print" onclick="window.print()">🖨 Print</button>
            <button class="btn btn-download" onclick="downloadPDF()">⬇ Download PDF</button>
          </div>
        </div>
        <div class="page" id="report-content">
          <div class="header">
            <img src="${typeof window !== "undefined" ? window.location.origin : ""}/csa-logo.png" alt="CSA" />
            <div style="flex:1">
              <div class="org-name">Cyber Security Authority — Ghana</div>
              <div class="unit-name">Law Enforcement and Liaison Unit (LELU)</div>
              <div class="unit-name">P.O. Box CT 4628, Cantonments, Accra, Ghana</div>
              ${officerHeaderLine}
            </div>
            <div style="text-align:right"><div class="classification">RESTRICTED</div></div>
          </div>
          <div class="sub-header">
            <span>Ref: ${refNo}</span>
            <span>Date: ${dateStr}</span>
            ${officerSubLine}
            <span>Generated by: ${escHtml(session?.user?.name)}</span>
          </div>
          <div class="report-title">
            <h1>${title}</h1>
            <div class="period">${periodStr}</div>
            ${officerName ? `<div class="officer-scope">Officer: ${officerName}</div>` : ""}
            <div class="title-rule"></div>
          </div>
          ${bodyHTML}
          <div class="footer">
            <div class="footer-left">
              <div>CSA — Law Enforcement and Liaison Unit</div>
              <div>Intelligence Management Platform</div>
              <div style="color:#C0392B; font-weight:bold; font-size:8pt; margin-top:4px;">RESTRICTED — FOR OFFICIAL USE ONLY</div>
            </div>
            <div>
              <div class="sig-line">
                Prepared by: ${escHtml(session?.user?.name)}<br/>
                ${escHtml(session?.user?.role?.replace(/_/g, " "))} — LELU/CSA<br/>
                ${officerName ? `Report covers: ${officerName}` : ""}
              </div>
            </div>
          </div>
          <div class="confidential">RESTRICTED — FOR OFFICIAL USE ONLY — CSA/LELU</div>
        </div>
        <script>
          function downloadPDF() {
            const btn = document.querySelector('.toolbar');
            btn.style.display = 'none';
            const element = document.getElementById('report-content');
            const opt = {
              margin: [10, 10],
              filename: '${refNo.replace(/\//g, "-")}.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save().then(() => {
              btn.style.display = 'flex';
            });
          }
        </script>
      </body></html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: 32 }}>
      <style>{`
        .modal-input { width:100%; border:1.5px solid #E2E8F0; border-radius:4px; padding:11px 14px; font-size:13px; color:#0B1F3A; outline:none; box-sizing:border-box; font-family:'Segoe UI',sans-serif; transition:border-color 0.2s; background:white; }
        .modal-input:focus { border-color:#1A5FA8; }
        .modal-input::placeholder { color:#A8BFCF; }
        .report-card:hover { border-color:#1A5FA8 !important; background:#EBF3FB !important; cursor:pointer; }
        .officer-chip { transition: all 0.15s; cursor: pointer; }
        .officer-chip:hover { border-color:#1A5FA8 !important; }
        .primary-btn:hover { background:#154d8a !important; }
        .team-btn:hover { background:#4f2d80 !important; }
      `}</style>

      {/* ── Admin Officer Selector ─────────────────────────────────────── */}
      {isAdmin && users.length > 0 && (
        <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", padding: "16px 20px", marginBottom: 20, boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 4 }}>
              <Users size={13} color="#1A5FA8" strokeWidth={2} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0B1F3A", textTransform: "uppercase", letterSpacing: "0.08em" }}>Viewing Officer</span>
            </div>

            {/* "All Officers" chip */}
            <button
              className="officer-chip"
              onClick={() => setSelectedOfficer(null)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: selectedOfficer === null ? 700 : 400,
                background: selectedOfficer === null ? "#0B1F3A" : "white",
                color: selectedOfficer === null ? "white" : "#4E6478",
                border: `1px solid ${selectedOfficer === null ? "#0B1F3A" : "#E2E8F0"}`,
                fontFamily: "'Segoe UI', sans-serif", cursor: "pointer",
              }}>
              All Officers
            </button>

            {/* Individual officer chips */}
            {users.filter(u => u.role !== "ADMIN" && u.role !== "OFFICE_ADMINISTRATOR").map(u => {
              const isActive = selectedOfficer?.id === u.id;
              return (
                <button key={u.id} className="officer-chip"
                  onClick={() => setSelectedOfficer(isActive ? null : u)}
                  style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: isActive ? 700 : 400,
                    background: isActive ? "#1A5FA8" : "white",
                    color: isActive ? "white" : "#4E6478",
                    border: `1px solid ${isActive ? "#1A5FA8" : "#E2E8F0"}`,
                    fontFamily: "'Segoe UI', sans-serif", cursor: "pointer",
                  }}>
                  {u.name}
                </button>
              );
            })}

            {selectedOfficer && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#1A5FA8", fontWeight: 600 }}>
                Reports will be filtered for: <strong>{selectedOfficer.name}</strong>
                <button onClick={() => setSelectedOfficer(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB", padding: "2px 4px", display: "flex", alignItems: "center" }}>
                  <X size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

        {/* LEFT ─────────────────────────────────────────────────────────── */}
        <div>

          {/* Generate Reports */}
          <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(11,31,58,0.05)", marginBottom: 24 }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #EEF2F7", background: "#0B1F3A", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "0.08em", textTransform: "uppercase" }}>Generate Report</div>
                <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 3 }}>
                  {selectedOfficer ? `Generating for: ${selectedOfficer.name}` : "Select a report type to generate a professional document."}
                </div>
              </div>
              {/* Team Report button — HEAD_OF_UNIT only */}
              {isAdmin && (
                <button
                  className="team-btn"
                  onClick={() => setShowTeamModal(true)}
                  style={{ background: "#6B3FA0", color: "white", border: "none", padding: "9px 18px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "'Segoe UI',sans-serif", transition: "background 0.15s", whiteSpace: "nowrap" }}>
                  <BarChart2 size={13} /> Generate Team Report
                </button>
              )}
            </div>

            <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {REPORT_TYPES.map(rt => (
                <div key={rt.id} className="report-card"
                  onClick={() => { setSelectedType(rt.id); setShowGenModal(true); }}
                  style={{ border: "1.5px solid #E2E8F0", borderRadius: 6, padding: "18px 20px", transition: "all 0.15s", background: "white" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: "#F0F4F8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <FileBarChart2 size={18} color="#1A5FA8" strokeWidth={1.8} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A", marginBottom: 6 }}>{rt.label}</div>
                  <div style={{ fontSize: 11, color: "#8FA3BB", lineHeight: 1.6 }}>{rt.desc}</div>
                  {selectedOfficer && (
                    <div style={{ marginTop: 8, fontSize: 10, color: "#1A5FA8", background: "#EBF3FB", padding: "3px 8px", borderRadius: 3, display: "inline-block" }}>
                      For: {selectedOfficer.name}
                    </div>
                  )}
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#1A5FA8", fontWeight: 600 }}>
                    Generate <ChevronRight size={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Reports List */}
          <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>Activity Reports</div>
                <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2 }}>Weekly submissions from all officers.</div>
              </div>
              <button className="primary-btn" onClick={() => setShowLogModal(true)} style={{ background: "#1A5FA8", color: "white", border: "none", padding: "9px 18px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "'Segoe UI',sans-serif", transition: "background 0.15s" }}>
                <Plus size={13} /> Log This Week
              </button>
            </div>
            {activityReports.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center" }}>
                <FileBarChart2 size={36} color="#D8E2EE" strokeWidth={1} style={{ margin: "0 auto 12px", display: "block" }} />
                <div style={{ fontSize: 13, color: "#8FA3BB" }}>No activity reports submitted yet.</div>
                <div style={{ fontSize: 11, color: "#C4D0DC", marginTop: 4 }}>Officers should log weekly activity every Friday.</div>
              </div>
            ) : activityReports.slice(0, 8).map((r, i) => (
              <div key={r.id} style={{ padding: "14px 24px", borderBottom: i < Math.min(activityReports.length, 8) - 1 ? "1px solid #F7F9FC" : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#0B1F3A" }}>{r.officer?.name}</div>
                      <div style={{ fontSize: 10, color: "#8FA3BB" }}>
                        {new Date(r.weekStart).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {new Date(r.weekEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#4E6478", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 460 }}>{r.summary}</div>
                  </div>
                  <span style={{ background: "#E6F5EE", color: "#1A7A4A", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 3, textTransform: "uppercase", flexShrink: 0, marginLeft: 12 }}>Submitted</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT ────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Recently Generated */}
          <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #EEF2F7" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0B1F3A" }}>Recently Generated</div>
              <div style={{ fontSize: 11, color: "#8FA3BB", marginTop: 2 }}>Reports generated in this session.</div>
            </div>
            <div style={{ padding: "8px 0" }}>
              {recentlyGenerated.length === 0 ? (
                <div style={{ padding: "24px 20px", textAlign: "center", fontSize: 12, color: "#C4D0DC" }}>No reports generated yet this session.</div>
              ) : recentlyGenerated.map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderBottom: i < recentlyGenerated.length - 1 ? "1px solid #F7F9FC" : "none" }}>
                  <Clock size={13} color="#8FA3BB" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1F3A" }}>{r.type}</div>
                    <div style={{ fontSize: 10, color: "#8FA3BB" }}>
                      {new Date(r.generatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} · {r.by}
                      {r.officer && <span style={{ color: "#1A5FA8", marginLeft: 4 }}>· {r.officer}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Modal: Generate Individual Report ────────────────────────────── */}
      {showGenModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 480, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>{REPORT_TYPES.find(r => r.id === selectedType)?.label}</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>
                  {selectedOfficer ? `Officer: ${selectedOfficer.name}` : "Configure and generate your report."}
                </div>
              </div>
              <button onClick={() => setShowGenModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            {/* Officer context banner */}
            {selectedOfficer && (
              <div style={{ background: "#EBF3FB", border: "1px solid #BDD7F5", borderRadius: 4, padding: "9px 14px", marginBottom: 20, fontSize: 12, color: "#1A5FA8", display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={13} strokeWidth={2} />
                Report will be filtered for <strong>{selectedOfficer.name}</strong>
              </div>
            )}

            {selectedType === "case" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Select Case *</label>
                <select className="modal-input" value={genForm.caseId} onChange={e => setGenForm({ ...genForm, caseId: e.target.value })}>
                  <option value="">Choose a case...</option>
                  {visibleCases.map(c => <option key={c.id} value={c.id}>{c.caseNumber} — {c.title}</option>)}
                </select>
                {selectedOfficer && visibleCases.length === 0 && (
                  <div style={{ fontSize: 11, color: "#D4730A", marginTop: 6 }}>No cases found for {selectedOfficer.name}.</div>
                )}
              </div>
            )}
            {selectedType === "weekly" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Week Start *</label>
                  <input className="modal-input" type="date" value={genForm.from} onChange={e => setGenForm({ ...genForm, from: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Week End *</label>
                  <input className="modal-input" type="date" value={genForm.to} onChange={e => setGenForm({ ...genForm, to: e.target.value })} />
                </div>
              </div>
            )}
            {selectedType === "monthly" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Month *</label>
                  <select className="modal-input" value={genForm.month} onChange={e => setGenForm({ ...genForm, month: e.target.value })}>
                    <option value="">Select month...</option>
                    {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m,i) => <option key={m} value={i+1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Year *</label>
                  <select className="modal-input" value={genForm.year} onChange={e => setGenForm({ ...genForm, year: e.target.value })}>
                    {[2024,2025,2026,2027].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            )}
            {selectedType === "annual" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Year *</label>
                <select className="modal-input" value={genForm.year} onChange={e => setGenForm({ ...genForm, year: e.target.value })}>
                  {[2024,2025,2026,2027].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowGenModal(false)} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI',sans-serif" }}>Cancel</button>
              <button className="primary-btn" onClick={generateReport} disabled={generating} style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI',sans-serif", display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s" }}>
                <Download size={14} />{generating ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Team Report ────────────────────────────────────────────── */}
      {showTeamModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 460, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Team Intelligence Report</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>All officers — full unit overview and per-officer breakdown.</div>
              </div>
              <button onClick={() => setShowTeamModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>

            <div style={{ background: "#F3EDFC", border: "1px solid #D4BBF5", borderRadius: 4, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#6B3FA0" }}>
              Covers all officers. Includes total cases, CDR requests, most active officer, category breakdown, and per-officer stats.
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Year</label>
              <select className="modal-input" value={teamForm.year} onChange={e => setTeamForm({ ...teamForm, year: e.target.value, from: "", to: "" })}>
                {[2024,2025,2026,2027].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Custom Date Range (optional)</label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 10, color: "#8FA3BB", display: "block", marginBottom: 4 }}>From</label>
                <input className="modal-input" type="date" value={teamForm.from} onChange={e => setTeamForm({ ...teamForm, from: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: "#8FA3BB", display: "block", marginBottom: 4 }}>To</label>
                <input className="modal-input" type="date" value={teamForm.to} onChange={e => setTeamForm({ ...teamForm, to: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowTeamModal(false)} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI',sans-serif" }}>Cancel</button>
              <button className="team-btn" onClick={generateTeamReport} disabled={teamGenerating} style={{ background: "#6B3FA0", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI',sans-serif", display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s" }}>
                <BarChart2 size={14} />{teamGenerating ? "Generating..." : "Generate Team Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Log Activity ────────────────────────────────────────────── */}
      {showLogModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 540, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>Log Weekly Activity</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>Submit your activity report for the week.</div>
              </div>
              <button onClick={() => setShowLogModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Week Start *</label>
                <input className="modal-input" type="date" value={logForm.weekStart} onChange={e => setLogForm({ ...logForm, weekStart: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Week End *</label>
                <input className="modal-input" type="date" value={logForm.weekEnd} onChange={e => setLogForm({ ...logForm, weekEnd: e.target.value })} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Weekly Summary *</label>
              <textarea className="modal-input" value={logForm.summary} onChange={e => setLogForm({ ...logForm, summary: e.target.value })} placeholder="Describe your key activities and achievements this week..." style={{ height: 100, resize: "none" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Cases Worked On</label>
              <input className="modal-input" value={logForm.casesWorked} onChange={e => setLogForm({ ...logForm, casesWorked: e.target.value })} placeholder="e.g. LELU-2026-001, LELU-2026-002..." />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Challenges Encountered</label>
              <textarea className="modal-input" value={logForm.challenges} onChange={e => setLogForm({ ...logForm, challenges: e.target.value })} placeholder="Any obstacles or blockers this week..." style={{ height: 70, resize: "none" }} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Next Steps</label>
              <textarea className="modal-input" value={logForm.nextSteps} onChange={e => setLogForm({ ...logForm, nextSteps: e.target.value })} placeholder="What are you planning for next week..." style={{ height: 70, resize: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowLogModal(false)} style={{ background: "white", border: "1px solid #E2E8F0", padding: "10px 22px", borderRadius: 4, fontSize: 13, cursor: "pointer", color: "#4E6478", fontFamily: "'Segoe UI',sans-serif" }}>Cancel</button>
              <button className="primary-btn" onClick={handleLogSubmit} disabled={submitting} style={{ background: "#1A5FA8", color: "white", border: "none", padding: "10px 28px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI',sans-serif", transition: "background 0.15s" }}>
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
