import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { languages } from './i18n'
import { defaultlocale } from './i18n'

const messages = Object.assign(languages)

const localStorageLang = localStorage.getItem('selectedLang')

const i18n = createI18n({
  legacy: false,
  locale: localStorageLang || defaultlocale,
  fallbackLocale: 'RU',
  messages
})

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(store)
app.use(autoAnimatePlugin)
app.mount('#app')
