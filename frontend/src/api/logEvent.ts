export async function logEvent(session: string, step: string, data: any) {
  const apiBase = import.meta.env.VITE_API_URL;
  await fetch(`${apiBase}/log_step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session, step, data })
  });
}
