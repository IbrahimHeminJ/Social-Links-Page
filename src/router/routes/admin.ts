import type { RouteRecordRaw } from "vue-router";
import Dashboard from '../../views/admin/dashboard.vue'

const AdminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin',
        name: 'admin.dashboard',
        component: Dashboard,
        meta: {
            title: 'Admin Dashboard',
            requiresAuth: true,
            requiresAdmin: true,
        },
    },
]

export default AdminRoutes;