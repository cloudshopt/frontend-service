import { defineStore } from "pinia";
import { apiDel, apiGet, apiPatch, apiPost } from "@/lib/api";

export type CartItem = {
    id: number;
    product_id: number;
    name_snapshot: string;
    unit_price_snapshot: number;
    qty: number;
};

export type CartResponse = {
    data: {
        id: number;
        items: CartItem[];
        total_price: number;
    };
};

export const useCartStore = defineStore("cart", {
    state: () => ({
        items: [] as CartItem[],
        total_price: 0,
        loading: false,
    }),
    getters: {
        count: (s) => s.items.reduce((a, i) => a + i.qty, 0),
    },
    actions: {
        async fetchCart() {
            this.loading = true;
            try {
                const r = await apiGet<CartResponse>("/orders/cart", true);
                this.items = r.data.items ?? [];
                this.total_price = r.data.total_price ?? 0;
            } finally {
                this.loading = false;
            }
        },

        async addItem(product_id: number, qty = 1) {
            await apiPost("/orders/cart/items", { product_id, qty }, true);
            await this.fetchCart();
        },

        async updateItem(itemId: number, qty: number) {
            await apiPatch(`/orders/cart/items/${itemId}`, { qty }, true);
            await this.fetchCart();
        },

        async removeItem(itemId: number) {
            await apiDel(`/orders/cart/items/${itemId}`, true);
            await this.fetchCart();
        },

        async createOrderFromCart() {
            const r = await apiPost<{ data: any }>("/orders/items", undefined, true);
            await this.fetchCart();
            return r.data;
        },
    },
});