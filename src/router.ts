import { createRouter, createWebHistory } from "vue-router";

import ProductsPage from "./pages/ProductsPage.vue";
import ProductDetailPage from "./pages/ProductDetailPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", redirect: "/products" },
        { path: "/products", component: ProductsPage },
        { path: "/products/:id", component: ProductDetailPage, props: true },
        { path: "/:pathMatch(.*)*", component: NotFoundPage }
    ],
});

export default router;