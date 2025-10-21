const BASE_URL = import.meta.env.VITE_API_URL as string;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "API Error");
  }
  return data;
}
