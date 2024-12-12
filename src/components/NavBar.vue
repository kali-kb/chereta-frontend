<script setup>
import { ref, onMounted } from "vue";
import { Menu } from "lucide-vue-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "vue-router";

const router = useRouter();
const isMenuOpen = ref(false);
const newBidAmount = ref("");
const userData = ref();

onMounted(() => {
  const token = localStorage.getItem("authtoken");
  if (token) {
    const decoded = jwtDecode(token);
    const userObj = { id: decoded.sub, name: decoded.name };
    userData.value = userObj;
    console.log(userData.value);
  } else {
    router.push("/signin");
  }
});

const logOut = () => {
  localStorage.removeItem("authtoken");
  router.push("/signin");
};
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <nav class="bg-white sticky top-0 shadow-md p-4">
    <div class="container mx-auto">
      <div class="flex justify-between items-center">
        <div class="text-2xl font-bold text-green-600">
          <a href="/">
            <img class="h-10 w-auto" src="../assets/chereta-web-logo.png" />
          </a>
        </div>
        <div class="hidden md:flex space-x-4">
          <a href="/auctions" class="text-green-600 hover:text-green-800"
            >Auctions</a
          >
          <a href="/categories" class="text-green-600 hover:text-green-800"
            >Categories</a
          >
        </div>
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold"
          >
            {{ userData?.name?.slice(0, 2).toUpperCase() || "" }}
          </div>
          <button
            @click="logOut"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded hidden md:block"
          >
            Log out
          </button>
          <button class="md:hidden text-green-600" @click="toggleMenu">
            <Menu class="h-6 w-6" />
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden mt-4">
        <a href="/auctions" class="block py-2 text-green-600 hover:text-green-800"
          >Auctions</a
        >
        <a href="/categories" class="block py-2 text-green-600 hover:text-green-800"
          >Categories</a
        >
        <button
          @click="logOut"
          class="block w-full text-left py-2 text-green-600 hover:text-green-800"
        >
          Log out
        </button>
      </div>
    </div>
  </nav>
</template>
