# LELU Platform — Admin Guide (Head of Unit)

This guide is for users with the **Head of Unit** or **Admin** role. It covers user management, team oversight, and administrative workflows.

For general day-to-day usage (cases, CDR, reports), see the [User Guide](./USER_GUIDE.md).

---

## Table of Contents

1. [Accessing the Admin Panel](#1-accessing-the-admin-panel)
2. [Approving and Rejecting Registrations](#2-approving-and-rejecting-registrations)
3. [Managing Users](#3-managing-users)
   - [Viewing the User List](#31-viewing-the-user-list)
   - [Granting or Revoking CDR Access](#32-granting-or-revoking-cdr-access)
   - [Deactivating a User](#33-deactivating-a-user)
   - [Reactivating a User](#34-reactivating-a-user)
   - [Resetting a User's Password](#35-resetting-a-users-password)
   - [Deleting a User](#36-deleting-a-user)
4. [Generating Team Reports](#4-generating-team-reports)
5. [Team Overview and Activity Heatmap](#5-team-overview-and-activity-heatmap)
6. [Case Assignment and Monitoring](#6-case-assignment-and-monitoring)
7. [Understanding Alerts and Notifications](#7-understanding-alerts-and-notifications)

---

## 1. Accessing the Admin Panel

The Admin panel is only visible to users with the **Head of Unit** or **Admin** role.

1. Log in and go to the **Dashboard**.
2. In the left sidebar, click **Admin** (or **User Management**).
3. The Admin panel shows three tabs: **Pending Approvals**, **Active Users**, and **Deactivated Users**.

If you do not see the Admin panel link, your account does not have the required role. Contact your system administrator.

---

## 2. Approving and Rejecting Registrations

When a new officer registers on the platform, they cannot log in until an administrator approves their account. You will receive a notification (bell icon, top right) for every pending registration.

### To approve a registration

1. Open the Admin panel and click the **Pending Approvals** tab.
2. Review the applicant's name and email address.
3. Click **Approve**.

The user is immediately able to log in. They will not receive an automated email — notify them directly.

### To reject a registration

1. On the **Pending Approvals** tab, find the applicant.
2. Click **Reject**.
3. The account is removed from the pending list. The user will see an error when they attempt to log in.

> **Tip:** Reject duplicate or invalid registrations promptly to keep the pending list clean. Contact the user directly to explain why their registration was rejected and, if appropriate, ask them to re-register with corrected information.

---

## 3. Managing Users

### 3.1 Viewing the User List

The **Active Users** tab shows all approved and active officers, along with:
- Their role (Head of Unit, Supervisor, Office Administrator, Officer).
- Last active date.
- CDR access status.
- Weekly activity summary (cases created, entries logged, CDR requests submitted).

The **Deactivated Users** tab shows accounts that have been disabled.

### 3.2 Granting or Revoking CDR Access

CDR (Call Detail Record) access is a sensitive permission that controls whether an officer can view CDR request data. By default, CDR access is **off** for new officers.

**To toggle CDR access:**

1. In the **Active Users** tab, find the officer.
2. Click the **CDR Access** toggle (or the corresponding action button).
3. Confirm the change.

The change takes effect immediately. Officers without CDR access cannot view or submit CDR requests.

### 3.3 Deactivating a User

Deactivating an account prevents the user from logging in but preserves all their case data and audit history.

1. In the **Active Users** tab, find the officer.
2. Click **Deactivate**.
3. Confirm the action.

The user is moved to the **Deactivated Users** tab. All their cases, entries, and records remain intact. Use this option when an officer leaves the unit or is temporarily suspended.

### 3.4 Reactivating a User

1. Click the **Deactivated Users** tab.
2. Find the officer.
3. Click **Reactivate**.

The account is restored and the user can log in again with their existing password.

### 3.5 Resetting a User's Password

Use this when an officer cannot access their account because they have forgotten their password.

1. In the **Active Users** tab, find the officer.
2. Click **Reset Password**.
3. A new temporary password will be generated and displayed on-screen.
4. Communicate the temporary password to the officer securely (in person or via an encrypted channel).
5. Instruct the officer to change it immediately after logging in via **Account Settings → Change Password**.

> **Security note:** Never send temporary passwords via unencrypted email or SMS. Use a secure, direct channel. See the [Security Guide](./SECURITY.md) for more detail.

### 3.6 Deleting a User

Deletion permanently removes the user account. This action is irreversible.

> **Warning:** Deleting a user will remove their account record. In most cases, **Deactivation** is the preferred option as it preserves the audit trail.

1. In the **Active Users** or **Deactivated Users** tab, find the officer.
2. Click **Delete**.
3. Confirm the permanent deletion when prompted.

Only delete accounts that were created in error or are confirmed duplicates. Retain deactivated accounts for departed officers for audit purposes.

---

## 4. Generating Team Reports

The **Reports** module allows you to generate aggregate metrics across the entire team.

### Team Report

1. Click **Reports** in the left sidebar.
2. Select **Team Report**.
3. Set the **Date Range** (e.g., the current month or quarter).
4. Optionally filter by a specific officer.
5. Click **Generate Report**.

The report displays, for each officer:
- Number of cases created.
- Number of CDR requests submitted.
- Number of international (24/7 Network) requests submitted.
- Number of journal entries logged.

This gives you a clear picture of workload distribution. Use it for performance reviews, resource allocation, and identifying officers who may need support.

### Case Report

1. In the **Reports** section, select **Case Report**.
2. Choose a specific case from the dropdown or enter the case number.
3. Click **Generate**.

The report shows the full timeline of the case: all journal entries, linked CDR requests, international requests, and activity log.

---

## 5. Team Overview and Activity Heatmap

The **Dashboard** home page provides a real-time overview of the team's activity.

### Key Metrics

| Metric | Description |
|---|---|
| **Total Active Cases** | All cases currently marked Active across the unit |
| **Stale Cases** | Active cases 30+ days old with no journal entry in the last 7 days |
| **Pending CDR Requests** | CDR requests still awaiting a response from the telco |
| **Pending Network Requests** | International requests awaiting a response |

### Stale Cases

A case is flagged as **stale** when:
- It has been open for more than **30 days**, AND
- No journal entry has been added in the last **7 days**.

Stale cases appear in your notification panel as alerts. Click the notification to go directly to the case, then contact the responsible officer to either update the case or close it.

### Officer Activity Summary

In the **Admin panel → Active Users**, each officer row shows their activity for the current week:
- Cases created.
- Entries logged.
- Last active timestamp.

Use this to spot officers who have not been active recently and follow up if needed.

---

## 6. Case Assignment and Monitoring

### Assigning Officers to Cases

As Head of Unit, you can invite any officer to any case — not just your own.

1. Open the case from the **Cases** list or **Intel DB**.
2. Click **Invite Officer**.
3. Select the officer from the dropdown.
4. Click **Send Invitation**.

The officer receives a notification and must accept to gain access.

### Removing Officers from Cases

You can remove an officer from a case they have been assigned to.

1. Open the case.
2. In the **Assigned Officers** section, find the officer.
3. Click **Remove**.

The officer loses access to the case immediately. Their previously logged entries remain.

### Monitoring Case Progress

- From the **Cases** list, you can see all cases across all officers (not just your own), because the Head of Unit role has full visibility.
- Use the **Intel DB** for a category-level overview.
- Use the **Stale Cases** notification to proactively monitor inactive investigations.
- The case detail page includes an **Activity Log** showing every action taken on the case (who opened it, who added entries, who was invited, when it was closed, etc.).

### Live Case Viewers

The case detail page shows a small indicator of who else is currently viewing the case in real time. This helps avoid duplicate work when multiple officers are active on the same case simultaneously.

---

## 7. Understanding Alerts and Notifications

As Head of Unit, you receive a broader set of alerts than regular officers.

| Alert | Trigger | Recommended Action |
|---|---|---|
| **New Pending Registration** | A user registers on the platform | Review and approve or reject within 24 hours |
| **Stale Case** | Active case with no entry for 7+ days, open 30+ days | Follow up with the assigned officer |
| **Overdue CDR Request** | CDR request pending for more than 14 days | Contact the telco or review with the responsible officer |
| **Overdue Network Request** | International request pending for more than 14 days | Follow up with the foreign agency or responsible officer |
| **Case Invitation** | Another officer invites you to a case | Accept or decline as appropriate |

Notifications are refreshed every 30 seconds. Click **Mark All as Read** to clear the count once you have reviewed them.
