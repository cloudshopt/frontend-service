<template>
  <div class="max-w-md">
    <h1 class="text-2xl font-semibold mb-4">Login</h1>

    <form class="space-y-3" @submit.prevent="submit">
      <input v-model="email" class="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800"
             placeholder="Email" />
      <input v-model="password" type="password"
             class="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800"
             placeholder="Password" />

      <button :disabled="auth.loading"
              class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50">
        Login
      </button>

      <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const error = ref("");

async function submit() {
  error.value = "";
  try {
    await auth.login({ email: email.value, password: password.value });
    await cart.fetchCart();
    const next = (route.query.next as string) || "/products";
    router.push(next);
  } catch (e: any) {
    error.value = e?.message ?? "Login failed";
  }
}
</script>