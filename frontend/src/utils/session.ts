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
