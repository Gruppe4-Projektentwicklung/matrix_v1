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
}

export function hasSessionStarted(): boolean {
  return sessionStorage.getItem("sessionStarted") === "true";
}

export function clearSession() {
  sessionStorage.removeItem("sessionStarted");
  resetSessionId();
}
