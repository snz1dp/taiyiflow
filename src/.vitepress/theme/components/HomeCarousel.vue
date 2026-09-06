<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'

interface Slide {
  image: string
  title: string
  subtitle: string
}

const slides: Slide[] = [
  {
    image: '/hero-slides/slide-workflow.png',
    title: '业务流程自动化',
    subtitle: '代码开发、文档处理、工单分类、审批辅助，释放人力'
  },
  {
    image: '/hero-slides/slide-multidevice.png',
    title: '多端覆盖',
    subtitle: '桌面客户端、Web、小程序、CLI 多种使用方式，覆盖所有角色'
  },
  {
    image: '/hero-slides/slide-security.png',
    title: '私有化部署 · 数据安全',
    subtitle: '数据不出内网，满足信创与合规要求'
  },
  {
    image: '/hero-slides/slide-agents.png',
    title: '多智能体协同',
    subtitle: '多个 AI 智能体协作完成复杂任务，自主规划、分工执行'
  }
]

const currentIndex = ref(0)
const isTransitioning = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function next() {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentIndex.value = (currentIndex.value + 1) % slides.length
  setTimeout(() => { isTransitioning.value = false }, 600)
}

function prev() {
  if (isTransitioning.value) return
  isTransitioning.value = true
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
  setTimeout(() => { isTransitioning.value = false }, 600)
}

function goTo(index: number) {
  if (isTransitioning.value || index === currentIndex.value) return
  isTransitioning.value = true
  currentIndex.value = index
  setTimeout(() => { isTransitioning.value = false }, 600)
}

function startAutoplay() {
  stopAutoplay()
  timer = setInterval(next, 4000)
}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <section class="home-carousel" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <div class="carousel-container">
      <!-- 图片区域 -->
      <div class="carousel-viewport">
        <div
          class="carousel-track"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div v-for="(slide, idx) in slides" :key="idx" class="carousel-slide">
            <a :href="withBase('/overview/what-is-taiyiflow')" :title="`了解${slide.title}`">
              <img :src="withBase(slide.image)" :alt="slide.title" loading="lazy" />
            </a>
          </div>
        </div>

        <!-- 左右箭头 -->
        <button class="carousel-arrow carousel-arrow-left" @click="prev" aria-label="上一张">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button class="carousel-arrow carousel-arrow-right" @click="next" aria-label="下一张">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <!-- 文字 + 指示器 -->
      <div class="carousel-info">
        <transition name="fade" mode="out-in">
          <div :key="currentIndex" class="carousel-text">
            <h3>{{ slides[currentIndex].title }}</h3>
            <p>{{ slides[currentIndex].subtitle }}</p>
          </div>
        </transition>
        <div class="carousel-dots">
          <button
            v-for="(slide, idx) in slides"
            :key="idx"
            class="dot"
            :class="{ active: idx === currentIndex }"
            @click="goTo(idx)"
            :aria-label="`跳转到第 ${idx + 1} 张`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-carousel {
  padding: 0.5rem 12px 1rem;
  margin: 0 auto;
}

.carousel-container {
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.carousel-viewport {
  position: relative;
  overflow: hidden;
  aspect-ratio: 21 / 9;
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
}

.carousel-slide a {
  display: block;
  width: 100%;
  height: 100%;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s, background 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.home-carousel:hover .carousel-arrow {
  opacity: 1;
}

.carousel-arrow:hover {
  background: #fff;
}

.carousel-arrow-left {
  left: 12px;
}

.carousel-arrow-right {
  right: 12px;
}

.carousel-info {
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.carousel-text h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.carousel-text p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.carousel-dots {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--vp-c-text-3);
  opacity: 0.4;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.dot.active {
  opacity: 1;
  background: var(--vp-c-brand-1);
  width: 20px;
  border-radius: 4px;
}

/* 文字切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 暗色模式适配 */
.dark .carousel-container {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.dark .carousel-arrow {
  background: rgba(48, 48, 48, 0.85);
  color: #e0e0e0;
}

.dark .carousel-arrow:hover {
  background: rgba(66, 66, 66, 0.95);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .home-carousel {
    padding: 1rem 0.75rem 2rem;
  }

  .carousel-viewport {
    aspect-ratio: 16 / 9;
  }

  .carousel-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .carousel-text h3 {
    font-size: 1rem;
  }
}
</style>
