<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Orders</h1>

    <p v-if="error" class="text-red-400 mb-3">{{ error }}</p>

    <div class="space-y-3">
      <RouterLink
          v-for="o in orders"
          :key="o.id"
          :to="`/orders/${o.id}`"
          class="block rounded border border-zinc-800 bg-zinc-900 p-4 hover:bg-zinc-800"
      >
        <div class="flex items-center justify-between">
          <div class="font-semibold">Order #{{ o.id }}</div>
          <div class="text-zinc-400">{{ o.status }}</div>
        </div>
        <div class="text-zinc-300 mt-2">Total: {{ formatPrice(o.total_price) }}</div>
      </RouterLink>

      <div v-if="orders.length === 0" class="text-zinc-400">No orders yet.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { apiGet } from "@/lib/api";

type Order = { id: number; status: string; total_price: number };

const orders = ref<Order[]>([]);
const error = ref("");

const PRICE_IS_CENTS = true;
function formatPrice(price: number) {
  return PRICE_IS_CENTS ? `€${(price / 100).toFixed(2)}` : `€${price}`;
}

onMounted(async () => {
  try {
    const r = await apiGet<{ data: Order[] }>("/orders/items", true);
    orders.value = r.data;
  } catch (e: any) {
    error.value = e?.message ?? "Failed to load orders";
  }
});
</script>