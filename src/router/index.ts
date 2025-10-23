import { createRouter, createWebHistory } from "vue-router";

import guestRoutes from "./routes/guest";

const routes = [...guestRoutes];

export default createRouter({
  history: createWebHistory(),
  routes,
});
