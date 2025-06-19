// src/utils/session.ts
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

export function resetSessionId(): string {
  const newId = crypto.randomUUID();
  sessionStorage.setItem("sessionId", newId);
  return newId;
}
export function markSessionStarted() {
  sessionStorage.setItem("sessionStarted", "true");
  resetPageStatus();
}

export function hasSessionStarted(): boolean {
  return sessionStorage.getItem("sessionStarted") === "true";
}

export function clearSession() {
  sessionStorage.removeItem("sessionStarted");
  resetSessionId();
}

export function resetPageStatus() {
  const initial = {
    "select-data": "nok",
    idea: "nok",
    combination: "nok",
    personal: "nok",
    summary: "nok",
  };
  sessionStorage.setItem("pageStatus", JSON.stringify(initial));
  window.dispatchEvent(new Event("pageStatusUpdated"));
}

export function setPageStatus(page: string, status: "ok" | "nok") {
  const raw = sessionStorage.getItem("pageStatus");
  const obj = raw ? JSON.parse(raw) : {};
  obj[page] = status;
  sessionStorage.setItem("pageStatus", JSON.stringify(obj));
  window.dispatchEvent(new Event("pageStatusUpdated"));
}

export function getPageStatus(): Record<string, string> {
  const raw = sessionStorage.getItem("pageStatus");
  return raw ? JSON.parse(raw) : {};
}

// ---- Backend Save Status Handling ----
export type SaveRunStatus = 'idle' | 'sending' | 'ok' | 'error';

export function setSaveRunStatus(status: SaveRunStatus) {
  sessionStorage.setItem('saveRunStatus', status);
  window.dispatchEvent(new Event('saveRunStatusUpdated'));
}

export function getSaveRunStatus(): SaveRunStatus {
  return (sessionStorage.getItem('saveRunStatus') as SaveRunStatus) || 'idle';
}

