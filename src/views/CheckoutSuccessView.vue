<template>
  <div>
    <h1 class="text-2xl font-semibold">Payment success</h1>
    <p class="text-zinc-400 mt-2">Your payment was successful. You can open the order.</p>

    <RouterLink
        class="inline-block mt-4 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
        :to="`/orders/${orderId}`"
    >
      Go to order
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const orderId = computed(() => route.query.order_id ?? "");
</script>