import { createI18n } from 'vue-i18n'
import en from '../plugins/en.json'
import ku from '../plugins/ku.json'

// Get saved language from localStorage or default to English
const savedLocale = localStorage.getItem('locale') || 'en'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    ku
  }
})

export default i18n

