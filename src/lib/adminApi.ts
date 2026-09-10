// Client for the authenticated admin routes. The password is exchanged once for
// a signed token; only that token is stored, and only for the life of the tab.

const TOKEN_KEY = "sdc-admin-token";

/** The session token is missing or no longer accepted; the page must log in again. */
export class AuthExpiredError extends Error {}

/** The server rejected the request with a message worth showing the user. */
export class ApiError extends Error {}

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null; // private browsing, or site data blocked
  }
}

function setToken(token: string) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage is unavailable, so the session lasts until the page reloads.
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
}

async function errorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json();
    return typeof body?.error === "string" ? body.error : fallback;
  } catch {
    return fallback;
  }
}

export async function login(password: string): Promise<void> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) throw new ApiError(await errorMessage(res, "Could not sign in"));

  const { token } = await res.json();
  if (typeof token !== "string") throw new ApiError("The server returned an unexpected response");
  setToken(token);
}

/**
 * Calls an API route with the session token attached. Reads bypass the CDN so
 * the admin list always shows what is actually in the database.
 */
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  if (!token) throw new AuthExpiredError("Signed out");

  const res = await fetch(path, {
    ...init,
    cache: "no-store",
    headers: {
      ...init.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    clearToken();
    throw new AuthExpiredError("Your session expired. Please sign in again.");
  }

  if (!res.ok) throw new ApiError(await errorMessage(res, `Request failed (${res.status})`));

  return (await res.json()) as T;
}

export type Row = Record<string, unknown>;

export const listRows = (resource: string) => adminFetch<Row[]>(`/api/${resource}`);

export const createRow = (resource: string, values: Row) =>
  adminFetch(`/api/${resource}`, { method: "POST", body: JSON.stringify(values) });

export const updateRow = (resource: string, id: number, values: Row) =>
  adminFetch(`/api/${resource}?id=${id}`, { method: "PATCH", body: JSON.stringify(values) });

export const deleteRow = (resource: string, id: number) =>
  adminFetch(`/api/${resource}?id=${id}`, { method: "DELETE" });
