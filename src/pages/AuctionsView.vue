<script setup>
import { ref, onMounted } from "vue";
import { jwtDecode } from "jwt-decode";
import { UserCircle, PlusCircle } from "lucide-vue-next";
import NavBar from "../components/NavBar.vue";
import { useRouter } from "vue-router";
import SkeletonCard from "../components/SkeletonCard.vue";

const router = useRouter();
const userData = ref();
const isLoading = ref(true);
const auctions = ref([]);

const fetchAuctions = async () => {
  try {
    // const user_id = jwtDecode(localStorage.getItem("authtoken")).sub
    const userId = userData.value.userId;
    const response = await fetch(
      `${import.meta.env.VITE_DEV_BACKEND_URL}/api/users/${userId}/items`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch auctions");
    }

    const { data } = await response.json();
    console.log(data);
    auctions.value = data;
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching auctions:", error);
  }
};

onMounted(() => {
  const token = localStorage.getItem("authtoken");
  if (!token) {
    router.push("/signin");
    return;
  }
  const userPayload = jwtDecode(token);
  const data = { userId: userPayload.sub, userName: userPayload.name };
  userData.value = data;

  fetchAuctions();

  console.log(token);
});
</script>

<template>
  <div class="min-h-screen bg-green-50">
    <!-- Navbar -->
    <NavBar />
    <!-- Main Content -->

    <main class="container mx-auto py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-green-800">Current Auctions</h1>
        <button
          @click="router.push('/auctions/new')"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full flex items-center"
        >
          <PlusCircle class="h-5 w-5 mr-2" />
          Create New Auction
        </button>
      </div>
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard v-for="x in 3" :key="x" />
      </div>
      <!-- Auction Card Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="auction in auctions"
          :key="auction.item_id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <img
            :src="auction.img_url"
            :alt="auction.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h2 class="text-xl font-semibold text-green-800 mb-2">
              {{ auction.title }}
            </h2>
            <p class="text-green-600 font-bold mb-2">
              Starting Bid: {{ auction.starting_bid }} ETB
            </p>
            <p class="text-gray-600 mb-2">
              Category: {{ auction.category.name }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500"
                >{{ auction.bids.length }} bids</span
              >
              <button
                @click="router.push(`/auctions/${auction.item_id}`)"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Bid Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
