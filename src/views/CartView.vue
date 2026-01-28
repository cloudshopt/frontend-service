<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Cart</h1>

    <p v-if="error" class="text-red-400 mb-3">{{ error }}</p>
    <p v-if="msg" class="text-green-400 mb-3">{{ msg }}</p>

    <div v-if="cart.items.length === 0" class="text-zinc-400">Cart is empty.</div>

    <div v-else class="space-y-3">
      <div v-for="i in cart.items" :key="i.id" class="rounded border border-zinc-800 bg-zinc-900 p-4 flex justify-between gap-4">
        <div>
          <div class="font-semibold">{{ i.name_snapshot }}</div>
          <div class="text-zinc-400 text-sm">
            {{ formatPrice(i.unit_price_snapshot) }} × {{ i.qty }}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button class="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700" @click="setQty(i.id, i.qty - 1)" :disabled="i.qty <= 1">-</button>
          <span class="w-10 text-center">{{ i.qty }}</span>
          <button class="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700" @click="setQty(i.id, i.qty + 1)">+</button>
          <button class="px-3 py-1 rounded bg-red-700 hover:bg-red-600" @click="remove(i.id)">Remove</button>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div class="text-lg">Total: <span class="font-semibold">{{ formatPrice(cart.total_price) }}</span></div>
        <button class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500" @click="createOrder">
          Create order
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";

const cart = useCartStore();
const router = useRouter();
const error = ref("");
const msg = ref("");

const PRICE_IS_CENTS = true;
function formatPrice(price: number) {
  return PRICE_IS_CENTS ? `€${(price / 100).toFixed(2)}` : `€${price}`;
}

onMounted(async () => {
  await cart.fetchCart();
});

async function setQty(itemId: number, qty: number) {
  error.value = "";
  msg.value = "";
  try {
    if (qty < 1) return;
    await cart.updateItem(itemId, qty);
  } catch (e: any) {
    error.value = e?.message ?? "Failed to update";
  }
}

async function remove(itemId: number) {
  error.value = "";
  msg.value = "";
  try {
    await cart.removeItem(itemId);
  } catch (e: any) {
    error.value = e?.message ?? "Failed to remove";
  }
}

async function createOrder() {
  error.value = "";
  msg.value = "";
  try {
    const order = await cart.createOrderFromCart();
    msg.value = `Order created (#${order.id}).`;
    router.push(`/orders/${order.id}`);
  } catch (e: any) {
    error.value = e?.message ?? "Failed to create order";
  }
}
</script>