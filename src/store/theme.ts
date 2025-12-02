import { defineStore } from "pinia";
import { ref } from "vue";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

const getSystemTheme = (): ThemeMode =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const applyThemeToDocument = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", mode);
  root.classList.toggle("theme-dark", mode === "dark");
  root.classList.toggle("theme-light", mode === "light");
};

export const useThemeStore = defineStore("theme", () => {
  const theme = ref<ThemeMode>("light");

  const setTheme = (mode: ThemeMode) => {
    theme.value = mode;
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    applyThemeToDocument(mode);
  };

  const toggleTheme = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
  };

  const initializeTheme = () => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const initial = saved === "light" || saved === "dark" ? saved : getSystemTheme();
    setTheme(initial);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    initializeTheme,
  };
});
