<template>
  <div>
    <h1 class="text-2xl font-semibold">Payment cancelled</h1>
    <p class="text-zinc-400 mt-2">You cancelled the payment.</p>

    <RouterLink
        class="inline-block mt-4 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700"
        :to="`/orders/${orderId}`"
    >
      Back to order
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const orderId = computed(() => route.query.order_id ?? "");
</script>