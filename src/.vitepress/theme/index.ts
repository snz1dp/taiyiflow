import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeCarousel from './components/HomeCarousel.vue'
import HomeTabs from './components/HomeTabs.vue'
import RootNavLink from './components/RootNavLink.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeCarousel', HomeCarousel)
    app.component('HomeTabs', HomeTabs)
    // 供 themeConfig.nav 以 { component: 'RootNavLink' } 形式使用
    app.component('RootNavLink', RootNavLink)
  }
} satisfies Theme
