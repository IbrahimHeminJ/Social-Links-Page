import type { RouteRecordRaw } from "vue-router";
import Home from '../../views/Home.vue' 
import Login from '../../views/auth/login.vue'
import Signup from '../../views/auth/signup.vue'
import SocialLinks from '../../views/SocialLinks.vue'
import ExplorePage from '../../views/Explore.vue'
import SearchPage from "../../views/searchPage.vue";

const guestRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Home, 
    }, 
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: 'Login',
            requiresAuth: false,
        },
    },
    {
        path: '/signup',
        name: 'signup',
        component: Signup,
        meta: {
            title: 'Signup',
            requiresAuth: false,
        },
    },
    {
        path: '/social-links',
        name: 'social-links',
        component: SocialLinks,
        meta: {
            title: 'Social Links',
            requiresAuth: false,
        },
    },
    {
        path:'/explore',
        name: 'explore',
        component: ExplorePage,
        meta: {
            title: 'Explore',
            requiresAuth: false,
        },
    },
    {
        path:'/explore/search',
        name: 'explore-search',
        component: SearchPage,
        meta: {
            title: 'SearchPage',
            requiresAuth: false,
        },
    }
]

export default guestRoutes;