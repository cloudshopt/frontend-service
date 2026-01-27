<script setup lang="ts">
import { onMounted, ref } from "vue";

const items = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const r = await fetch("/api/orders/orders", {
      headers: { Accept: "application/json" },
    });
    items.value = await r.json();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex items-end justify-between mb-6">
    <div>
      <h1 class="text-2xl font-semibold">Orderss</h1>
      <p class="text-sm text-zinc-500">Check all orders</p>
    </div>

    <div class="text-sm text-zinc-500">
      <!-- placeholder -->
      <span class="px-2 py-1 rounded-md bg-zinc-100">v0</span>
    </div>
  </div>

  <div>
    <h1 class="text-2xl font-semibold mb-4">Orders</h1>

    <div v-if="loading">Loading…</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <router-link
          v-for="p in items"
          :key="p.id"
          :to="`/products/${p.id}`"
          class="rounded-xl border p-4 hover:shadow"
      >
        <div class="font-medium">{{ p.name }}</div>
        <div class="text-sm opacity-70">{{ p.total_cost }} {{ p.currency }}</div>
      </router-link>
    </div>
  </div>
</template>
