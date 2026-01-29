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

type GraphQLResponse<T> = { data?: T; errors?: Array<{ message: string }> };

async function gql<T>(query: string, variables?: Record<string, any>) {
  const res = await fetch("/api/products/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await res.json()) as GraphQLResponse<T>;

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("No data returned from GraphQL");
  }
  return json.data;
}

onMounted(async () => {
  try {
    const data = await gql<{ products: Product[] }>(
        `query {
        products {
          id
          name
          price
          description
        }
      }`
    );
    products.value = data.products;
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