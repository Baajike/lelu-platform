const { PrismaClient } = require("../app/generated/prisma");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  // ── Users (upsert so safe to re-run) ─────────────────────────────────────
  const password = await bcrypt.hash("lelu2026", 10);
  const userData = [
    { name: "Head of Unit",      email: "head@lelu.gov.gh",       role: "HEAD_OF_UNIT" },
    { name: "Admin Officer",     email: "admin@lelu.gov.gh",      role: "OFFICE_ADMINISTRATOR" },
    { name: "Supervisor Mensah", email: "supervisor@lelu.gov.gh", role: "SUPERVISOR" },
    { name: "Officer Asante",    email: "asante@lelu.gov.gh",     role: "OFFICER" },
    { name: "Officer Boateng",   email: "boateng@lelu.gov.gh",    role: "OFFICER" },
    { name: "Officer Darko",     email: "darko@lelu.gov.gh",      role: "OFFICER" },
  ];
  for (const u of userData) {
    await db.user.upsert({
      where: { email: u.email },
      update: { role: u.role, approved: true },
      create: { ...u, password, approved: true },
    });
  }

  // ── Fetch user IDs ────────────────────────────────────────────────────────
  const users = await db.user.findMany({ select: { id: true, email: true, name: true } });
  const byEmail = Object.fromEntries(users.map(u => [u.email, u]));
  const asante    = byEmail["asante@lelu.gov.gh"];
  const boateng   = byEmail["boateng@lelu.gov.gh"];
  const darko     = byEmail["darko@lelu.gov.gh"];
  const supervisor = byEmail["supervisor@lelu.gov.gh"];
  const head      = byEmail["head@lelu.gov.gh"];

  // ── Clear existing intel data (safe re-seed) ──────────────────────────────
  await db.journalEntry.deleteMany({});
  await db.caseActivity.deleteMany({});
  await db.cdrRequest.deleteMany({});
  await db.internationalRequest.deleteMany({});
  await db.case.deleteMany({});

  // ── Cases ─────────────────────────────────────────────────────────────────
  const caseDefs = [
    {
      caseNumber: "LELU-2026-001",
      title: "Mobile Money Fraud Network — Accra Central",
      category: "Financial Fraud",
      status: "Active",
      description: "Coordinated mobile money fraud ring operating across Greater Accra. Multiple victims defrauded via SIM swap and OTP interception. Estimated loss GHS 245,000.",
      officerId: asante.id,
      createdAt: new Date("2026-01-15"),
    },
    {
      caseNumber: "LELU-2026-002",
      title: "Advance Fee Scheme — West Africa Network",
      category: "Cybercrime",
      status: "Active",
      description: "Transnational advance fee fraud targeting diaspora victims. Suspects operating from multiple West African jurisdictions. Interpol liaison initiated.",
      officerId: boateng.id,
      createdAt: new Date("2026-01-28"),
    },
    {
      caseNumber: "LELU-2026-003",
      title: "Romance Scam Investigation — Social Media",
      category: "Cybercrime",
      status: "Active",
      description: "Organised romance scam network using fabricated social media profiles. 14 victims identified. Cryptocurrency used for fund transfer.",
      officerId: asante.id,
      createdAt: new Date("2026-02-05"),
    },
    {
      caseNumber: "LELU-2026-004",
      title: "Bank Phishing Campaign — Multiple Banks",
      category: "Financial Fraud",
      status: "Active",
      description: "Phishing SMS campaign impersonating three major Ghanaian banks. Fake USSD portals harvesting customer PINs. Over 80 reported victims.",
      officerId: darko.id,
      createdAt: new Date("2026-02-18"),
    },
    {
      caseNumber: "LELU-2026-005",
      title: "Investment Fraud — Ponzi Scheme",
      category: "Financial Fraud",
      status: "Active",
      description: "Fraudulent investment scheme promising 40% monthly returns. Approximately 300 investors, total exposure estimated at GHS 1.2 million.",
      officerId: boateng.id,
      createdAt: new Date("2026-02-22"),
    },
    {
      caseNumber: "LELU-2026-006",
      title: "SIM Swap Fraud — Telco Insider",
      category: "Financial Fraud",
      status: "Closed",
      description: "Insider-facilitated SIM swap attacks. Telco employee suspected of enabling unauthorised SIM swaps for criminal network. Case concluded with arrest.",
      officerId: darko.id,
      createdAt: new Date("2026-01-08"),
      closedAt: new Date("2026-03-10"),
      closureReason: "Suspect arrested and charged. File transferred to prosecution.",
    },
    {
      caseNumber: "LELU-2026-007",
      title: "Lottery Scam — International Call Centre",
      category: "Cybercrime",
      status: "Active",
      description: "Call centre based in neighbouring country operating lottery fraud. Victims directed to transfer 'taxes' on fabricated winnings.",
      officerId: asante.id,
      createdAt: new Date("2026-03-04"),
    },
    {
      caseNumber: "LELU-2026-008",
      title: "Cryptocurrency Investment Fraud",
      category: "Financial Fraud",
      status: "Active",
      description: "Fake crypto trading platform defrauding investors. Victims shown fabricated profits then charged 'withdrawal fees'. Platform now offline.",
      officerId: supervisor.id,
      createdAt: new Date("2026-03-18"),
    },
  ];

  const createdCases = [];
  for (const c of caseDefs) {
    const created = await db.case.create({ data: c });
    createdCases.push(created);
  }

  const caseByNumber = Object.fromEntries(createdCases.map(c => [c.caseNumber, c]));

  // ── Journal Entries ───────────────────────────────────────────────────────
  const entries = [
    {
      caseId: caseByNumber["LELU-2026-001"].id, authorId: asante.id, dayNumber: 1,
      content: "Case opened following complaint from victim Emmanuel Kojo, 48, Adabraka. Victim reported GHS 12,500 transferred from MTN MoMo account without authorisation. SIM swap suspected. Interviewed victim and obtained account transaction records.",
      actions: "Obtained victim statement. Requested MTN transaction logs for +233244571234. Case assigned.",
      createdAt: new Date("2026-01-15"),
    },
    {
      caseId: caseByNumber["LELU-2026-001"].id, authorId: asante.id, dayNumber: 2,
      content: "MTN Ghana compliance team confirmed SIM swap performed on 14 Jan 2026 at 02:17 hrs. Swap authorised at Kaneshie service centre. CCTV footage requested from MTN. Three receiving accounts identified: +233244123456, +233276543210, +233554321098.",
      actions: "CDR request submitted for all three identified numbers. MTN CCTV preservation notice issued.",
      createdAt: new Date("2026-01-17"),
    },
    {
      caseId: caseByNumber["LELU-2026-001"].id, authorId: asante.id, dayNumber: 3,
      content: "CDR data received for primary number +233244123456. Records show 47 calls in 72-hour window following fraud. Funds traced through 3 relay accounts before withdrawal at Tema Community 1. Pattern matches prior MoMo fraud cases LELU-2025-034 and LELU-2025-041.",
      actions: "Cross-referenced with prior cases. Phone number +233244123456 flagged for immediate monitoring. Warrant application prepared.",
      createdAt: new Date("2026-01-22"),
    },
    {
      caseId: caseByNumber["LELU-2026-002"].id, authorId: boateng.id, dayNumber: 1,
      content: "Case initiated on intelligence tip from Ghana Immigration Service. Network of 6 suspects using rented apartments in East Legon as operational base. Targeting diaspora in UK and USA. Minimum 22 victims identified across WhatsApp complaint threads.",
      actions: "Opened liaison file with INTERPOL NCB Accra. Requested subscriber info for email addresses from Gmail via MLAT.",
      createdAt: new Date("2026-01-28"),
    },
    {
      caseId: caseByNumber["LELU-2026-002"].id, authorId: boateng.id, dayNumber: 2,
      content: "INTERPOL response received. Two of the six email addresses linked to prior complaints in Nigeria (2024) and Ivory Coast (2025). Coordinated operation recommended. UK NCA contacted via official channel. Victims in UK collectively lost GBP 34,000.",
      actions: "Coordinated with Supervisor Mensah. International request submitted to NCA UK and EFCC Nigeria. Surveillance authorisation requested.",
      createdAt: new Date("2026-02-03"),
    },
    {
      caseId: caseByNumber["LELU-2026-003"].id, authorId: asante.id, dayNumber: 1,
      content: "14 victims filed complaints over 3-week period. Suspects creating romantic personas on Facebook and Instagram. Eventual request for airtime, mobile money, then bank transfers. Total victim losses approximately GHS 67,000.",
      actions: "Consolidated all 14 victim statements. Identified 4 distinct suspect phone numbers used across victims: +233207654321, +233244987654, +233559876543, +233271234567.",
      createdAt: new Date("2026-02-05"),
    },
    {
      caseId: caseByNumber["LELU-2026-004"].id, authorId: darko.id, dayNumber: 1,
      content: "Bulk SMS campaign sending bank impersonation messages detected. Three banks affected: GCB, Absa, Fidelity. Messages contain malicious links redirecting to fake USSD pages harvesting mobile banking PINs. NCA Cybercrime Unit notified.",
      actions: "Samples of phishing SMS collected from 8 victims. Domain registration info requested for fake URLs. GhCERT notified for site takedown.",
      createdAt: new Date("2026-02-18"),
    },
    {
      caseId: caseByNumber["LELU-2026-004"].id, authorId: darko.id, dayNumber: 2,
      content: "Domain registrar identified as offshore provider. Takedown request submitted via GhCERT and ICANN. Two of three domains already offline. Subscriber number for originating SMS gateway traced to Vodafone prepaid. Warrant approved for subscriber records.",
      actions: "Two domains taken down. Vodafone subscriber warrant executed. Awaiting response from registrar for third domain.",
      createdAt: new Date("2026-02-26"),
    },
    {
      caseId: caseByNumber["LELU-2026-005"].id, authorId: boateng.id, dayNumber: 1,
      content: "Company 'GoldTech Investments Ltd' registered March 2025. Operating via WhatsApp groups and church networks. Offering 40% monthly returns. Victim pool estimated 300+ investors. Total exposure GHS 1.2M. Director identified as Kwame Frimpong, 39, Kumasi.",
      actions: "Company registry search completed. Director details obtained. Freezing order application prepared for 3 identified bank accounts.",
      createdAt: new Date("2026-02-22"),
    },
    {
      caseId: caseByNumber["LELU-2026-006"].id, authorId: darko.id, dayNumber: 1,
      content: "Insider threat investigation. MTN employee Emmanuel Tetteh (Staff ID: MT-4821) suspected of processing 17 unauthorised SIM swaps over 6-month period. Each SIM swap followed by MoMo fraud within 2 hours. Pattern analysis flagged by MTN Internal Audit.",
      actions: "Obtained MTN internal audit report. Identified 17 victim accounts. Suspect employment records and access logs requested.",
      createdAt: new Date("2026-01-08"),
    },
    {
      caseId: caseByNumber["LELU-2026-006"].id, authorId: darko.id, dayNumber: 2,
      content: "Warrant executed. Suspect Emmanuel Tetteh arrested at MTN Kaneshie branch. Digital forensics performed on work terminal — 17 SIM swap transactions confirmed unauthorised. Funds traced to 4 co-conspirator accounts. All 4 identified and arrested.",
      actions: "Arrest made 22 Feb 2026. Digital evidence secured. Docket transferred to EOCO for prosecution. Case closed.",
      createdAt: new Date("2026-02-22"),
    },
    {
      caseId: caseByNumber["LELU-2026-007"].id, authorId: asante.id, dayNumber: 1,
      content: "Complaints received from 9 victims told they won 'Ghana International Lottery'. Instructed to pay GHS 500–2000 'processing tax' to claim prize. Call centre traced to numbers with Togolese country code. Victims collectively paid GHS 14,500.",
      actions: "Victim statements compiled. Togolese NCB contacted via INTERPOL channel. Numbers: +22891234567, +22892345678 flagged.",
      createdAt: new Date("2026-03-04"),
    },
    {
      caseId: caseByNumber["LELU-2026-008"].id, authorId: supervisor.id, dayNumber: 1,
      content: "Platform 'CryptoGhana Pro' defrauded approximately 150 investors. Website showed fabricated profit dashboards. Victims charged 'withdrawal fees' of 10% then 15% then 20% before funds released — funds never released. Platform went offline 12 March 2026.",
      actions: "Domain registration info obtained. Hosting traced to server in Netherlands. MLAT request prepared for Dutch authorities. 150 victim statements being collected.",
      createdAt: new Date("2026-03-18"),
    },
  ];

  for (const e of entries) {
    await db.journalEntry.create({ data: e });
  }

  // ── CDR Requests ──────────────────────────────────────────────────────────
  const cdrs = [
    {
      phoneNumber: "+233244123456",
      telco: "MTN Ghana",
      periodStart: new Date("2026-01-01"),
      periodEnd: new Date("2026-01-31"),
      reason: "Primary suspect number identified in MoMo fraud relay network. Required for call pattern analysis and co-suspect identification.",
      status: "Received",
      requestedAt: new Date("2026-01-17"),
      receivedAt: new Date("2026-01-21"),
      caseId: caseByNumber["LELU-2026-001"].id,
      officerId: asante.id,
    },
    {
      phoneNumber: "+233276543210",
      telco: "MTN Ghana",
      periodStart: new Date("2026-01-01"),
      periodEnd: new Date("2026-01-31"),
      reason: "Secondary relay account used in Accra MoMo fraud network. Need call records to identify network structure.",
      status: "Received",
      requestedAt: new Date("2026-01-17"),
      receivedAt: new Date("2026-01-24"),
      caseId: caseByNumber["LELU-2026-001"].id,
      officerId: asante.id,
    },
    {
      phoneNumber: "+233554321098",
      telco: "AirtelTigo",
      periodStart: new Date("2025-12-01"),
      periodEnd: new Date("2026-01-31"),
      reason: "Third relay account. Cross-network transaction trail in LELU-2026-001. AirtelTigo account used for final cash-out.",
      status: "Pending",
      requestedAt: new Date("2026-01-18"),
      caseId: caseByNumber["LELU-2026-001"].id,
      officerId: asante.id,
    },
    {
      phoneNumber: "+233207654321",
      telco: "Vodafone Ghana",
      periodStart: new Date("2025-11-01"),
      periodEnd: new Date("2026-02-15"),
      reason: "Romance scam suspect. Number used across multiple victims. CDR required to identify base station locations and co-conspirators.",
      status: "Received",
      requestedAt: new Date("2026-02-06"),
      receivedAt: new Date("2026-02-12"),
      caseId: caseByNumber["LELU-2026-003"].id,
      officerId: asante.id,
    },
    {
      phoneNumber: "+233244987654",
      telco: "MTN Ghana",
      periodStart: new Date("2025-11-01"),
      periodEnd: new Date("2026-02-15"),
      reason: "Second romance scam suspect number identified across 6 of 14 victims. CDR to establish location pattern.",
      status: "Pending",
      requestedAt: new Date("2026-02-07"),
      caseId: caseByNumber["LELU-2026-003"].id,
      officerId: asante.id,
    },
    {
      phoneNumber: "+233508765432",
      telco: "Vodafone Ghana",
      periodStart: new Date("2026-01-15"),
      periodEnd: new Date("2026-02-28"),
      reason: "SMS gateway originating number in bank phishing campaign. Subscriber records and call data needed to identify operator.",
      status: "Received",
      requestedAt: new Date("2026-02-19"),
      receivedAt: new Date("2026-02-25"),
      caseId: caseByNumber["LELU-2026-004"].id,
      officerId: darko.id,
    },
    {
      phoneNumber: "+233244571234",
      telco: "MTN Ghana",
      periodStart: new Date("2026-01-10"),
      periodEnd: new Date("2026-01-20"),
      reason: "Original victim SIM swap number. CDR needed to reconstruct timeline of fraudulent SIM swap and initial outgoing calls.",
      status: "Received",
      requestedAt: new Date("2026-01-15"),
      receivedAt: new Date("2026-01-18"),
      caseId: caseByNumber["LELU-2026-001"].id,
      officerId: asante.id,
    },
    {
      phoneNumber: "+233302345678",
      telco: "MTN Ghana",
      periodStart: new Date("2026-02-01"),
      periodEnd: new Date("2026-03-20"),
      reason: "Number associated with GoldTech Investments director. Required to map investor recruitment calls and co-conspirator network.",
      status: "Pending",
      requestedAt: new Date("2026-02-23"),
      caseId: caseByNumber["LELU-2026-005"].id,
      officerId: boateng.id,
    },
    {
      phoneNumber: "+233244456789",
      telco: "AirtelTigo",
      periodStart: new Date("2026-02-15"),
      periodEnd: new Date("2026-03-31"),
      reason: "Lottery scam operator. Number contacted all 9 victims. CDR to establish call centre location and co-operator identities.",
      status: "Pending",
      requestedAt: new Date("2026-03-05"),
      caseId: caseByNumber["LELU-2026-007"].id,
      officerId: asante.id,
    },
    {
      phoneNumber: "+233271234567",
      telco: "MTN Ghana",
      periodStart: new Date("2025-10-01"),
      periodEnd: new Date("2026-02-28"),
      reason: "Fourth romance scam suspect number. Contacted victims across 3 regions. Extended CDR period requested to establish full contact history.",
      status: "Received",
      requestedAt: new Date("2026-02-10"),
      receivedAt: new Date("2026-02-17"),
      caseId: caseByNumber["LELU-2026-003"].id,
      officerId: asante.id,
    },
  ];

  for (const cdr of cdrs) {
    await db.cdrRequest.create({ data: cdr });
  }

  // ── International Requests ─────────────────────────────────────────────────
  const intlRequests = [
    {
      refNumber: "LELU-INTL-2026-001",
      direction: "Outgoing",
      country: "Nigeria",
      agency: "EFCC — Economic and Financial Crimes Commission",
      subject: "Mutual Legal Assistance — Advance Fee Fraud Network",
      details: "Requesting subscriber and financial records for 4 EFCC-known email addresses linked to suspects in LELU-2026-002. Suspects have prior EFCC complaints from 2024. Requesting cooperation on coordinated arrest.",
      status: "Responded",
      caseId: caseByNumber["LELU-2026-002"].id,
      officerId: boateng.id,
      createdAt: new Date("2026-02-04"),
      respondedAt: new Date("2026-02-19"),
    },
    {
      refNumber: "LELU-INTL-2026-002",
      direction: "Outgoing",
      country: "United Kingdom",
      agency: "NCA — National Crime Agency",
      subject: "Victim Coordination — West Africa Advance Fee Fraud",
      details: "22 UK-based victims identified in LELU-2026-002. Total UK victim losses GBP 34,000. Requesting victim statements and financial transaction records from UK banks. Sharing Ghana-end suspect profiles for NCA intelligence files.",
      status: "Pending",
      caseId: caseByNumber["LELU-2026-002"].id,
      officerId: boateng.id,
      createdAt: new Date("2026-02-05"),
    },
    {
      refNumber: "LELU-INTL-2026-003",
      direction: "Outgoing",
      country: "Togo",
      agency: "OCERTIF — Office Central de Répression du Trafic Illicite de Drogues et des Crimes Financiers",
      subject: "Lottery Fraud Call Centre Location — Cross-Border Operation",
      details: "Numbers +22891234567 and +22892345678 traced to Lomé, Togo. Requesting subscriber identity records and assistance locating operational call centre. Requesting OCERTIF coordinate arrest.",
      status: "Pending",
      caseId: caseByNumber["LELU-2026-007"].id,
      officerId: asante.id,
      createdAt: new Date("2026-03-06"),
    },
    {
      refNumber: "LELU-INTL-2026-004",
      direction: "Outgoing",
      country: "Netherlands",
      agency: "FIOD — Fiscale Inlichtingen en Opsporingsdienst",
      subject: "Crypto Fraud Platform Hosting — Server Evidence Request",
      details: "CryptoGhana Pro platform hosted on Dutch server IP 185.220.101.47. Platform defrauded approximately 150 Ghanaian investors. Requesting preservation and disclosure of server data, user logs, and financial transaction records under MLAT.",
      status: "Pending",
      caseId: caseByNumber["LELU-2026-008"].id,
      officerId: supervisor.id,
      createdAt: new Date("2026-03-20"),
    },
    {
      refNumber: "LELU-INTL-2026-005",
      direction: "Incoming",
      country: "United States",
      agency: "FBI — Internet Crime Complaint Center (IC3)",
      subject: "Romance Scam Intelligence Share — Ghana-Based Operators",
      details: "IC3 sharing intelligence on Ghana-linked romance scam network targeting US victims. 34 US victims identified. Suspect phone numbers +233207654321 and +233559876543 match active LELU-2026-003 investigation. Requesting Ghana arrest and evidence.",
      status: "Responded",
      caseId: caseByNumber["LELU-2026-003"].id,
      officerId: asante.id,
      createdAt: new Date("2026-02-15"),
      respondedAt: new Date("2026-02-28"),
    },
    {
      refNumber: "LELU-INTL-2026-006",
      direction: "Outgoing",
      country: "Ivory Coast",
      agency: "PLCC — Plateforme de Lutte Contre la Cybercriminalité",
      subject: "Cross-Border Advance Fee Fraud — Suspect Presence",
      details: "Two advance fee fraud suspects believed to have crossed into Ivory Coast following intelligence alert. Requesting immigration records check for 3 identified suspects. Suspect profiles and photographs attached.",
      status: "Pending",
      caseId: caseByNumber["LELU-2026-002"].id,
      officerId: boateng.id,
      createdAt: new Date("2026-03-01"),
    },
    {
      refNumber: "LELU-INTL-2026-007",
      direction: "Incoming",
      country: "Canada",
      agency: "RCMP — Royal Canadian Mounted Police",
      subject: "Investment Fraud — Canadian Victim Referral",
      details: "RCMP referring 6 Canadian victims of GoldTech Investments Ltd (LELU-2026-005). Total Canadian losses CAD 28,500. RCMP requesting case status update and whether prosecution likely to recover funds.",
      status: "Pending",
      caseId: caseByNumber["LELU-2026-005"].id,
      officerId: boateng.id,
      createdAt: new Date("2026-03-12"),
    },
    {
      refNumber: "LELU-INTL-2026-008",
      direction: "Outgoing",
      country: "Interpol",
      agency: "INTERPOL — General Secretariat, Financial Crimes Unit",
      subject: "Red Notice Request — MoMo Fraud Network Leader",
      details: "Primary suspect in LELU-2026-001 believed to have fled Ghana. Requesting Red Notice publication for suspect Kofi Mensah-Abban, DOB 15/03/1989, passport GH-A234567. Last known location: Lagos, Nigeria.",
      status: "Pending",
      caseId: caseByNumber["LELU-2026-001"].id,
      officerId: asante.id,
      createdAt: new Date("2026-03-25"),
    },
  ];

  for (const req of intlRequests) {
    await db.internationalRequest.create({ data: req });
  }

  // ── Activity log entries ──────────────────────────────────────────────────
  for (const c of createdCases) {
    await db.caseActivity.create({
      data: {
        caseId: c.id,
        userName: "System",
        action: "Case opened",
        detail: `${c.caseNumber} — ${c.title}`,
        createdAt: c.createdAt,
      },
    });
  }

  // Print summary
  const counts = {
    cases: await db.case.count(),
    cdrs: await db.cdrRequest.count(),
    intl: await db.internationalRequest.count(),
    entries: await db.journalEntry.count(),
    users: await db.user.count(),
  };
  console.log("✅ Demo seed complete:", counts);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
