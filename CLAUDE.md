# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是基于 [Quartz v5](https://quartz.jzhao.xyz/) 的个人数字花园/博客。Quartz 是一套将 Markdown（Obsidian 笔记）发布为静态网站的工具集。

- **站点名称**: 墨水的花园
- **线上地址**: `knink-owo.github.io/myblog`
- **当前分支**: `v5`

## 常用命令

```bash
# 构建（输出到 public/）
npx quartz build

# 构建并本地预览 (http://localhost:8080)
npx quartz build --serve

# 构建 + 文件监听 + 热更新
npx quartz build --serve --watch

# 安装/更新社区插件（修改 quartz.config.yaml 的 plugins 后必须执行）
npx quartz plugin install

# 类型检查
npm run check          # tsc --noEmit + prettier --check

# 格式化
npm run format         # prettier --write

# 运行测试
npm run test           # tsx --test

# 性能分析
npm run profile        # 构建并生成火焰图
```

## 核心架构

### 构建流水线

```
Markdown 文件 → parseMarkdown → filterContent → emitContent → public/
```

1. **parse** (`quartz/processors/parse.ts`): Markdown → text transforms → MDAST (remark-parse) → HAST (remark-rehype)，支持多线程并行（workerpool）
2. **filter** (`quartz/processors/filter.ts`): 依次调用所有 filter 插件的 `shouldPublish` 方法
3. **emit** (`quartz/processors/emit.ts`): 分三阶段运行 emitter 插件 — ComponentResources → PageTypeDispatcher → 其他 emitters

### 四种插件类型 (`quartz/plugins/types.ts`)

- **Transformers** (transformer): 负责内容转换，可注册 `textTransform`（文本级）、`markdownPlugins`（MDAST 级）、`htmlPlugins`（HAST 级）。按 `order` 字段排序执行
- **Filters** (filter): 决定文件是否发布，只有一个方法 `shouldPublish`
- **Emitters** (emitter): 输出静态文件（HTML、RSS、sitemap 等）。支持 `partialEmit`（增量构建）和完整 `emit`
- **PageTypes** (pageType): 生成虚拟页面（tag pages、folder pages、bases pages 等），通过 `match` 匹配 slug，`generate` 生成虚拟页面，`body` 指定渲染组件

### 组件系统

- 基于 **Preact** (JSX)，所有组件定义在 `quartz/components/`
- 组件可附带 CSS (`css`)、before DOM 脚本 (`beforeDOMLoaded`)、after DOM 脚本 (`afterDOMLoaded`)
- 组件默认从社区插件加载，内置组件仅 Head、Spacer、Flex、ConditionalRender 等基础组件
- **Frames** (`quartz/components/frames/`): 页面框架模板，控制整体 HTML 结构布局

### 布局系统

`quartz.config.yaml` 的 `layout` 部分控制组件在各位置的排列：
- 位置：`left`、`right`、`beforeBody`、`afterBody`
- 位置内按 `priority` 排序（小的在前）
- 可按 pageType 覆盖布局（如 404 页面、folder 页面）
- Flex 组（toolbar）可将多个组件排列在一行

### SPA 模式

启用 `enableSPA: true` 后，页面间导航使用 micromorph 做 DOM 级 morph，不会重新加载。自定义事件 `nav`、`prenav`、`themechange` 定义在 `globals.d.ts`。

## 配置文件

| 文件 | 用途 |
|------|------|
| `quartz.config.yaml` | 站点配置 + 插件列表 + 布局 |
| `quartz.config.default.yaml` | 仅作参考，不会被加载 |
| `quartz.lock.json` | 插件版本锁定 |

## 自定义脚本

- `scripts/patch-graph-plugin.cjs` — 在 `npx quartz plugin install` 后运行，修补 graph 插件的 dist 文件：修复中文节点名显示、左键导航、右键展开邻居节点
- `scripts/patch-post-build.cjs` — 在 `npx quartz build` 后运行，修补打包后的 JS 输出：修复 graph 节点名回退逻辑和开发模式下的导航路径

## 内容组织

所有 Markdown 内容在 `content/` 目录下，使用 Obsidian 风格的 frontmatter（`tags`、`aliases`、`description` 等）：

- `content/0-日记本/` — 日记
- `content/1-文章簿/` — 文章
- `content/2-随笔集/` — 随笔
- `content/3-杂物间/` — 杂项

已启用的关键插件：Obsidian-flavored Markdown（wikilinks、callouts、mermaid）、语法高亮、LaTeX (KaTeX)、Graph 视图、加密页面、Excalidraw、TUI 等。

## 注意事项

- 修改 `quartz.config.yaml` 的 plugins 后需运行 `npx quartz plugin install` 同步插件
- `.quartz/` 目录存放社区插件的克隆源码，由 `quartz.lock.json` 锁定版本
- 调试本地预览时 graph 的导航路径可能不正确，post-build 脚本会处理此问题
- Node.js ≥ 22，npm ≥ 10.9.2
