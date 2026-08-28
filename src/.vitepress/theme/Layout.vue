<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import MermaidLightbox from './components/MermaidLightbox.vue'
import { useMermaidClickPreview } from './composables/useMermaidClickPreview'
import { ref } from 'vue'

const lightboxRef = ref<InstanceType<typeof MermaidLightbox>>()

useMermaidClickPreview((svg) => {
  lightboxRef.value?.open(svg)
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <slot name="doc-before" />
    </template>
    <template #doc-after>
      <slot name="doc-after" />
    </template>
  </DefaultTheme.Layout>
  <MermaidLightbox ref="lightboxRef" />
</template>
