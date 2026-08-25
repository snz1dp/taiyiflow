<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

const tabs = [
  { key: 'why', label: '为什么选择太乙智启' },
  { key: 'scenarios', label: '典型应用场景' },
  { key: 'links', label: '快速链接' }
]

const activeTab = ref('why')

const advantages = [
  { title: '自主可控', desc: '核心代码自主掌握，不受单一厂商锁定，满足信创与合规要求', icon: '🛡️' },
  { title: '模型不锁定', desc: '支持接入任意大模型（国产/国际），按任务灵活切换组合', icon: '🔀' },
  { title: '私有化部署', desc: '数据不出内网，支持 Docker / K8s / 离线环境部署', icon: '🏠' },
  { title: '多端覆盖', desc: '桌面客户端、Web、CLI 终端三种使用方式，覆盖所有角色', icon: '📱' },
  { title: '开放集成', desc: 'SSE / WebSocket / REST / JS SDK 四种接入方式，5 分钟嵌入现有系统', icon: '🔌' },
  { title: '技能扩展', desc: '声明式技能包 + MCP 协议，能力边界持续扩展', icon: '🧩' }
]

const scenarios = [
  { title: '智能客服 / 知识问答', desc: '员工和客户用自然语言获取准确答案，减少重复咨询', icon: '🤖', link: '/scenarios/intelligent-qa' },
  { title: '文档处理与报告生成', desc: '合同审查、报告摘要、文档比对，从小时级降到分钟级', icon: '📄', link: '/scenarios/document-processing' },
  { title: '业务流程自动化', desc: '工单分类、审批辅助、邮件自动回复，释放人力', icon: '⚙️', link: '/scenarios/workflow-automation' },
  { title: '研发效能提升', desc: '代码生成、Review 辅助、技术文档整理', icon: '🚀', link: '/scenarios/dev-assistant' }
]

const quickLinks = [
  { title: '产品概览', desc: '3 分钟了解太乙智启', icon: '📖', link: '/overview/what-is-taiyiflow' },
  { title: '快速上手', desc: '按角色选择你的路径', icon: '🚀', link: '/quick-start/' },
  { title: '场景方案', desc: '找到你的业务场景', icon: '🎯', link: '/scenarios/' },
  { title: '集成开发', desc: 'API 与 SDK 接入', icon: '🔌', link: '/integration/overview' },
  { title: '厂商指南', desc: '基于太乙智启构建产品', icon: '🏢', link: '/vendor-guide/' },
  { title: '更新日志', desc: '了解最新版本', icon: '📋', link: '/reference/changelog' }
]
</script>

<template>
  <section class="home-tabs">
    <div class="tabs-header">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tabs-body">
      <!-- 为什么选择太乙智启 -->
      <div v-if="activeTab === 'why'" class="tab-panel">
        <div class="card-grid">
          <div v-for="item in advantages" :key="item.title" class="card">
            <span class="card-icon">{{ item.icon }}</span>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <!-- 典型应用场景 -->
      <div v-if="activeTab === 'scenarios'" class="tab-panel">
        <div class="card-grid card-grid-2col">
          <a
            v-for="item in scenarios"
            :key="item.title"
            :href="withBase(item.link)"
            class="card card-link"
          >
            <span class="card-icon">{{ item.icon }}</span>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
            <span class="card-arrow">查看方案 →</span>
          </a>
        </div>
      </div>

      <!-- 快速链接 -->
      <div v-if="activeTab === 'links'" class="tab-panel">
        <div class="card-grid card-grid-3col">
          <a
            v-for="item in quickLinks"
            :key="item.title"
            :href="withBase(item.link)"
            class="card card-link"
          >
            <span class="card-icon">{{ item.icon }}</span>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-tabs {
  max-width: 1152px;
  margin: 0 auto;
  padding: 1rem 1.5rem 3rem;
}

.tabs-header {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--vp-c-divider);
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 0.6rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--vp-c-brand-1);
}

.tab-btn.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card-grid-2col {
  grid-template-columns: repeat(2, 1fr);
}

.card-grid-3col {
  grid-template-columns: repeat(3, 1fr);
}

.card {
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  border-color: var(--vp-c-brand-soft);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.card-link:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}

.card-icon {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.card h4 {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.card p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.card-arrow {
  display: inline-block;
  margin-top: 0.6rem;
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .card-grid,
  .card-grid-2col,
  .card-grid-3col {
    grid-template-columns: 1fr;
  }

  .tabs-header {
    overflow-x: auto;
  }

  .home-tabs {
    padding: 1rem 0.75rem 2rem;
  }
}
</style>
