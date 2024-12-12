<template>
  <div class="min-h-screen bg-green-50">
    <!-- Responsive Navbar -->


    <!-- Main Content -->
    <main class="container mx-auto py-8 px-4">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6">
          <h1 class="text-3xl font-bold text-green-800 mb-6 text-center">Log In to Your Account</h1>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input v-model="email" type="email" id="email" name="email" required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input v-model="password" type="password" id="password" name="password" required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
            <div class="mt-6">
              <button type="submit" :disabled="isLoading"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                <Loader v-if="isLoading" class="animate-spin mr-2" />
                {{ isLoading ? 'Logging in...' : 'Log In' }}
              </button>
            </div>
          </form>
          <div class="mt-4 text-center">
            <a href="#" class="text-sm text-green-600 hover:text-green-800">Forgot your password?</a>
          </div>
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <a href="/signup" class="text-green-600 hover:text-green-800 font-semibold">Sign up here</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, Loader } from "lucide-vue-next"
import { useRouter } from 'vue-router';

const router = useRouter();

const isMenuOpen = ref(false)
const email = ref('')
const password = ref('')
const isLoading = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`${import.meta.env.VITE_DEV_BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"user": {email: email.value, password: password.value}})
    });
    if (response.ok) {
      const { data } = await response.json();
      localStorage.setItem('authtoken', data.token);
      router.push('/auctions');
    } else {
      console.log('Error logging in');
      // You might want to add some error handling here, e.g., showing an error message to the user
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle any network errors here
  } finally {
    isLoading.value = false;
  }
};
</script>

