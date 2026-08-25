import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeCarousel from './components/HomeCarousel.vue'
import HomeTabs from './components/HomeTabs.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeCarousel', HomeCarousel)
    app.component('HomeTabs', HomeTabs)
  }
} satisfies Theme
