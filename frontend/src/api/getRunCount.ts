export async function getRunCount(): Promise<number> {
  const apiBase = import.meta.env.VITE_API_URL;
  const resp = await fetch(`${apiBase}/api/calc_count`);
  if (!resp.ok) {
    return 0;
  }
  const data = await resp.json();
  return typeof data.count === 'number' ? data.count : 0;
}
