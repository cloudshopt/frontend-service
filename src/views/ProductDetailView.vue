<template>
  <div v-if="p" class="max-w-2xl">
    <h1 class="text-2xl font-semibold">{{ p.name }}</h1>
    <div class="text-zinc-300 mt-2">{{ p.description }}</div>
    <div class="mt-4 text-lg">{{ formatPrice(p.price) }}</div>

    <div class="mt-6 flex gap-2">
      <button class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500" @click="add">
        Add to cart
      </button>
      <RouterLink to="/products" class="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700">
        Back
      </RouterLink>
    </div>

    <p v-if="msg" class="text-green-400 mt-4">{{ msg }}</p>
    <p v-if="error" class="text-red-400 mt-4">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { apiGet } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

type Product = { id: number; name: string; description?: string; price: number };

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const cart = useCartStore();

const p = ref<Product | null>(null);
const error = ref("");
const msg = ref("");

const PRICE_IS_CENTS = true;
function formatPrice(price: number) {
  return PRICE_IS_CENTS ? `€${(price / 100).toFixed(2)}` : `€${price}`;
}

onMounted(async () => {
  try {
    const r = await apiGet<{ data: Product }>(`/products/items/${route.params.id}`, false);
    p.value = r.data;
  } catch (e: any) {
    error.value = e?.message ?? "Failed to load product";
  }
});

async function add() {
  msg.value = "";
  error.value = "";
  if (!auth.token) {
    router.push({ path: "/login", query: { next: route.fullPath } });
    return;
  }
  try {
    await cart.addItem(Number(route.params.id), 1);
    msg.value = "Added to cart.";
  } catch (e: any) {
    error.value = e?.message ?? "Failed to add to cart";
  }
}
</script>