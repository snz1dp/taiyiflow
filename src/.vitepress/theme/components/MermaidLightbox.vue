<template>
  <Teleport to="body">
    <Transition name="mermaid-lightbox">
      <div v-if="visible" class="mermaid-lightbox-overlay" @click.self="close" @wheel.prevent="onWheel">
        <!-- 工具栏 -->
        <div class="mermaid-lightbox-toolbar">
          <button class="mlb-btn" title="放大" @click="zoomIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <button class="mlb-btn" title="缩小" @click="zoomOut">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <button class="mlb-btn" title="重置" @click="resetZoom">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          <button class="mlb-btn" title="下载 PNG" @click="downloadPng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <span class="mlb-zoom-label">{{ Math.round(scale * 100) }}%</span>
          <button class="mlb-btn mlb-close" title="关闭 (Esc)" @click="close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- 图片容器 -->
        <div
          class="mermaid-lightbox-content"
          :style="{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }"
          @mousedown.prevent="startDrag"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="Mermaid 图表预览" draggable="false" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const visible = ref(false)
const imageUrl = ref('')
const scale = ref(1)
const pan = ref({ x: 0, y: 0 })

const MIN_SCALE = 0.2
const MAX_SCALE = 5
const ZOOM_STEP = 0.15

let isDragging = false
let dragStart = { x: 0, y: 0 }
let panStart = { x: 0, y: 0 }

function open(svgElement: SVGSVGElement) {
  const clone = svgElement.cloneNode(true) as SVGSVGElement
  // 确保有明确的宽高
  const rect = svgElement.getBoundingClientRect()
  const w = Math.max(rect.width, 400)
  const h = Math.max(rect.height, 300)
  clone.setAttribute('width', String(w))
  clone.setAttribute('height', String(h))
  clone.style.maxWidth = 'none'

  const svgString = new XMLSerializer().serializeToString(clone)
  imageUrl.value = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
  scale.value = 1
  pan.value = { x: 0, y: 0 }
  visible.value = true

  nextTick(() => {
    document.body.style.overflow = 'hidden'
  })
}

function close() {
  visible.value = false
  imageUrl.value = ''
  document.body.style.overflow = ''
}

function zoomIn() {
  scale.value = Math.min(scale.value + ZOOM_STEP, MAX_SCALE)
}

function zoomOut() {
  scale.value = Math.max(scale.value - ZOOM_STEP, MIN_SCALE)
}

function resetZoom() {
  scale.value = 1
  pan.value = { x: 0, y: 0 }
}

function onWheel(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
  scale.value = Math.min(Math.max(scale.value + delta, MIN_SCALE), MAX_SCALE)
}

function startDrag(e: MouseEvent) {
  isDragging = true
  dragStart = { x: e.clientX, y: e.clientY }
  panStart = { ...pan.value }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!isDragging) return
  pan.value = {
    x: panStart.x + (e.clientX - dragStart.x),
    y: panStart.y + (e.clientY - dragStart.y)
  }
}

function stopDrag() {
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function onKeydown(e: KeyboardEvent) {
  if (!visible.value) return
  if (e.key === 'Escape') close()
  if (e.key === '+' || e.key === '=') zoomIn()
  if (e.key === '-') zoomOut()
  if (e.key === '0') resetZoom()
}

function downloadPng() {
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ratio = 2 // 2x 清晰度
    canvas.width = img.naturalWidth * ratio
    canvas.height = img.naturalHeight * ratio
    const ctx = canvas.getContext('2d')!
    // 白色背景
    const isDark = document.documentElement.classList.contains('dark')
    ctx.fillStyle = isDark ? '#1e1e1e' : '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const link = document.createElement('a')
    link.download = 'mermaid-diagram.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  img.src = imageUrl.value
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})

defineExpose({ open, close })
</script>
