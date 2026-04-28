# LELU Platform — User Guide

This guide covers everything a day-to-day user needs to operate the LELU platform. If you are a Head of Unit managing staff, see also the [Admin Guide](./ADMIN_GUIDE.md).

---

## Table of Contents

1. [Logging In](#1-logging-in)
2. [Registering and Waiting for Approval](#2-registering-and-waiting-for-approval)
3. [The Dashboard](#3-the-dashboard)
4. [Case Management](#4-case-management)
   - [Opening a New Case](#41-opening-a-new-case)
   - [Adding Journal Entries](#42-adding-journal-entries)
   - [Inviting a Colleague](#43-inviting-a-colleague)
   - [Accepting or Declining an Invitation](#44-accepting-or-declining-an-invitation)
   - [Closing a Case](#45-closing-a-case)
   - [Declining a Case](#46-declining-a-case)
5. [CDR Requests](#5-cdr-requests)
   - [Logging a CDR Request](#51-logging-a-cdr-request)
   - [Uploading a CDR Response](#52-uploading-a-cdr-response)
6. [Intel DB](#6-intel-db)
   - [Searching the Intel DB](#61-searching-the-intel-db)
   - [Understanding the Feed](#62-understanding-the-feed)
7. [24/7 Network](#7-247-network)
   - [Logging a Network Request](#71-logging-a-network-request)
8. [Reports](#8-reports)
   - [Submitting a Weekly Activity Report](#81-submitting-a-weekly-activity-report)
   - [Generating a Team or Case Report](#82-generating-a-team-or-case-report)
9. [Notifications](#9-notifications)
10. [User Management (Head of Unit Only)](#10-user-management-head-of-unit-only)
11. [Account Settings](#11-account-settings)

---

## 1. Logging In

1. Open your browser and go to the LELU platform URL provided by your IT administrator (e.g., `http://192.168.1.10:3000` or `https://lelu.yourunit.gov.gh`).
2. On the **Login** page, enter your registered **email address** and **password**.
3. Click **Sign In**.

If your account has not yet been approved by the Head of Unit, you will see a message stating your account is pending approval. Contact your supervisor if you believe this is an error.

**Forgot your password?** Contact your Head of Unit or Office Administrator. They can issue a password reset on your behalf from the User Management panel.

---

## 2. Registering and Waiting for Approval

New users must register and wait for an administrator to approve their account before they can log in.

1. Go to the LELU platform URL in your browser.
2. On the Login page, click **Register** (or navigate to `/register`).
3. Fill in the registration form:
   - **Full Name** — your name as it should appear on records.
   - **Email Address** — use your official unit email address.
   - **Password** — choose a strong password (at least 8 characters, mixing letters, numbers, and symbols).
4. Click **Register**.

You will see a confirmation message. Your account is now created with a **Pending Approval** status — you cannot log in until an administrator approves you.

**What happens next:**
- Your Head of Unit, Supervisor, or Office Administrator will receive a notification about your pending registration.
- Once approved, you may log in immediately with the credentials you registered with.
- If your registration is rejected, contact your supervisor to resolve any issues and re-register if necessary.

---

## 3. The Dashboard

After logging in you are taken to the **Dashboard**, which provides an at-a-glance overview of your activity.

| Section | Description |
|---|---|
| **My Cases** | Count of your active, closed, and declined cases |
| **CDR Requests** | Pending and received CDR requests you have submitted |
| **Network Requests** | Pending and responded 24/7 Network requests |
| **Stale Cases** | Cases with no journal entry in the last 7 days (Head of Unit view) |

The **sidebar** on the left gives you access to all modules: Cases, CDR, Intel DB, 24/7 Network, Reports, and Admin (if you have the right role).

The **notification bell** in the top bar shows unread alerts. Click it to expand the notification panel.

---

## 4. Case Management

Cases are the core record of an investigation. Each case has a unique reference number in the format `LELU-YYYY-###` (e.g., `LELU-2026-042`).

### 4.1 Opening a New Case

1. Click **Cases** in the left sidebar.
2. Click the **New Case** button (top right).
3. Complete the case form:
   - **Title** — a brief, descriptive title for the case.
   - **Category** — select the most appropriate category (e.g., Electronic Fraud, Cyberstalking, Child Exploitation).
   - **Description** — provide the full background and details of the case.
4. Click **Create Case**.

The system automatically:
- Assigns a unique case number (`LELU-YYYY-###`).
- Sets the status to **Active**.
- Assigns you as the lead officer.
- Logs an activity entry: *"Case opened by [Your Name]"*.

### 4.2 Adding Journal Entries

Journal entries are the day-by-day log of actions, findings, and observations on a case. They are numbered sequentially (Day 1, Day 2, Day 3…).

1. Open the case by clicking on it from the Cases list.
2. Scroll to the **Journal Entries** section.
3. Click **Add Entry**.
4. Fill in:
   - **Content** — your findings, observations, or notes for this entry.
   - **Actions Taken** — follow-up actions you have performed or plan to perform.
5. Click **Save Entry**.

> **Note:** The system will automatically extract phone numbers and email addresses from your journal entries and use them to surface related cases (Case Correlation). Keep your entries as detailed as possible.

You can edit or delete your own entries at any time. Entries are time-stamped and attributed to your name.

### 4.3 Inviting a Colleague

You can invite other officers to collaborate on a case you own.

1. Open the case.
2. Click **Invite Officer** (or the assignment icon in the case header).
3. Select the colleague you want to invite from the dropdown list.
4. Click **Send Invitation**.

The colleague will receive a notification. They can accept or decline. Once they accept, they gain full read and write access to the case.

> **Note:** A Head of Unit or Admin can invite officers to any case, not only their own.

### 4.4 Accepting or Declining an Invitation

When another officer invites you to their case, you will receive a notification.

1. Click the **notification bell** in the top bar.
2. Find the case invitation notification.
3. Click **Accept** to join the case, or **Decline** to refuse.

If you accept, the case will appear in your Cases list and you can contribute journal entries, CDR requests, and more.

### 4.5 Closing a Case

When an investigation concludes, mark the case as **Closed**.

1. Open the case.
2. Click **Close Case** (usually found in the case actions menu or a dedicated button).
3. Enter a **Closure Reason** — a brief explanation of the outcome.
4. Confirm by clicking **Close**.

The case status changes to **Closed** and the closure date and reason are recorded permanently.

### 4.6 Declining a Case

If a case is found to be outside your unit's remit, duplicate, or otherwise invalid, it can be declined.

1. Open the case.
2. Click **Decline Case** from the case actions menu.
3. Enter a reason for declining.
4. Confirm by clicking **Decline**.

The case status changes to **Declined**. A declined case is retained in the system for audit purposes but is excluded from active workload metrics.

---

## 5. CDR Requests

Call Detail Record (CDR) requests are formal requests submitted to telecommunications providers for subscriber data. Each request is tied to a case and logged for accountability.

### 5.1 Logging a CDR Request

1. Click **CDR** in the left sidebar.
2. Click **New CDR Request**.
3. Complete the form:
   - **Phone Number** — the subscriber number being investigated.
   - **Identifier Type** — defaults to "Phone Number"; change if submitting another identifier.
   - **Telco** — the telecommunications provider (e.g., MTN, Vodafone, AirtelTigo).
   - **Period Start / Period End** — the date range for the CDR data being requested.
   - **Reason** — the legal/operational justification for the request.
   - **Case** (optional) — link this request to an existing case.
4. Click **Submit Request**.

The request is created with a **Pending** status. It will appear in your CDR list. Your Head of Unit receives an alert if the request remains pending for more than 14 days.

### 5.2 Uploading a CDR Response

When the telco responds and you receive the data, update the request record:

1. Click **CDR** in the sidebar and find the relevant request.
2. Click **Update** or open the request detail.
3. Set the **Status** to *Received*.
4. Enter the **Received Date**.
5. Upload the attachment (the CDR data file) and give it a descriptive name.
6. Save the update.

The record is now marked as received with the attachment stored for case use.

---

## 6. Intel DB

The Intel DB (Intelligence Database) is a searchable repository of case intelligence across the unit. It provides a searchable, categorised view of all cases and patterns.

### 6.1 Searching the Intel DB

1. Click **Intel DB** in the left sidebar.
2. Use the search and filter bar at the top of the page:
   - **Search** — enter keywords, names, or identifiers.
   - **Category** — filter by case category (Electronic Fraud, Cyberstalking, Child Exploitation, etc.).
   - **Officer** — filter by the assigned officer (Head of Unit and above only).
   - **Status** — filter by Active, Closed, or Declined.
3. Results update as you apply filters.

Click any case in the results to open its full case record.

### 6.2 Understanding the Feed

The Intel DB dashboard shows the following summary statistics:

| Metric | Meaning |
|---|---|
| **Total Cases** | All cases in the system regardless of status |
| **Active Cases** | Cases with a status of Active |
| **Stale Cases** | Active cases that are 30+ days old and have had no journal entry in the last 7 days |
| **Category Breakdown** | A visual breakdown of case categories showing where the unit's workload is concentrated |

Stale cases are highlighted as a prompt to either update the case or close it if the investigation has concluded.

---

## 7. 24/7 Network

The 24/7 Network module is used to log formal requests to and from foreign law enforcement agencies via the international network. Each request receives a unique reference number in the format `LELU-INTL-YYYY-###`.

### 7.1 Logging a Network Request

1. Click **24/7 Network** in the left sidebar.
2. Click **New Request**.
3. Complete the form:
   - **Direction** — *Outgoing* (you are sending the request) or *Incoming* (you received a request from abroad).
   - **Country** — the country of the foreign agency.
   - **Agency** — the name of the foreign law enforcement agency.
   - **Subject** — a brief subject line for the request.
   - **Details** — full details and background of the request.
   - **Priority** — Low, Medium, or High.
   - **Case** (optional) — link this request to an existing case.
4. Click **Submit**.

The request is logged with a **Pending** status and a unique reference number. Your Head of Unit is alerted if it remains pending for more than 14 days.

To update a request when a response is received, open the request and update the status to *Responded*, enter the response date, and attach any relevant documentation.

---

## 8. Reports

### 8.1 Submitting a Weekly Activity Report

Officers submit a weekly activity report summarising their work for the week.

1. Click **Reports** in the left sidebar.
2. Click **New Activity Report**.
3. Complete the report form:
   - **Week Start / Week End** — the dates covering the reporting period.
   - **Summary** — a narrative overview of your activities for the week.
   - **Cases Worked** — list the cases you worked on and key actions taken.
   - **Challenges** — any obstacles or blockers encountered during the week.
   - **Next Steps** — planned actions for the coming week.
4. Click **Submit Report**.

Submitted reports are accessible to the Head of Unit and Supervisors for review.

### 8.2 Generating a Team or Case Report

Supervisors, Office Administrators, and the Head of Unit can generate summary reports.

1. Click **Reports** in the sidebar.
2. Select the report type:
   - **Team Report** — shows metrics for all officers over a selected date range (cases created, CDR requests, international requests, journal entries, by officer and role).
   - **Case Report** — a drill-down into a single case including all entries, CDR requests, and international requests linked to it.
3. Set the filters (date range, officer, case).
4. Click **Generate Report**.

Reports are displayed on-screen and can be printed or saved from your browser.

---

## 9. Notifications

The notification bell in the top right of the dashboard header shows a count of your unread alerts. Click it to open the notification panel.

### Notification Types

| Type | Who Receives It | Description |
|---|---|---|
| **Case Invitation** | Any officer | Another officer has invited you to collaborate on a case |
| **Pending Approval** | Head of Unit, Supervisors, Office Administrators | A new user has registered and is awaiting approval |
| **Stale Case Alert** | Head of Unit | An active case has not been updated in 7+ days and is 30+ days old |
| **Overdue CDR Alert** | Head of Unit | A CDR request has been pending for more than 14 days |
| **Overdue Network Alert** | Head of Unit | An international request has been pending for more than 14 days |

### Managing Notifications

- Click a notification to navigate directly to the relevant record.
- For case invitations, the notification includes **Accept** and **Decline** buttons — you do not need to navigate to the case.
- Click **Mark All as Read** to clear the notification count.
- Notifications refresh automatically every 30 seconds.

---

## 10. User Management (Head of Unit Only)

The **Admin** panel is accessible only to users with the Head of Unit or Admin role. See the [Admin Guide](./ADMIN_GUIDE.md) for full details.

In brief, from the Admin panel you can:
- Approve or reject pending user registrations.
- Deactivate or reactivate user accounts.
- Reset a user's password.
- Grant or revoke CDR data access for individual officers.

---

## 11. Account Settings

You can change your own password from the account settings dropdown in the top navigation bar.

1. Click your name or the settings icon in the top right corner.
2. Select **Change Password**.
3. Enter your current password, then enter and confirm your new password.
4. Click **Save**.

Your new password takes effect immediately on the next login. If you forget your current password, contact your Head of Unit to have it reset.
