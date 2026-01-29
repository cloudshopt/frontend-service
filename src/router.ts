// src/router.ts
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import ProductsView from "@/views/ProductsView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import CartView from "@/views/CartView.vue";
import OrdersView from "@/views/OrdersView.vue";
import OrderDetailView from "@/views/OrderDetailView.vue";
import CheckoutSuccessView from "@/views/CheckoutSuccessView.vue";
import CheckoutCancelView from "@/views/CheckoutCancelView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", redirect: "/products" },

        { path: "/login", component: LoginView },
        { path: "/register", component: RegisterView },

        { path: "/products", component: ProductsView },
        { path: "/products/:id", component: ProductDetailView },

        { path: "/cart", component: CartView, meta: { auth: true } },
        { path: "/orders", component: OrdersView, meta: { auth: true } },
        { path: "/orders/:id", component: OrderDetailView, meta: { auth: true } },

        { path: "/checkout/success", component: CheckoutSuccessView, meta: { auth: true } },
        { path: "/checkout/cancel", component: CheckoutCancelView, meta: { auth: true } },
    ],
});

router.beforeEach(async (to) => {
    const auth = useAuthStore();

    // ob refreshu: če je token, poskusi fetchMe enkrat
    if (auth.token && !auth.user) await auth.fetchMe();

    if (to.meta.auth && !auth.token) {
        return { path: "/login", query: { next: to.fullPath } };
    }
    return true;
});

export default router;