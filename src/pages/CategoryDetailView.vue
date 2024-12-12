<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, Loader } from 'lucide-vue-next'
import NavBar from '../components/NavBar.vue'

const route = useRoute()
const router = useRouter()

const category = ref(null)
const isLoading = ref(true)
const error = ref(null)

const fetchCategoryAndAuctions = async () => {
  isLoading.value = true
  error.value = null
  try {
    const categoryResponse = await fetch(`${import.meta.env.VITE_DEV_BACKEND_URL}/api/categories/${route.params.categoryId}`)
    if (!categoryResponse.ok) {
      throw new Error('Failed to fetch data')
    }
    const categoryData = await categoryResponse.json()
    category.value = categoryData.data
  } catch (err) {
    error.value = 'An error occurred while fetching data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.params.categoryId) {
    fetchCategoryAndAuctions()
  }
})
</script>

<template>
  <div class="min-h-screen bg-green-50">
    <NavBar />
    <main class="container mx-auto py-8 px-4">
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <Loader class="w-8 h-8 text-green-600 animate-spin" />
      </div>
      <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
      <template v-else>
        <h1 class="text-3xl font-bold text-green-800 mb-8">
          {{ category?.name }} Auctions
        </h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="auction in category.items.data" :key="auction.item_id" class="bg-white rounded-lg shadow-md overflow-hidden">
            <img :src="auction.img_url" :alt="auction.title" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h2 class="text-xl font-semibold text-green-800 mb-2">{{ auction.title }}</h2>
              <p class="text-gray-600 mb-2">Starting Bid: {{ auction.starting_bid }} ETB</p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">{{ auction.bids.data.length }} bids</span>
                <button @click="router.push(`/auctions/${auction.item_id}`)" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                  Bid Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-if="category.items.length === 0" class="text-center text-gray-600 mt-8">No auctions found in this category.</p>
      </template>
    </main>
  </div>
</template>