<script setup>
import { ref, reactive } from "vue";
import { Menu, Loader } from "lucide-vue-next";
import { useRouter } from "vue-router";


const router = useRouter();
const isLoading = ref(false)
const form = reactive({
  name: "",
  email: "",
  password: "",
  agreeTerms: false,
});

const handleSubmit = async() => {

  if (!form.agreeTerms) {
    alert("Please agree to the Terms and Conditions");
    return;
  }
  
  // Create a new object without agreeTerms
  const { agreeTerms, ...userData } = form;
  isLoading.value = true  
  const response = await fetch(`${import.meta.env.VITE_DEV_BACKEND_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"user": userData})
  })
  if (response.ok) {
    const data = await response.json()
    localStorage.setItem("authtoken", data.token)
    isLoading.value = false
  } else {
    isLoading.value = false
    alert("Something went wrong. Please try again.");
  }
  router.push("/auctions")
  alert("Account created successfully!");
};

</script>


<template>
  <div class="min-h-screen bg-green-50">
    <!-- Main Content -->
    <main class="container mx-auto py-8 px-4">
      <div
        class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-6">
          <h1 class="text-3xl font-bold text-green-800 mb-6 text-center">
            Create an Account
          </h1>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                  >Full Name</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                  >Email Address</label
                >
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                  >Password</label
                >
                <input
                  v-model="form.password"
                  type="password"
                  id="password"
                  name="password"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <!-- <div>
                <label
                  for="confirmPassword"
                  class="block text-sm font-medium text-gray-700"
                  >Confirm Password</label
                >
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div> -->
              <div class="flex items-center">
                <input
                  v-model="form.agreeTerms"
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  required
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  for="agreeTerms"
                  class="ml-2 block text-sm text-gray-900"
                >
                  I agree to the
                  <a href="#" class="text-green-600 hover:text-green-800"
                    >Terms and Conditions</a
                  >
                </label>
              </div>
            </div>
            <div class="mt-6">
              <button
                type="submit"
                :disabled="!form.agreeTerms || isLoading"
                class="w-full bg-green-600 flex justify-center hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader v-if="isLoading" class="animate-spin mr-2" />
                {{ isLoading ? 'Signing up...' : 'Sign Up' }}
                
              </button>
            </div>
          </form>
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <a
                href="/signin"
                class="text-green-600 hover:text-green-800 font-semibold"
                >Log in here</a
              >
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

