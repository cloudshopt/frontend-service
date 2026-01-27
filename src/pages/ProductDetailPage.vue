<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{ id: string }>();

const product = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const r = await fetch(`/api/products/products/${props.id}`, {
      headers: { Accept: "application/json" },
    });

    if (!r.ok) {
      error.value = `HTTP ${r.status}`;
      return;
    }

    product.value = await r.json();
  } catch (e: any) {
    error.value = e?.message ?? "Unknown error";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <router-link class="text-sm underline opacity-70" to="/products">
      &larr; Back
    </router-link>

    <div v-if="loading" class="mt-4">Loading…</div>
    <div v-else-if="error" class="mt-4">Error: {{ error }}</div>

    <div v-else class="mt-4 rounded-xl border p-6">
      <div class="text-2xl font-semibold">{{ product.name }}</div>
      <div class="mt-2 text-sm opacity-70">SKU: {{ product.sku }}</div>

      <div class="mt-4 text-lg">
        {{ product.price }} {{ product.currency }}
        <span class="ml-2 text-sm opacity-70">
          ({{ product.in_stock ? "in stock" : "out of stock" }})
        </span>
      </div>

      <p class="mt-4 opacity-80">{{ product.description }}</p>
    </div>
  </div>
</template>