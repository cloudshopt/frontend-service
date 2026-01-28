<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100">
    <header class="border-b border-zinc-800">
      <div class="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <RouterLink to="/products" class="font-semibold">CloudShopt</RouterLink>
          <RouterLink to="/products" class="text-zinc-300 hover:text-white">Products</RouterLink>
          <RouterLink v-if="auth.isAuthed" to="/orders" class="text-zinc-300 hover:text-white">Orders</RouterLink>
        </div>

        <div class="flex items-center gap-3">
          <RouterLink v-if="auth.isAuthed" to="/cart" class="text-zinc-300 hover:text-white">
            Cart <span class="text-zinc-500">({{ cart.count }})</span>
          </RouterLink>

          <div v-if="auth.isAuthed" class="flex items-center gap-2">
            <span class="text-zinc-400 text-sm">{{ auth.user?.name }}</span>
            <button class="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700" @click="logout">
              Logout
            </button>
          </div>

          <div v-else class="flex items-center gap-2">
            <RouterLink class="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700" to="/login">Login</RouterLink>
            <RouterLink class="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500" to="/register">Register</RouterLink>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();

onMounted(async () => {
  if (auth.token) {
    await auth.fetchMe();
    await cart.fetchCart();
  }
});

function logout() {
  auth.logout();
  cart.items = [];
  cart.total_price = 0;
  router.push("/products");
}
</script>