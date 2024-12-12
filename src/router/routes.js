import { createRouter, createMemoryHistory, createWebHistory } from "vue-router";
import AuctionDetailView from "../pages/AuctionDetailView.vue";
import AuctionsView from "../pages/AuctionsView.vue";
import CategoriesView from "../pages/CategoriesView.vue";
import CategoryDetailView from "../pages/CategoryDetailView.vue";
import AuctionCreationForm from "../pages/AuctionCreationForm.vue";
import SignInView from "../pages/SignInView.vue";
import SignUpView from "../pages/SignUpView.vue";



const routes = [
    {path: '/auctions', component: AuctionsView},
    {path: '/auctions/:auctionId', component: AuctionDetailView},
    {path: '/categories', component: CategoriesView},
    {path: '/auctions/new', component: AuctionCreationForm },
    {path: '/categories/:categoryId', component: CategoryDetailView},
    {path: '/signup', component: SignUpView},
    {path: '/signin', component: SignInView}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next('/auctions')
    } else {
        next()
    }
})


export default router;