// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";
const TOKEN_KEY = "cloudshopt_token";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
}

type ApiError = {
    message?: string;
    errors?: Record<string, string[]>;
};

export async function api<T>(
    path: string,
    opts: { method?: string; body?: any; auth?: boolean } = {}
): Promise<T> {
    const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

    const headers: Record<string, string> = {
        Accept: "application/json",
    };

    if (opts.body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (opts.auth !== false) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
        method: opts.method ?? "GET",
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });

    const text = await res.text();
    const data = text ? (JSON.parse(text) as any) : null;

    if (!res.ok) {
        const err: ApiError = data ?? { message: "Request failed" };
        const msg = err.message ?? `HTTP ${res.status}`;
        throw Object.assign(new Error(msg), { status: res.status, details: err });
    }

    return data as T;
}

// Helpers
export const apiGet = <T>(p: string, auth = true) => api<T>(p, { auth });
export const apiPost = <T>(p: string, body?: any, auth = true) =>
    api<T>(p, { method: "POST", body, auth });
export const apiPatch = <T>(p: string, body?: any, auth = true) =>
    api<T>(p, { method: "PATCH", body, auth });
export const apiDel = <T>(p: string, auth = true) =>
    api<T>(p, { method: "DELETE", auth });