// src/stores/auth.ts
import { defineStore } from "pinia";
import { apiGet, apiPost, getToken, setToken } from "@/lib/api";

type User = { id: number; name: string; email: string };

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: getToken() as string | null,
        user: null as User | null,
        loading: false,
    }),
    getters: {
        isAuthed: (s) => !!s.token,
    },
    actions: {
        async fetchMe() {
            if (!this.token) return;
            try {
                const r = await apiGet<{ user: User }>("/users/me", true);
                this.user = r.user;
            } catch {
                // token invalid -> logout
                this.logout();
            }
        },

        async register(payload: {
            name: string;
            email: string;
            password: string;
            password_confirmation: string;
        }) {
            this.loading = true;
            try {
                const r = await apiPost<{
                    token: string;
                    user: User;
                    expires_in: number;
                }>("/users/auth/register", payload, false);

                this.token = r.token;
                setToken(r.token);
                this.user = r.user;
            } finally {
                this.loading = false;
            }
        },

        async login(payload: { email: string; password: string }) {
            this.loading = true;
            try {
                const r = await apiPost<{
                    token: string;
                    user: User;
                    expires_in: number;
                }>("/users/auth/login", payload, false);

                this.token = r.token;
                setToken(r.token);
                this.user = r.user;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            setToken(null);
        },
    },
});