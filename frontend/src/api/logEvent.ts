export async function logEvent(session: string, step: string, data: any) {
  await fetch('/log_step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session, step, data })
  });
}
