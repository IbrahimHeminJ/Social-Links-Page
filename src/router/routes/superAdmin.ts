import type { RouteRecordRaw } from "vue-router";
import Users from '../../views/superadmin/users.vue'
import EditUser from '../../views/superadmin/editUser.vue'
import Profile from '../../views/superadmin/profile.vue'
import Reports from '../../views/superadmin/reports.vue'
import ReportDetail from '../../views/superadmin/reportDetail.vue'
import ReportHistory from '../../views/superadmin/reportHistory.vue'

const SuperAdminRoutes: RouteRecordRaw[] = [
    {
        path: '/super-admin/users',
        name: 'superAdmin.users',
        component: Users,
        meta: {
            title: 'Super Admin - Users',
            requiresAuth: true,
            requiresSuperAdmin: true,
        },
    },
    {
        path: '/super-admin/users/:id/edit',
        name: 'superAdmin.editUser',
        component: EditUser,
        meta: {
            title: 'Edit User',
            requiresAuth: true,
            requiresSuperAdmin: true,
        },
    },
    {
        path: '/super-admin/profile',
        name: 'superAdmin.profile',
        component: Profile,
        meta: {
            title: 'Super Admin - Profile',
            requiresAuth: true,
            requiresSuperAdmin: true,
        },
    },
    {
        path: '/super-admin/reports',
        name: 'superAdmin.reports',
        component: Reports,
        meta: {
            title: 'Super Admin - Reports',
            requiresAuth: true,
            requiresSuperAdmin: true,
        },
    },
    {
        path: '/super-admin/reports/:id',
        name: 'superAdmin.reportDetail',
        component: ReportDetail,
        meta: {
            title: 'Report Detail',
            requiresAuth: true,
            requiresSuperAdmin: true,
        },
    },
    {
        path: '/super-admin/reports/:id/history',
        name: 'superAdmin.reportHistory',
        component: ReportHistory,
        meta: {
            title: 'Report History',
            requiresAuth: true,
            requiresSuperAdmin: true,
        },
    },
]

export default SuperAdminRoutes;

