<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isProducts = computed(() => route.path.startsWith("/products"));
const isOrders = computed(() => route.path.startsWith("/orders"));

const linkClass = (active: boolean) =>
    [
      "px-3 py-2 rounded-lg text-sm transition",
      active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100",
    ].join(" ");
</script>

<template>
  <div class="min-h-screen bg-zinc-50 text-zinc-900">
    <!-- Topbar -->
    <header class="border-b bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="h-16 flex items-center justify-between">
          <router-link to="/products" class="flex items-center gap-2">
            <div class="h-9 w-9 rounded-xl bg-zinc-900"></div>
            <div class="leading-tight">
              <div class="font-semibold">CloudShopt</div>
              <div class="text-xs text-zinc-500">Storefront</div>
            </div>
          </router-link>

          <nav class="flex items-center gap-2">
            <router-link
                to="/products"
                :class="linkClass(isProducts)"
            >
              Products
            </router-link>

            <router-link
                to="/orders"
                :class="linkClass(isOrders)"
            >
              Orders
            </router-link>

            <!-- placeholder za kasneje -->
            <button
                class="px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-100 transition"
                type="button"
                disabled
                title="Coming soon"
            >
              Cart
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-zinc-500">
        <div class="flex items-center justify-between">
          <span>© {{ new Date().getFullYear() }} CloudShopt</span>
          <span class="opacity-70">Local dev</span>
        </div>
      </div>
    </footer>
  </div>
</template>