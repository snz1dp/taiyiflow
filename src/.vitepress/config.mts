import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const basePath = process.env.VITEPRESS_BASE_PATH || '/'

const baseConfig = defineConfig({
  title: '太乙智启',
  description: '太乙智启 — 多智能体与 RAG 应用开发平台官方文档',
  lang: 'zh-CN',
  base: basePath,
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: '太乙智启文档',

    nav: [
      { text: '快速入门', link: '/getting-started/introduction' },
      { text: '用户指南', link: '/user-guide/desktop-app' },
      { text: '管理指南', link: '/admin-guide/deployment' },
      { text: '集成开发', link: '/integration/overview' },
      { text: '技能开发', link: '/skill-development/skill-basics' },
      { text: '贡献者', link: '/contributor-guide/architecture' },
      { text: 'API 参考', link: '/reference/api/stream' }
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: '快速入门',
          items: [
            { text: '太乙智启是什么', link: '/getting-started/introduction' },
            { text: '核心概念', link: '/getting-started/core-concepts' },
            { text: '安装与部署', link: '/getting-started/installation' },
            { text: '第一次对话', link: '/getting-started/first-conversation' }
          ]
        }
      ],
      '/user-guide/': [
        {
          text: '用户指南',
          items: [
            { text: '桌面客户端', link: '/user-guide/desktop-app' },
            { text: 'Web 对话界面', link: '/user-guide/web-chat' },
            { text: 'CLI 命令行工具', link: '/user-guide/cli-guide' },
            { text: '技能使用', link: '/user-guide/skills-usage' },
            { text: '知识库检索', link: '/user-guide/knowledge-base' },
            { text: '语音对话', link: '/user-guide/voice-interaction' },
            { text: '文件处理', link: '/user-guide/file-handling' },
            { text: '常见问题', link: '/user-guide/faq' }
          ]
        }
      ],
      '/admin-guide/': [
        {
          text: '管理指南',
          items: [
            { text: '部署架构与运维', link: '/admin-guide/deployment' },
            { text: '用户与权限管理', link: '/admin-guide/user-management' },
            { text: '大模型接入与配额', link: '/admin-guide/model-config' },
            { text: '可视化流程设计器', link: '/admin-guide/flow-designer' },
            { text: '知识库管理', link: '/admin-guide/knowledge-management' },
            { text: '监控与日志', link: '/admin-guide/monitoring' }
          ]
        }
      ],
      '/integration/': [
        {
          text: '集成开发指南',
          items: [
            { text: '集成方式总览', link: '/integration/overview' },
            { text: '认证与鉴权', link: '/integration/authentication' },
            { text: '流式对话 API', link: '/integration/stream-api' },
            { text: 'WebSocket 接口', link: '/integration/websocket-api' },
            { text: 'REST API 参考', link: '/integration/rest-api' },
            { text: 'JS SDK 集成', link: '/integration/jssdk' },
            { text: '客户端工具协议', link: '/integration/client-tool-protocol' },
            { text: '技能注入机制', link: '/integration/skill-injection' },
            { text: '集成示例', link: '/integration/examples' }
          ]
        }
      ],
      '/skill-development/': [
        {
          text: '技能开发指南',
          items: [
            { text: '技能是什么', link: '/skill-development/skill-basics' },
            { text: 'SKILL.md 编写规范', link: '/skill-development/skill-format' },
            { text: '技能生命周期', link: '/skill-development/skill-lifecycle' },
            { text: 'MCP 工具开发', link: '/skill-development/mcp-tools' },
            { text: '客户端工具开发', link: '/skill-development/client-tools' },
            { text: '技能仓库与发布', link: '/skill-development/skill-repo' },
            { text: '最佳实践', link: '/skill-development/best-practices' }
          ]
        }
      ],
      '/contributor-guide/': [
        {
          text: '贡献者指南',
          items: [
            { text: '系统架构总览', link: '/contributor-guide/architecture' },
            { text: '开发环境搭建', link: '/contributor-guide/dev-setup' },
            { text: '后端开发指南', link: '/contributor-guide/backend-dev' },
            { text: '前端开发指南', link: '/contributor-guide/frontend-dev' },
            { text: 'CLI 开发指南', link: '/contributor-guide/cli-dev' },
            { text: 'JS SDK 开发指南', link: '/contributor-guide/jssdk-dev' },
            { text: '数据库迁移', link: '/contributor-guide/database-migration' },
            { text: '编码规范与提交流程', link: '/contributor-guide/coding-standards' }
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
            { text: '更新日志', link: '/reference/changelog' }
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
      copyright: 'Copyright © 2024-present'
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
    theme: 'default',
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
