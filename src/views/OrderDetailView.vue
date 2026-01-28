<template>
  <div v-if="order" class="max-w-2xl">
    <h1 class="text-2xl font-semibold">Order #{{ order.id }}</h1>
    <div class="text-zinc-400 mt-1">Status: {{ order.status }}</div>
    <div class="text-zinc-300 mt-2">Total: {{ formatPrice(order.total_price) }}</div>

    <div class="mt-6 space-y-3">
      <div v-for="i in order.items" :key="i.id" class="rounded border border-zinc-800 bg-zinc-900 p-4">
        <div class="font-semibold">{{ i.name_snapshot }}</div>
        <div class="text-zinc-400 text-sm">{{ formatPrice(i.unit_price_snapshot) }} × {{ i.qty }}</div>
      </div>
    </div>

    <RouterLink to="/orders" class="inline-block mt-6 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700">
      Back to orders
    </RouterLink>

    <p v-if="error" class="text-red-400 mt-4">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { apiGet } from "@/lib/api";

type OrderItem = {
  id: number;
  name_snapshot: string;
  unit_price_snapshot: number;
  qty: number;
};

type Order = { id: number; status: string; total_price: number; items: OrderItem[] };

const route = useRoute();
const order = ref<Order | null>(null);
const error = ref("");

const PRICE_IS_CENTS = true;
function formatPrice(price: number) {
  return PRICE_IS_CENTS ? `€${(price / 100).toFixed(2)}` : `€${price}`;
}

onMounted(async () => {
  try {
    const r = await apiGet<{ data: Order }>(`/orders/items/${route.params.id}`, true);
    order.value = r.data;
  } catch (e: any) {
    error.value = e?.message ?? "Failed to load order";
  }
});

</script>