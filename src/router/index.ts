import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";

import GuestRoutes from "./routes/guest";
import AdminRoutes from "./routes/admin";
import SuperAdminRoutes from "./routes/superAdmin";

const routes = [...GuestRoutes, ...AdminRoutes, ...SuperAdminRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  
  // Sync auth state from localStorage before checking (ensures state is up-to-date)
  authStore.syncAuthState();

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Not authenticated, redirect to login
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }

    // Check if route requires admin role
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      // Not admin, redirect to home or show error
      next({ name: 'home' });
      return;
    }

    // Check if route requires super admin role
    if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
      // Not super admin, redirect to home or show error
      next({ name: 'home' });
      return;
    }
  }

  // If user is authenticated and trying to access login/signup, redirect to home
  if (authStore.isAuthenticated && (to.name === 'login' || to.name === 'signup')) {
    next({ name: 'home' });
    return;
  }

  next();
});

export default router;