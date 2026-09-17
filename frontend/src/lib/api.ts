export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000').replace(/\/+$/, '');

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = typeof data?.error === 'string' ? data.error : 'Request failed';
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
