<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Products</h1>

    <p v-if="error" class="text-red-400 mb-3">{{ error }}</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="p in products" :key="p.id" class="rounded border border-zinc-800 bg-zinc-900 p-4">
        <div class="font-semibold">{{ p.name }}</div>
        <div class="text-zinc-400 text-sm mt-1 line-clamp-2">{{ p.description }}</div>

        <div class="mt-3 flex items-center justify-between">
          <div class="text-zinc-200">{{ formatPrice(p.price) }}</div>
          <div class="flex gap-2">
            <RouterLink :to="`/products/${p.id}`" class="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700">
              View
            </RouterLink>
            <button class="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500" @click="add(p.id)">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="msg" class="text-green-400 mt-4">{{ msg }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { apiGet } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

type Product = { id: number; name: string; description?: string; price: number };

const products = ref<Product[]>([]);
const error = ref("");
const msg = ref("");
const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();

const PRICE_IS_CENTS = true;
function formatPrice(price: number) {
  return PRICE_IS_CENTS ? `€${(price / 100).toFixed(2)}` : `€${price}`;
}

onMounted(async () => {
  try {
    const r = await apiGet<{ data: Product[] }>("/products/items", false);
    products.value = r.data;
  } catch (e: any) {
    error.value = e?.message ?? "Failed to load products";
  }
});

async function add(productId: number) {
  msg.value = "";
  error.value = "";
  if (!auth.token) {
    router.push({ path: "/login", query: { next: "/products" } });
    return;
  }
  try {
    await cart.addItem(productId, 1);
    msg.value = "Added to cart.";
  } catch (e: any) {
    error.value = e?.message ?? "Failed to add to cart";
  }
}
</script>