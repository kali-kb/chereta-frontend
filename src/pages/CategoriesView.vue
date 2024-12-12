<script setup>
import { ref, onMounted } from "vue";
import { Menu, ArrowRight } from "lucide-vue-next";
import NavBar from "../components/NavBar.vue"
import { useRouter } from "vue-router"


const isMenuOpen = ref(false);
const router  = useRouter()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const fetchCategories = async() => {
  try {
    const response = await fetch(`${import.meta.env.VITE_DEV_BACKEND_URL}/api/categories`);
    const { data } = await response.json();
    categories.value = data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}
onMounted(() => { fetchCategories() })

const categories = ref([]);
</script>

<template>
  <div class="min-h-screen bg-green-50">
    <!-- Responsive Navbar -->
    <NavBar />
    <!-- Main Content -->
    <main class="container mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold text-green-800 mb-8">Auction Categories</h1>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.category_id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <img
            src="https://res.cloudinary.com/dbqkwb9fx/image/upload/v1733759407/Chereta_kobxzy.png"
            :alt="category.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h2 class="text-xl font-semibold text-green-800 mb-2">
              {{ category.name }}
            </h2>
            <p class="text-gray-600 mb-4">{{ category.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500"
                >{{ category.items.data.length }} items</span
              >
              <button
                @click="router.push(`/categories/${category.id}`)"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
              >
                <ArrowRight class="h-4 w-4 mr-2" />
                View Auctions
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


