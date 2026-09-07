<script setup lang="ts">
/**
 * 根路径导航链接
 *
 * 用于「开始对话」「软件下载」这类指向站点根目录（而非文档 base 路径）的外链。
 * themeConfig.nav 中的普通 link 会被 VitePress 的 normalizeLink -> withBase
 * 自动拼上 base（如 /taiyi/docs/），因此这里改用自定义组件直接渲染原生 <a>，
 * href 原样输出，从根目录开始。
 *
 * 通过 nav 的 NavItemComponent 形式使用：
 *   { component: 'RootNavLink', props: { text: '开始对话', href: '/taiyi/chat' } }
 *
 * 移动端抽屉菜单（VPNavScreenMenu）会额外传入 screen-menu 属性，
 * 据此切换为与 VPNavScreenMenuLink 一致的样式。
 */
defineProps<{
  text: string
  href: string
  screenMenu?: boolean
}>()
</script>

<template>
  <a
    class="RootNavLink vp-external-link-icon"
    :class="screenMenu ? 'screen-menu' : 'nav-bar'"
    :href="href"
    target="_blank"
    rel="noreferrer"
  >
    <span>{{ text }}</span>
  </a>
</template>

<style scoped>
/* 与默认主题 VPNavBarMenuLink 保持一致 */
.RootNavLink.nav-bar {
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.RootNavLink.nav-bar:hover {
  color: var(--vp-c-brand-1);
}

/* 与默认主题 VPNavScreenMenuLink 保持一致 */
.RootNavLink.screen-menu {
  display: block;
  padding: 12px 0 11px;
  border-bottom: 1px solid var(--vp-c-divider);
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition:
    border-color 0.25s,
    color 0.25s;
}

.RootNavLink.screen-menu:hover {
  color: var(--vp-c-brand-1);
}
</style>
