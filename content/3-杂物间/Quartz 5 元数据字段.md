---
node-colour: "#9b8eab"
---


## 📋 完整速查表

| 字段                         | 别名                              | 类型                | 作用                                  | 你的配置状态     |
| -------------------------- | ------------------------------- | ----------------- | ----------------------------------- | ---------- |
| title                      | —                               | string            | 页面标题，显示在 `<h1>` 和浏览器标签              | 默认可用       |
| description                | —                               | string            | 页面描述，用于 SEO、搜索、RSS                  | 默认可用       |
| socialDescription          | —                               | string            | 社交媒体预览专属描述，优先于 description          | 默认可用       |
| tags                       | tag                             | string / string[] | 分类标签，逗号分隔，自动 slug 化                 | 默认可用       |
| aliases                    | alias                           | string / string[] | 替代名称，自动生成重定向页                       | 默认可用       |
| permalink                  | —                               | string            | 自定义 URL 路径，自动作为别名                   | 默认可用       |
| cssclasses                 | cssclass                        | string / string[] | 注入到 `<article>` 的 CSS 类名            | ✅ 你用在友链.md |
| socialImage                | image, cover                    | string (路径/URL)   | 社交媒体预览封面图                           | 默认可用       |
| created                    | date                            | 日期                | 创建日期。来源优先级：frontmatter → git → 文件系统 | ✅ 已启用      |
| modified                   | lastmod, updated, last-modified | 日期                | 最后修改日期。未设时回退到 created               | ✅ 已启用      |
| published                  | publishDate, date               | 日期                | 发布日期。用于 RSS `<pubDate>`             | ✅ 已启用      |
| draft                      | —                               | boolean           | true 时页面不发布，从构建输出中排除                | ✅ 已启用      |
| unlisted                   | —                               | boolean           | true 时隐藏页面——不在目录/搜索/图谱中出现，但可直链访问    | ✅ 已启用      |
| publish                    | —                               | boolean           | 显式发布标志（仅当 explicit-publish 插件开启）    | ❌ 你关闭了     |
| password                   | 可配置（默认 password）                | string            | 设置后页面加密，访问需输密码                      | ✅ 已启用      |
| stealth                    | —                               | boolean           | 配合加密：true 时页面完全不可见直到解密              | ✅ 已启用      |
| enableToc                  | —                               | boolean           | false 时隐藏本页目录                       | 默认可用       |
| comments                   | —                               | boolean           | 控制本页评论区开/关                          | ❌ 评论插件已关   |
| lang                       | —                               | string（如 zh-CN）   | 页面级语言代码（目前无内置消费者）                   | 无人使用       |
| quartz-properties          | quartzProperties                | boolean           | 强制显示/隐藏属性面板                         | 默认可用       |
| quartz-properties-collapse | quartzPropertiesCollapse        | boolean           | 属性面板初始折叠/展开                         | 默认可用       |

---

## 📝 分类说明

### 1. 基础标识

| 字段 | 说明 |
|------|------|
| title | 页面标题，全站引用（目录、搜索、图谱、RSS……），未设时回退到文件名 |
| description | 摘要，影响搜索排序和 SEO；未设时自动取正文前 150 字符 |
| socialDescription | 仅社交预览用，优先级高于 description |

### 2. 组织分类

| 字段 | 说明 |
|------|------|
| tags | 分类标签，#标签 格式的内联标签也会自动合并；注意标签会被 slug 化（小写、空格→连字符、&→and、%→percent） |
| aliases | 别名，每个别名生成 HTML 重定向页，链接到正确页面 |
| permalink | 自定义 URL，同样生成重定向 |

### 3. 显示控制

| 字段                         | 说明                                         |
| -------------------------- | ------------------------------------------ |
| cssclasses                 | 注入到 `<article class="popover-hint + 你的类">` |
| socialImage                | 自定义 OG 图路径                                 |
| enableToc                  | 本页是否生成目录                                   |
| quartz-properties          | 控制属性面板可见性                                  |
| quartz-properties-collapse | 属性面板默认折叠/展开                                |

### 4. 日期（created-modified-date 插件）

| 字段 | 说明 |
|------|------|
| created | 创建日期，来源优先级：frontmatter → git → filesystem |
| modified | 修改日期，未设→回退 created→回退链 |
| published | 发布日期，RSS 使用 |

### 5. 可见性控制

| 字段 | 你启用的插件 | 行为 |
|------|--------------|------|
| draft: true | remove-draft ✅ | 不发布（排除出构建） |
| unlisted: true | unlisted-pages ✅ | 隐藏——不在目录/搜索/图谱出现，URL 可直链 |
| publish: true/false | explicit-publish ❌ | 你关闭了此插件，不起作用 |
| password: "xxx" | encrypted-pages ✅ | AES-256-GCM 加密，客户端输密码解密 |
| stealth: true | encrypted-pages ✅ | 配合加密，加密前页面完全不暴露 |
