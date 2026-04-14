"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FileBarChart2, Plus, X, ChevronRight, Download, Printer, CheckCircle, AlertCircle, Clock } from "lucide-react";

const REPORT_TYPES = [
  { id: "case", label: "Case Report", desc: "Full investigation file for a single case including journal entries, CDRs and linked data." },
  { id: "weekly", label: "Weekly Activity Report", desc: "Officer activity summary for a specific week." },
  { id: "monthly", label: "Monthly Summary", desc: "Aggregated operational statistics for a calendar month." },
  { id: "annual", label: "Annual Intelligence Summary", desc: "Full year overview of all LELU operations and intelligence activity." },
];

const getWeekBounds = () => {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
};

export default function ReportsPage() {
  const { data: session } = useSession();
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [activityReports, setActivityReports] = useState([]);
  const [recentlyGenerated, setRecentlyGenerated] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genForm, setGenForm] = useState({ caseId: "", from: "", to: "", month: "", year: new Date().getFullYear().toString() });
  const [logForm, setLogForm] = useState({ weekStart: "", weekEnd: "", summary: "", casesWorked: "", challenges: "", nextSteps: "" });

  const { monday, sunday } = getWeekBounds();

  useEffect(() => {
    fetch("/api/cases").then(r => r.json()).then(d => setCases(Array.isArray(d) ? d : []));
    fetch("/api/users").then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : []));
    fetch("/api/reports/activity").then(r => r.json()).then(d => setActivityReports(Array.isArray(d) ? d : []));
    const stored = localStorage.getItem("lelu_recent_reports");
    if (stored) setRecentlyGenerated(JSON.parse(stored));
  }, []);

  const trackGenerated = (type) => {
    const entry = {
      id: Date.now(),
      type: REPORT_TYPES.find(r => r.id === type)?.label,
      generatedAt: new Date().toISOString(),
      by: session?.user?.name,
    };
    const updated = [entry, ...recentlyGenerated].slice(0, 5);
    setRecentlyGenerated(updated);
    localStorage.setItem("lelu_recent_reports", JSON.stringify(updated));
  };

  const submittedThisWeek = activityReports.filter(r => {
    const ws = new Date(r.weekStart);
    return ws >= monday && ws <= sunday;
  }).map(r => r.officerId);

  const pendingOfficers = users.filter(u => !submittedThisWeek.includes(u.id));
  const submittedOfficers = users.filter(u => submittedThisWeek.includes(u.id));

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

  const generateReport = async () => {
    setGenerating(true);
    try {
      let url = "/api/reports/data?type=" + selectedType;
      if (selectedType === "case") url += "&caseId=" + genForm.caseId;
      else if (selectedType === "weekly") { url += "&from=" + genForm.from + "&to=" + genForm.to; }
      else if (selectedType === "monthly") {
        const year = genForm.year;
        const month = genForm.month.padStart(2, "0");
        const from = `${year}-${month}-01`;
        const lastDay = new Date(parseInt(year), parseInt(genForm.month), 0).getDate();
        const to = `${year}-${month}-${lastDay}`;
        url += `&from=${from}&to=${to}`;
      } else if (selectedType === "annual") {
        url += `&from=${genForm.year}-01-01&to=${genForm.year}-12-31`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setShowGenModal(false);
      trackGenerated(selectedType);
      printReport(selectedType, data, genForm);
    } finally { setGenerating(false); }
  };

  const printReport = (type, data, form) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const refNo = `CSA/LELU/${type.toUpperCase().slice(0,3)}/${now.getFullYear()}/${String(Math.floor(Math.random() * 9000) + 1000)}`;

    let title = "", periodStr = "", bodyHTML = "";

    if (type === "case" && data.caseData) {
      const c = data.caseData;
      title = "CASE INTELLIGENCE REPORT";
      periodStr = `Case Reference: ${c.caseNumber}`;
      bodyHTML = `
        <div class="section">
          <div class="section-title">1. CASE OVERVIEW</div>
          <table class="info-table">
            <tr><td class="label">Case Number</td><td>${c.caseNumber}</td></tr>
            <tr><td class="label">Case Title</td><td>${c.title}</td></tr>
            <tr><td class="label">Category</td><td>${c.category}</td></tr>
            <tr><td class="label">Priority</td><td>${c.priority}</td></tr>
            <tr><td class="label">Status</td><td>${c.status}</td></tr>
            <tr><td class="label">Investigating Officer</td><td>${c.officer?.name}</td></tr>
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
              <div class="entry-day">Day ${e.dayNumber} &mdash; ${new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} &mdash; ${e.author?.name}</div>
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
      const cs = data.cases || [], cdrs = data.cdrs || [], fraud = data.fraudEntities || [], intl = data.internationalRequests || [], activities = data.activityReports || [];
      if (type === "weekly") {
        title = "WEEKLY ACTIVITY REPORT";
        periodStr = `Period: ${new Date(form.from).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} to ${new Date(form.to).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
      } else if (type === "monthly") {
        const monthName = new Date(parseInt(form.year), parseInt(form.month) - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
        title = "MONTHLY OPERATIONS SUMMARY";
        periodStr = `Period: ${monthName}`;
      } else {
        title = "ANNUAL INTELLIGENCE SUMMARY";
        periodStr = `Period: 1 January ${form.year} – 31 December ${form.year}`;
      }
      bodyHTML = `
        <div class="section">
          <div class="section-title">1. EXECUTIVE SUMMARY</div>
          <p>This report provides a summary of operational activities conducted by the Law Enforcement and Liaison Unit (LELU) of the Cyber Security Authority (CSA) for the stated reporting period. The report covers case management activity, Call Detail Record (CDR) requests, fraud intelligence database updates, and international cooperation requests.</p>
        </div>
        <div class="section">
          <div class="section-title">2. CASE MANAGEMENT</div>
          <table class="info-table">
            <tr><td class="label">Total Cases in Period</td><td>${cs.length}</td></tr>
            <tr><td class="label">Active Cases</td><td>${cs.filter(c => c.status === "Active").length}</td></tr>
            <tr><td class="label">Closed Cases</td><td>${cs.filter(c => c.status === "Closed").length}</td></tr>
            <tr><td class="label">High Priority Cases</td><td>${cs.filter(c => c.priority === "High").length}</td></tr>
            <tr><td class="label">Total Journal Entries</td><td>${cs.reduce((a, c) => a + (c.entries?.length || 0), 0)}</td></tr>
          </table>
          ${cs.length > 0 ? `<br/><table class="data-table"><thead><tr><th>Case No.</th><th>Title</th><th>Category</th><th>Officer</th><th>Status</th></tr></thead><tbody>${cs.map(c => `<tr><td>${c.caseNumber}</td><td>${c.title}</td><td>${c.category}</td><td>${c.officer?.name}</td><td>${c.status}</td></tr>`).join("")}</tbody></table>` : ""}
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
          <div class="section-title">4. FRAUD DATABASE INTELLIGENCE</div>
          <table class="info-table">
            <tr><td class="label">Entities Added in Period</td><td>${fraud.length}</td></tr>
            <tr><td class="label">Phone Numbers</td><td>${fraud.filter(f => f.type === "Phone Number").length}</td></tr>
            <tr><td class="label">URLs</td><td>${fraud.filter(f => f.type === "URL").length}</td></tr>
            <tr><td class="label">Email Addresses</td><td>${fraud.filter(f => f.type === "Email Address").length}</td></tr>
            <tr><td class="label">Other Entities</td><td>${fraud.filter(f => !["Phone Number","URL","Email Address"].includes(f.type)).length}</td></tr>
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
              <div class="entry-day">${a.officer?.name} &mdash; Week of ${new Date(a.weekStart).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
              <p>${a.summary}</p>
              ${a.casesWorked ? `<p><strong>Cases Worked:</strong> ${a.casesWorked}</p>` : ""}
              ${a.challenges ? `<p><strong>Challenges:</strong> ${a.challenges}</p>` : ""}
              ${a.nextSteps ? `<p><strong>Next Steps:</strong> ${a.nextSteps}</p>` : ""}
            </div>`).join("")}
        </div>` : ""}`;
    }

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
        .sub-header { display: flex; justify-content: space-between; font-size: 9pt; color: #4E6478; padding: 6px 0 16px; border-bottom: 1px solid #D8E2EE; margin-bottom: 24px; }
        .report-title { text-align: center; margin-bottom: 24px; }
        .report-title h1 { font-size: 14pt; font-weight: bold; color: #0B1F3A; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
        .report-title .period { font-size: 10pt; color: #4E6478; }
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
            <img src="${window.location.origin}/csa-logo.png" alt="CSA" />
            <div style="flex:1">
              <div class="org-name">Cyber Security Authority — Ghana</div>
              <div class="unit-name">Law Enforcement and Liaison Unit (LELU)</div>
              <div class="unit-name">P.O. Box CT 4628, Cantonments, Accra, Ghana</div>
            </div>
            <div style="text-align:right"><div class="classification">RESTRICTED</div></div>
          </div>
          <div class="sub-header">
            <span>Ref: ${refNo}</span>
            <span>Date: ${dateStr}</span>
            <span>Generated by: ${session?.user?.name}</span>
          </div>
          <div class="report-title">
            <h1>${title}</h1>
            <div class="period">${periodStr}</div>
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
                Prepared by: ${session?.user?.name}<br/>
                ${session?.user?.role} — LELU/CSA
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

  return (
    <div style={{ padding: 32 }}>
      <style>{`
        .modal-input { width:100%; border:1.5px solid #E2E8F0; border-radius:4px; padding:11px 14px; font-size:13px; color:#0B1F3A; outline:none; box-sizing:border-box; font-family:'Segoe UI',sans-serif; transition:border-color 0.2s; background:white; }
        .modal-input:focus { border-color:#1A5FA8; }
        .modal-input::placeholder { color:#A8BFCF; }
        .report-card:hover { border-color:#1A5FA8 !important; background:#EBF3FB !important; cursor:pointer; }
        .primary-btn:hover { background:#154d8a !important; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

        {/* LEFT */}
        <div>
          {/* Generate */}
          <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(11,31,58,0.05)", marginBottom: 24 }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #EEF2F7", background: "#0B1F3A" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "0.08em", textTransform: "uppercase" }}>Generate Report</div>
              <div style={{ fontSize: 11, color: "#4E6478", marginTop: 3 }}>Select a report type to generate a professional document.</div>
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
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#1A5FA8", fontWeight: 600 }}>
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

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Weekly Submission Tracker */}
          <div style={{ background: "white", borderRadius: 6, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(11,31,58,0.05)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #EEF2F7", background: "#0B1F3A" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "white", letterSpacing: "0.08em", textTransform: "uppercase" }}>This Week's Submissions</div>
              <div style={{ fontSize: 11, color: "#4E6478", marginTop: 2 }}>
                {monday.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – {sunday.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </div>
            </div>
            <div style={{ padding: "14px 20px" }}>
              {users.length === 0 ? (
                <div style={{ fontSize: 12, color: "#8FA3BB", textAlign: "center", padding: "20px 0" }}>Loading officers...</div>
              ) : (
                <>
                  {submittedOfficers.map(u => (
                    <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F7F9FC" }}>
                      <CheckCircle size={15} color="#1A7A4A" strokeWidth={2} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1F3A" }}>{u.name}</div>
                        <div style={{ fontSize: 10, color: "#8FA3BB" }}>{u.role}</div>
                      </div>
                      <span style={{ fontSize: 10, color: "#1A7A4A", fontWeight: 700 }}>Submitted</span>
                    </div>
                  ))}
                  {pendingOfficers.map(u => (
                    <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F7F9FC" }}>
                      <AlertCircle size={15} color="#D4730A" strokeWidth={2} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1F3A" }}>{u.name}</div>
                        <div style={{ fontSize: 10, color: "#8FA3BB" }}>{u.role}</div>
                      </div>
                      <span style={{ fontSize: 10, color: "#D4730A", fontWeight: 700 }}>Pending</span>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div style={{ padding: "10px 20px", background: "#F7F9FC", borderTop: "1px solid #EEF2F7", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#1A7A4A", fontWeight: 600 }}>{submittedOfficers.length} submitted</span>
              <span style={{ fontSize: 11, color: "#D4730A", fontWeight: 600 }}>{pendingOfficers.length} pending</span>
            </div>
          </div>

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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Generate */}
      {showGenModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 6, padding: "36px 40px", width: 480, boxShadow: "0 24px 64px rgba(11,31,58,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A" }}>{REPORT_TYPES.find(r => r.id === selectedType)?.label}</div>
                <div style={{ fontSize: 12, color: "#8FA3BB", marginTop: 3 }}>Configure and generate your report.</div>
              </div>
              <button onClick={() => setShowGenModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8FA3BB" }}><X size={18} /></button>
            </div>
            {selectedType === "case" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4E6478", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Select Case *</label>
                <select className="modal-input" value={genForm.caseId} onChange={e => setGenForm({ ...genForm, caseId: e.target.value })}>
                  <option value="">Choose a case...</option>
                  {cases.map(c => <option key={c.id} value={c.id}>{c.caseNumber} — {c.title}</option>)}
                </select>
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

      {/* Modal: Log Activity */}
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