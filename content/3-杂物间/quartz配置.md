---
publish: false
draft: ture
node-colour: "#9b8eab"
---

 [documentation](https://quartz.jzhao.xyz) 
 
```
#进入
cd D:Blog/myblog/quartz
#更新
npx quartz sync
#预览
npx quartz build --serve
```

  
  │ 写/改文章、日记、图片  │ npx quartz sync                 
  
  │改任何代码、样式、配置 │ git add + git commit + git push 
 
## 前置

| 场地    | 钥匙                                               | 描述                                                                                                            |
| ----- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| 标题    | `title`                                          | 页面标题。如果是空的，会退回到文件名。                                                                                           |
| 描述    | `description`                                    | 元数据和搜索的页面描述。                                                                                                  |
| 标签    | `tags`,`tag`                                     | 分类标签。与文件路径相同的字条化方式：空格变为 变为 变为 变为 ，标签小写，使得 和 结算到同一个标签页（匹配 Obsidian）。`-``&``-and-``%``-percent``#MyTag``#mytag` |
| 别名    | `aliases`,`alias`                                | 页面的替代名称，用于链接解析。                                                                                               |
| 永久链接  | `permalink`                                      | 自定义URLslug。也加入了别名。                                                                                            |
| CSS 类 | `cssclasses`,`cssclass`                          | CSS 类应用到页面正文。                                                                                                 |
| 社会形象  | `socialImage`, ,`image``cover`                   | 图片用于社交媒体预览。                                                                                                   |
| 社会描述  | `socialDescription`                              | 描述专门用于社交媒体预览。                                                                                                 |
| 创建日期  | `created`,`date`                                 | 当便条被创建时。                                                                                                      |
| 修改日期  | `modified`, , ,`lastmod``updated``last-modified` | 笔记最后修改的时间。如果未设定，则会退回。`created`                                                                                |
| 出版日期  | `published`, ,`publishDate``date`                | 当那张纸条被发布时。                                                                                                    |
| 发布    | `publish`                                        | 是否应该公开这份笔记。                                                                                                   |
| 选秀    | `draft`                                          | 无论这条便条是否是草稿。                                                                                                  |
| 评论    | `comments`                                       | 笔记是否启用了评论。                                                                                                    |
| 语言    | `lang`                                           | 这张纸条的语言代码。                                                                                                    |
| 启用目录  | `enableToc`                                      | 是否展示目录。                                                                                                       |