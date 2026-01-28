<template>
  <div class="max-w-md">
    <h1 class="text-2xl font-semibold mb-4">Register</h1>

    <form class="space-y-3" @submit.prevent="submit">
      <input v-model="name" class="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800"
             placeholder="Name" />
      <input v-model="email" class="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800"
             placeholder="Email" />

      <input v-model="password" type="password"
             class="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800"
             placeholder="Password" />
      <input v-model="password_confirmation" type="password"
             class="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800"
             placeholder="Confirm password" />

      <button :disabled="auth.loading"
              class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50">
        Create account
      </button>

      <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const error = ref("");

async function submit() {
  error.value = "";
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
    await cart.fetchCart();
    router.push("/products");
  } catch (e: any) {
    error.value = e?.message ?? "Register failed";
  }
}
</script>