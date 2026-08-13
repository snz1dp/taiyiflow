# 技能仓库与发布

> 这篇文档介绍太乙智启技能仓库的使用方法和技能发布流程。

## 远程技能仓库

太乙智启支持从远程仓库搜索、安装和管理技能。

默认仓库地址：`https://mirror-cn.clawhub.com`

## 仓库操作

### 搜索技能

```bash
./taiyiflow-cli skills search <keyword>
```

### 安装技能

```bash
./taiyiflow-cli skills install <skill-name>
```

### 更新技能

```bash
./taiyiflow-cli skills update <skill-name>
```

### 删除技能

```bash
./taiyiflow-cli skills remove <skill-name>
```

### TUI 中操作

在 `/skills` 弹窗的"远程仓库"标签页中，可直接浏览并执行安装、更新、删除操作。

## 发布技能

<!-- TODO: 补充技能发布到仓库的具体流程 -->

### 发布前检查

- [ ] SKILL.md 格式正确
- [ ] name 字段使用人类友好名称
- [ ] 技能内容经过测试验证
- [ ] 无敏感信息泄露

## 仓库源切换

<!-- TODO: 补充仓库源配置方法 -->

## 版本管理

<!-- TODO: 补充技能版本管理机制 -->
