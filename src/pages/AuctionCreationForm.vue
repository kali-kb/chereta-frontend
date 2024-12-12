<script setup>
import { ref, reactive } from 'vue'
import { Menu, Loader } from 'lucide-vue-next'
import { jwtDecode } from 'jwt-decode'
import NavBar from '../components/NavBar.vue'
import cloudinaryUploader from '../../uploader'
import { useRouter } from "vue-router"


const isMenuOpen = ref(false)
const imagePreview = ref(null)
const router = useRouter()
const isPosting = ref(false)

const categories = ([
  {
    'category_id': 38,
    'name': 'Automobiles',
  },
  {
    'category_id': 39,
    'name': 'Computers and Accessories'
  },
  {
    'category_id': 40,
    'name': 'Houses and Rental'
  }
])



const form = reactive({
  title: '',
  description: '',
  categoryId: '',
  startingBid: '',
  endDate: '',
  image: null
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleImageUpload = async(event) => {
  const file = event.target.files[0]
  const data = await cloudinaryUploader(event)
  form.image = data.secure_url
  // console.log("uploaded image: ", data.secure_url)
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async() => {
  isPosting.value = true
  const formData = {
    title: form.title,
    description: form.description,
    category_id: form.categoryId,
    starting_bid: form.startingBid,
    auction_end: form.endDate,
    image_url: form.image
  };
  const userId = jwtDecode(localStorage.getItem("authtoken")).sub
  const response = await fetch(`${import.meta.env.VITE_DEV_BACKEND_URL}/api/users/${userId}/items`, {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      item: formData
    }), 
    headers: {
    "Content-Type": "application/json"
    }
  })
  if (response.ok) {
    alert('Auction created successfully!')
    router.push("/auctions")
    // imagePreview.value = null
    // for (const key in form) {
    //   form[key] = ''
    // }
  }

  isPosting.value = false
}
</script>


<template>
    <div class="min-h-screen bg-green-50">
      <!-- Responsive Navbar -->
      <NavBar />
  
      <!-- Main Content -->
      <main class="container mx-auto py-8 px-4">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <h1 class="text-3xl font-bold text-green-800 mb-6">Create New Auction</h1>
            <form @submit.prevent="handleSubmit">
              <div class="space-y-6">
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                  <input v-model="form.title" type="text" id="title" name="title" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea v-model="form.description" id="description" name="description" rows="4" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
                </div>
                
                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                  <select v-model="form.categoryId" id="category" name="category" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <option value="">Select a category</option>
                    <option v-for="category in categories"  :key="category.category_id" :value="category.category_id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label for="startingBid" class="block text-sm font-medium text-gray-700">Starting Bid Amount ($)</label>
                  <input v-model="form.startingBid" type="number" id="startingBid" name="startingBid" min="0" step="0.01" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div>
                  <label for="endDate" class="block text-sm font-medium text-gray-700">Auction End Date</label>
                  <input v-model="form.endDate" type="datetime-local" id="endDate" name="endDate" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div>
                  <label for="image" class="block text-sm font-medium text-gray-700">Upload Image</label>
                  <input type="file" id="image" name="image" @change="handleImageUpload" accept="image/*"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div v-if="imagePreview" class="mt-4">
                  <img :src="imagePreview" alt="Preview" class="max-w-full h-auto rounded-md" />
                </div>
              </div>
              
              <div class="mt-8">
                <button :disabled="isPosting" type="submit"
                  class="w-full flex justify-center bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  <Loader v-if="isPosting" class="animate-spin mr-2" />
                  {{ !isPosting ? "Create Auction" : void(0)}}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </template>
  
