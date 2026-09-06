import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const basePath = process.env.VITEPRESS_BASE_PATH || '/taiyi/docs/'

const baseConfig = defineConfig({
  title: '太乙智启',
  description: '太乙智启 — 自主可控的多智能体与 RAG 应用平台官方文档',
  lang: 'zh-CN',
  base: basePath,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  vite: {
    optimizeDeps: {
      include: ['mermaid', 'fastdom']
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${basePath}favicon.png` }]
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: '太乙智启',

    nav: [
      { text: '产品概览', link: '/overview/what-is-taiyiflow' },
      { text: '快速上手', link: '/quick-start/' },
      { text: '场景方案', link: '/scenarios/' },

      { text: '集成开发', link: '/integration/overview' },
      { text: '厂商指南', link: '/vendor-guide/' },
      { text: '技能开发', link: '/skill-development/skill-basics' },
      { text: '参考手册', link: '/reference/api/stream' },
      { text: '开始对话', link: '/taiyif/chat', target: '_blank' },
      { text: '软件下载', link: '/taiyif/bundles/', target: '_blank' }
    ],

    sidebar: {
      '/overview/': [
        {
          text: '产品概览',
          items: [
            { text: '太乙智启是什么', link: '/overview/what-is-taiyiflow' },
            { text: '为什么选择太乙智启', link: '/overview/why-taiyiflow' },
            { text: '典型应用场景', link: '/overview/use-cases' },
            { text: '技术架构概览', link: '/overview/architecture-overview' },
            { text: '版本与授权', link: '/overview/editions-and-licensing' }
          ]
        }
      ],
      '/quick-start/': [
        {
          text: '快速上手',
          items: [
            { text: '选择你的角色', link: '/quick-start/' },
            { text: '业务人员：10 分钟体验', link: '/quick-start/for-business-user' },
            { text: '厂商：搭建集成 Demo', link: '/quick-start/for-vendor' }
          ]
        }
      ],
      '/scenarios/': [
        {
          text: '场景方案',
          items: [
            { text: '场景方案总览', link: '/scenarios/' },
            { text: '企业知识问答 / 智能客服', link: '/scenarios/intelligent-qa' },
            { text: '文档处理与报告生成', link: '/scenarios/document-processing' },
            { text: '业务流程自动化', link: '/scenarios/workflow-automation' },
            { text: '研发效能提升', link: '/scenarios/dev-assistant' },
            { text: '数据分析与洞察', link: '/scenarios/data-analysis' },
            { text: '会议纪要与语音助手', link: '/scenarios/meeting-voice-assistant' },
            { text: '营销内容生成', link: '/scenarios/content-marketing' },
            { text: '办公自动化 RPA', link: '/scenarios/office-rpa' },
            { text: '定时报告与监控播报', link: '/scenarios/scheduled-reports' },
            { text: '自定义场景搭建', link: '/scenarios/custom-scenario' }
          ]
        }
      ],

      '/integration/': [
        {
          text: '集成开发',
          items: [
            { text: '集成方式总览', link: '/integration/overview' }
          ]
        },
        {
          text: '一、业务层',
          collapsed: false,
          items: [
            { text: '集成核心概念', link: '/integration/concepts' }
          ]
        },
        {
          text: '二、应用层',
          collapsed: false,
          items: [
            { text: 'JS SDK 集成', link: '/integration/jssdk' },
            { text: '智能体前端集成与二次开发', link: '/integration/chatui' },
            { text: '集成代码示例', link: '/integration/examples' }
          ]
        },
        {
          text: '三、协议层',
          collapsed: false,
          items: [
            { text: '认证与鉴权', link: '/integration/authentication' },
            { text: '流式对话 API（SSE）', link: '/integration/stream-api' },
            { text: 'WebSocket 接口', link: '/integration/websocket-api' },
            { text: '客户端工具协议', link: '/integration/client-tool-protocol' },
            { text: '技能注入机制', link: '/integration/skill-injection' },
            { text: 'REST API 参考', link: '/integration/rest-api' }
          ]
        },
        {
          text: '厂商指南',
          items: [
            { text: '厂商合作总览', link: '/vendor-guide/' },
            { text: '基于太乙智启构建产品', link: '/vendor-guide/product-building' },
            { text: '多租户架构', link: '/vendor-guide/multi-tenancy' },
            { text: '白标定制', link: '/vendor-guide/white-label' },
            { text: '计费与配额管理', link: '/vendor-guide/billing-and-quota' },
            { text: 'OEM 分发与授权', link: '/vendor-guide/oem-distribution' },
            { text: '集成最佳实践', link: '/vendor-guide/best-practices' },
            { text: '厂商案例', link: '/vendor-guide/case-studies' }
          ]
        }
      ],
      '/vendor-guide/': [
        {
          text: '集成开发',
          items: [
            { text: '集成方式总览', link: '/integration/overview' },
            { text: '集成核心概念', link: '/integration/concepts' },
            { text: 'JS SDK 集成', link: '/integration/jssdk' },
            { text: '智能体前端集成与二次开发', link: '/integration/chatui' },
            { text: '集成代码示例', link: '/integration/examples' },
            { text: '认证与鉴权', link: '/integration/authentication' },
            { text: '流式对话 API（SSE）', link: '/integration/stream-api' },
            { text: 'WebSocket 接口', link: '/integration/websocket-api' },
            { text: '客户端工具协议', link: '/integration/client-tool-protocol' },
            { text: '技能注入机制', link: '/integration/skill-injection' },
            { text: 'REST API 参考', link: '/integration/rest-api' }
          ]
        },
        {
          text: '厂商指南',
          items: [
            { text: '厂商合作总览', link: '/vendor-guide/' },
            { text: '基于太乙智启构建产品', link: '/vendor-guide/product-building' },
            { text: '多租户架构', link: '/vendor-guide/multi-tenancy' },
            { text: '白标定制', link: '/vendor-guide/white-label' },
            { text: '计费与配额管理', link: '/vendor-guide/billing-and-quota' },
            { text: 'OEM 分发与授权', link: '/vendor-guide/oem-distribution' },
            { text: '集成最佳实践', link: '/vendor-guide/best-practices' },
            { text: '厂商案例', link: '/vendor-guide/case-studies' }
          ]
        }
      ],
      '/skill-development/': [
        {
          text: '技能开发',
          items: [
            { text: '技能是什么', link: '/skill-development/skill-basics' },
            { text: 'SKILL.md 编写规范', link: '/skill-development/skill-format' },
            { text: '技能生命周期', link: '/skill-development/skill-lifecycle' },
            { text: '浏览器录制固化技能', link: '/skill-development/browser-recording-skill' },
            { text: 'MCP 工具开发', link: '/skill-development/mcp-tools' },
            { text: '客户端工具开发', link: '/skill-development/client-tools' },
            { text: '技能仓库与发布', link: '/skill-development/skill-repo' },
            { text: '最佳实践', link: '/skill-development/best-practices' }
          ]
        }
      ],

      '/reference/': [
        {
          text: '参考手册',
          items: [
            {
              text: 'API 接口文档',
              items: [
                { text: '流式对话接口', link: '/reference/api/stream' },
                { text: '会话分组接口', link: '/reference/api/session' },
                { text: '语音相关接口', link: '/reference/api/voice' },
                { text: '运行时配置接口', link: '/reference/api/runtime-config' },
                { text: '数据结构字典', link: '/reference/api/data-structures' }
              ]
            },
            { text: '配置项参考', link: '/reference/config-reference' },
            { text: '术语表', link: '/reference/glossary' },
            { text: '更新日志', link: '/reference/changelog' },
            { text: '服务与支持', link: '/reference/sla-and-support' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/snz1/taiyiflow' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: '长沙慧码至一信息科技有限公司',
      copyright: '版权所有 © 2026'
    },

    outline: {
      label: '本页目录'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新于'
    }
  }
})

export default withMermaid(baseConfig, {
  mermaid: {
    theme: 'base',
    themeVariables: {
      primaryColor: '#e3f2fd',
      primaryTextColor: '#1a1a1a',
      primaryBorderColor: '#1976d2',
      lineColor: '#1976d2',
      secondaryColor: '#e0f2f1',
      tertiaryColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    themeCSS: '.node rect { rx: 4; ry: 4; }'
  },
  copy: {
    text: '复制',
    successText: '已复制'
  },
  download: {
    text: '下载',
    successText: '已下载'
  },
  preview: {
    text: '预览'
  },
  zoom: {
    text: '缩放',
    resetText: '重置'
  }
})
