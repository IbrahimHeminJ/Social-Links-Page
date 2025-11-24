import type { RouteRecordRaw } from "vue-router";
import Links from '../../views/admin/links.vue'
import Profile from '../../views/admin/profile.vue'
import Themes from '../../views/admin/themes.vue'

const AdminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin/links',
        name: 'admin.links',
        component: Links,
        meta: {
            title: 'Admin Dashboard',
            requiresAuth: true,
            requiresAdmin: true,
        },
    },
    {
        path: '/admin/profile',
        name: 'admin.profile',
        component: Profile,
        meta: {
            title: 'Admin Dashboard',
            requiresAuth: true,
            requiresAdmin: true,
        },
    },
    {
        path: '/admin/themes',
        name: 'admin.themes',
        component: Themes,
        meta: {
            title: 'Admin Dashboard',
            requiresAuth: true,
            requiresAdmin: true,
        },
    },
    
]

export default AdminRoutes;