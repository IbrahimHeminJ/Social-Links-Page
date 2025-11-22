import { createRouter, createWebHistory } from "vue-router";

import GuestRoutes from "./routes/guest";
import AdminRoutes from "./routes/admin";
import SuperAdminRoutes from "./routes/superAdmin";


const routes = [...GuestRoutes, ...AdminRoutes, ...SuperAdminRoutes];

export default createRouter({
  history: createWebHistory(),
  routes,
});