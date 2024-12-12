<script setup>
import { ref, onMounted } from "vue";
import { Menu, Loader } from "lucide-vue-next";
import NavBar from "../components/NavBar.vue";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "vue-router";
import { Socket, Presence } from "phoenix"
import moment from "moment"

const token = localStorage.getItem("authtoken")


const SOCKET_URL = import.meta.env.VITE_DEV_SOCKET_URL
const socket = new Socket(SOCKET_URL, {
  params: { token },
  reconnectAfterMs: (tries) => {
    return [1000, 2000, 5000][tries - 1] || 10000;
  },
  heartbeatIntervalMs: 30000,
})


socket.onError(() => console.log("there was an error with the connection!"))
socket.onClose(() => console.log("the connection dropped"))

try {
  socket.connect()
} catch (error) {
  console.error("Socket connection error:", error)
}


const router = useRouter();
const userData = ref({})
const isMenuOpen = ref(false);
const newBidAmount = ref("");
const isLoading = ref(true);
const isPlacingBid = ref(false);
const showLightbox = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const auctionId = router.currentRoute.value.params.auctionId;

const channel = socket.channel(`item:${auctionId}`)
const presence = new Presence(channel)
const auction = ref({});
const onlineBidders = ref([])
const bids = ref([]);

presence.onSync(() => {
  const presenceList = presence.list((id, { metas: [first, ...rest] }) => {
    return {
      userId: id,
      userName: first.user_name,
      onlineAt: first.online_at
    }
  })
  onlineBidders.value = presenceList
  console.log("presenceList:", presenceList)
})

const postBid = async () => {
  if (isPlacingBid.value) return;
  
  const bidAmount = parseInt(newBidAmount.value);
  const startingBid = parseInt(auction.value.starting_bid);
  const currentHighestBid = bids.value[0]?.bid_amount;

  // Validate bid amount
  if (bidAmount < startingBid) {
    alert("Your bid is below the starting bid");
    return;
  }

  if (currentHighestBid && bidAmount <= currentHighestBid) {
    alert("There is a higher bid than this already");
    return;
  } 
  
  isPlacingBid.value = true;
  
  try {
    const response = await fetch(
      `${import.meta.env.VITE_DEV_BACKEND_URL}/api/users/${userData.value.userId}/items/${auctionId}/bids`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
        body: JSON.stringify({bid: {
          bid_amount: parseInt(newBidAmount.value)
        }}),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to post bid");
    }

    const { data } = await response.json();
    console.log("bid:", data);
    channel.push("new_bid", { bid: data });
    newBidAmount.value = "";
  } catch (error) {
    console.error("Error posting bid:", error);
  } finally {
    isPlacingBid.value = false;
  }
};

const fetchAuctionDetails = async () => {
  const userId = jwtDecode(localStorage.getItem("authtoken")).sub;
  console.log(userId);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_DEV_BACKEND_URL}/api/items/${auctionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch auction details");
    }

    const { data } = await response.json();
    console.log("auction:", data);
    auction.value = data;
    console.log("new auction:", auction.value)
    bids.value = data.bids || [];
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching auction details:", error);
    isLoading.value = false;
  }
};

const authenticate = () => {
  if (token) {
    const decoded = jwtDecode(token);
    const user = { userId: decoded.sub, name: decoded.name };
    userData.value = user;
  } else {
    router.push("/signin")
  }
}

onMounted(() => {
  fetchAuctionDetails();

  authenticate()

  channel.join().receive("ok", () => {
    console.log("joined channel")
  }).receive("error", (resp) => {
    console.log("Unable to join", resp)
    alert("error joining channel")
  })

  channel.on("new_bid", (payload) => {
    console.log(payload)
    const { bid_amount, bid_time, user } = payload.bid
    const newBid = {
      id: bids.value.length + 1,
      bid_amount, bid_time, user
    }
    bids.value.unshift(newBid)
  })
});
</script>

<template>
  <div class="min-h-screen bg-green-50">
    <NavBar />
    <main class="container mx-auto py-8 px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Item Details -->
        <div class="md:col-span-2">
          <h1 v-if="isLoading" class="h-8 bg-gray-300 rounded w-3/4 mb-4"></h1>
          <h1 v-else class="text-3xl font-bold text-green-800 mb-4">
            {{ auction.title }}
          </h1>
          <div v-if="isLoading" class="w-full h-64 bg-gray-300 rounded-lg mb-4"></div>
          <img
            v-else
            :src="auction.img_url"
            :alt="auction.title"
            class="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer"
            @click="showLightbox = true"
          />
          <div class="bg-white rounded-lg shadow-md p-6">
            <div v-if="isLoading">
              <div class="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div class="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-full mb-2"></div>
            </div>
            <div v-else>
              <p class="text-xl font-semibold text-green-600 mb-2">
                Current Bid: {{bids.length > 0 ? bids[0].bid_amount: "None"}} ETB
              </p>
              <p class="text-gray-600 mb-2">
                Starting Bid: {{ auction.starting_bid }} ETB
              </p>
              <p class="text-gray-600 mb-2">Category: {{ auction?.category?.name }}</p>
              <p class="text-gray-600 mb-4">
                Auction Ends: {{moment(auction.auction_end).fromNow()}}
              </p>
              <h2 class="text-2xl font-semibold text-green-800 mb-2">
                Description
              </h2>
              <p class="text-gray-700">{{ auction.description }}</p>
            </div>
          </div>
        </div>

        <!-- Bid List -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold text-green-800 mb-4">
              Live Bids
            </h2>
            <ul v-if="isLoading" class="space-y-4">
              <li v-for="n in 3" :key="n" class="border-b border-gray-200 pb-4 last:border-b-0">
                <div class="flex justify-between items-center mb-2">
                  <div class="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div class="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                  <div class="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </li>
            </ul>
            <ul v-else class="space-y-4 overflow-y-auto max-h-52 scrollbar-hide">
              <li
                v-if="bids.length > 0" v-for="bid in bids"
                :key="bid.id"
                class="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold text-green-600"
                    >{{ bid.bid_amount }} ETB</span
                  >
                  <span class="text-sm text-gray-500">{{ moment(bid.inserted_at).fromNow() }}</span>
                </div>
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-2"
                  >
                    {{ bid.user.name.slice(0,2).toUpperCase() }}
                  </div>
                  <span class="text-gray-700">{{ bid.user.name }}</span>
                </div>
              </li>
              <span v-else>No bids yet</span>
            </ul>
            <div name="item-bidders" class="flex flex-row items-center mt-12 mb-6">
              <div v-for="(onlineBidder, index) in onlineBidders.slice(0,2)" :key="index" 
                   :style="{ zIndex: onlineBidders.length - index, marginLeft: index === 0 ? '0' : '-1rem' }"
                   class="ring-2 ring-white w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm"
              >
                {{ onlineBidder.userName.slice(0,2).toUpperCase() }} 
              </div>
              <span class="ml-2 font-bold text-green-500" v-if="onlineBidders.length > 2">+{{onlineBidders.length - 2}} users are bidding</span>
            </div>

            <div class="mt-6">
              <input
                v-model="newBidAmount"
                type="number"
                placeholder="Enter your bid"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
              />
              <button
                @click="postBid"
                :disabled="isPlacingBid"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Loader v-if="isPlacingBid" class="animate-spin mr-2" />
                {{ isPlacingBid ? 'Placing Bid...' : 'Place Bid' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Lightbox -->
    <div v-if="showLightbox" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="showLightbox = false">
      <img :src="auction.img_url" :alt="auction.title" class="max-w-full max-h-full object-contain" />
    </div>
  </div>
</template>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>