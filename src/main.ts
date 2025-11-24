import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/css/style.css";
import App from "./App.vue";
import router from "./router/index";
import { useAuthStore } from "./store/auth";
import i18n from "./i18n";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

// Initialize auth state on app start
const authStore = useAuthStore();
authStore.initializeAuth();

app.mount("#app");
