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

# 推荐配色方案

| 分类 | 颜色 | 色值 | 说明 |
|------|------|------|------|
| 📔 日记本 0-日记本/ | #a09080 | 暖灰褐 | 大量日记统一用这个，最收敛 |
| 📝 文章簿 1-文章簿/ | #6b8a9e | 灰蓝 | 稳重、正式感 |
| 🖊️ 随笔集 2-随笔集/ | #8aaa9a | 灰绿 | 文学气质，和 tertiary 同色系 |
| 📦 杂物间 3-杂物间/ | #9b8eab | 灰紫 | 柔和，表示"杂项" |
| 🏠 首页 index | var(--secondary) | 主题强调色 | 始终跟随明暗主题 |
| 🙋 关于我 | #7ea89d | 蓝绿 | 个人标识，有一点温度 |
| 📚 书架 | #b8956a | 茶褐 | 书籍/木质的联想 |
| 🔗 友链 | #e08f5c | 暖橙 | 已设置，最"跳"的颜色留给友链 |
| 🏷️ 专题 | #8d9ec6 | 灰紫蓝 | 知性，适合专题聚合页 |

---


## node-color 设置节点颜色

%%%
**日记**：用最不显眼的暖灰褐——量大、不抢眼、视觉上退后
**文章/随笔/杂物间**：用相邻色系（蓝-绿-紫），柔和区分但不冲突
**特殊页面**（关于/书架/友链/专题）：略微提亮，在图中一眼可辨
全部色值控制在中等明度（50%~65%），亮色模式和暗色模式下都可见
%%%
### 色板预览（待定）

| 分类  | 色块                                                                                                                         | 色值               |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 日记本 | <span style="background-color:#a09080; display:inline-block; width:60px; height:20px; border-radius:4px;"></span>          | #a09080          |
| 文章簿 | <span style="background-color:#6b8a9e; display:inline-block; width:60px; height:20px; border-radius:4px;"></span>          | #6b8a9e          |
| 随笔集 | <span style="background-color:#8aaa9a; display:inline-block; width:60px; height:20px; border-radius:4px;"></span>          | #8aaa9a          |
| 杂物间 | <span style="background-color:#9b8eab; display:inline-block; width:60px; height:20px; border-radius:4px;"></span>          | #9b8eab          |
| 首页  | <span style="background-color:var(--secondary); display:inline-block; width:60px; height:20px; border-radius:4px;"></span> | var(--secondary) |
| 关于我 | <span style="background-color:#7ea89d; display:inline-block; width:60px; height:20px; border-radius:4px;"></span>          | #7ea89d          |
| 书架  | <span style="background-color:#b8956a; display:inline-block; width:60px; height:20px; border-radius:4px;"></span>          | #b8956a          |
| 友链  | <span style="background-color:#e08f5c; display:inline-block; width:60px; height:20px; border-radius:4px;"></span>          | #e08f5c          |
| 专题  | <span style="background-color:#8d9ec6; display:inline-block; width:60px; height:20px; border-radius:4px;"></span>          | #8d9ec6          |
