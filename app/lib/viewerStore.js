// Singleton in-memory store for active case viewers.
// Kept in app/lib (not a route file) so both route handlers share the same
// module instance and therefore the same activeViewers object.

const activeViewers = {}; // { [caseId]: [{ userId, userName, timestamp }] }
const VIEWER_TTL_MS = 5 * 60 * 1000; // 5 minutes

function purgeStale() {
  const now = Date.now();
  for (const cid of Object.keys(activeViewers)) {
    activeViewers[cid] = activeViewers[cid].filter(v => now - v.timestamp < VIEWER_TTL_MS);
    if (activeViewers[cid].length === 0) delete activeViewers[cid];
  }
}

export function upsertViewer(caseId, userId, userName) {
  purgeStale();
  if (!activeViewers[caseId]) activeViewers[caseId] = [];
  const idx = activeViewers[caseId].findIndex(v => v.userId === userId);
  const now = Date.now();
  if (idx >= 0) {
    activeViewers[caseId][idx].timestamp = now;
  } else {
    activeViewers[caseId].push({ userId, userName, timestamp: now });
  }
}

export function removeViewer(caseId, userId) {
  if (!activeViewers[caseId]) return;
  activeViewers[caseId] = activeViewers[caseId].filter(v => v.userId !== userId);
  if (activeViewers[caseId].length === 0) delete activeViewers[caseId];
}

export function getViewers(caseId) {
  purgeStale();
  return activeViewers[caseId] ? [...activeViewers[caseId]] : [];
}
