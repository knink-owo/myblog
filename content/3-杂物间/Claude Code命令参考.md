> 完整命令列表请参考官方文档：[code.claude.com/docs/en/commands](https://code.claude.com/docs/en/commands)
## 命令参考

Claude Code 命令可分为 **CLI 命令**（启动终端）、**斜杠命令**（会话内）和 **快捷键**（会话内即时操作）三种类型[](https://developer.aliyun.com/article/1718322)。

### 一、CLI 命令（启动参数）

| 命令                              | 功能             | 示例                                                                                                                         |
| ------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `claude`                        | 在当前目录启动交互式会话   | `claude`                                                                                                                   |
| `claude [dir]`                  | 指定项目目录启动       | `claude /path/to/project` [](https://developer.aliyun.com/article/1735744)                                                  |
| `claude -p "query"` / `--print` | 一次性查询，执行后退出    | `claude -p "analyze errors"` [](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)                            |
| `cat \| claude -p`              | 通过管道传递内容       | `cat logs.txt \| claude -p "explain"` [](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)                   |
| `claude -c` / `--continue`      | 继续最近的一次会话      | `claude -c` [](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)                                             |
| `claude -r <id>` / `--resume`   | 通过会话 ID 恢复指定会话 | `claude -r abc123 "continue task"` [](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)                      |
| `claude --model <模型>`           | 指定模型启动         | `claude --model opus` [](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)                                   |
| `claude --add-dir <dir>`        | 添加额外工作目录       | `claude --add-dir ../lib` [](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)                               |
| `claude --version`              | 查看当前版本         | `claude --version` [](https://developer.aliyun.com/article/1735744)                                                         |
| `claude update`                 | 升级到最新版本        | `claude update` [](https://developer.aliyun.com/article/1735744)                                                            |
| `claude mcp`                    | 管理 MCP 服务器配置   | `claude mcp` [](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)                                            |
| `claude --append-system-prompt` | 追加系统提示词        | `claude --append-system-prompt "Always use TypeScript"` [](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/) |
| `claude --verbose`              | 启用详细日志         | `claude --verbose` [](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)                                      |

### 二、斜杠命令（会话内）

#### 会话管理

| 命令              | 功能                                                                           |
| --------------- | ---------------------------------------------------------------------------- |
| `/help`         | 查看所有命令列表和用法说明[](https://developer.aliyun.com/article/1732535)                |
| `/clear`        | 清空对话历史，完全重置上下文[](https://developer.aliyun.com/article/1718322)               |
| `/compact [指令]` | 压缩对话上下文，保留核心摘要，可选定向压缩[](https://developer.aliyun.com/article/1718322)        |
| `/status`       | 查看当前会话状态（版本、路径、模型、配置等）[](https://developer.aliyun.com/article/1732535)       |
| `/export`       | 将当前对话导出为 Markdown[](https://cloud.tencent.com.cn/developer/article/2673259)  |
| `/rewind`       | 回退代码和对话状态至指定节点[](https://cloud.tencent.com.cn/developer/article/2673259)     |
| `/branch`       | 对话分叉，尝试新方案后可不丢失原进度[](https://cloud.tencent.com.cn/developer/article/2673259) |

#### 项目配置

|命令|功能|
|---|---|
| `/init` |扫描项目并生成 CLAUDE.md（持久记忆文件）[](https://developer.aliyun.com/article/1718322)|
| `/memory` |直接编辑 CLAUDE.md 记忆文件[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/add-dir` |添加工作目录，让 AI 可访问更多文件夹[](https://developer.aliyun.com/article/1732535)|
| `/config` |进入交互式配置面板[](https://developer.aliyun.com/article/1732535)|
| `/hooks` |配置自动化钩子（如保存后自动格式化）[](https://developer.aliyun.com/article/1732535)|
| `/install-github-app` |接入 GitHub，打通 PR 和 Issue 流程[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/chrome` |配置 Chrome 集成，让 CC 启动浏览器做前端验证[](https://cloud.tencent.com.cn/developer/article/2673259)|

#### 模型与执行

|命令|功能|
|---|---|
| `/model [模型名]` |交互式切换模型（Sonnet/Opus/Haiku）[](https://developer.aliyun.com/article/1718322)|
| `/plan` |进入规划模式（只读），先列方案后执行[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/btw` |主任务运行时并行提问，不打断当前流程[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/loop` |定时重复执行任务[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/batch` |对多文件做大规模统一更改[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/effort` |调整模型思考深度[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/simplify` |三重代码审查，优化代码复杂度[](https://cloud.tencent.com.cn/developer/article/2673259)|

#### 监控诊断

|命令|功能|
|---|---|
| `/cost` |查看当前会话 token 消耗与费用[](https://developer.aliyun.com/article/1732535)|
| `/stats` |可视化每日用量趋势[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/insights` |生成月度使用分析报告[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/doctor` |诊断 API、依赖、权限、版本等环境问题[](https://developer.aliyun.com/article/1732535)|
| `/release-notes` |查看更新日志[](https://cloud.tencent.com.cn/developer/article/2673259)|

#### 高级功能

|命令|功能|
|---|---|
| `/remote-control` |手机远程操控 Claude Code[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/tasks` |查看和管理后台异步任务[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/skills` |列出当前可用的 Skill 扩展[](https://cloud.tencent.com.cn/developer/article/2673259)|
| `/permissions` |查看或调整工具权限批准设置[](https://skywork.ai/blog/claude-code-sdk-command-list-latest-reference/)|
| `/vim` |切换 Vim 模式[](https://skywork.ai/blog/claude-code-sdk-command-list-latest-reference/)|

### 三、快捷键

| 快捷键                        | 功能                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `Shift+Tab`                | 循环切换工作模式（Default → Auto-Accept → Plan）[](https://developer.aliyun.com/article/1735744) |
| `Ctrl+C`                   | 取消当前生成[](https://developer.aliyun.com/article/1718322)                                 |
| `Ctrl+R`                   | 搜索命令历史[](https://developer.aliyun.com/article/1718322)                                 |
| `Ctrl+B`                   | 将当前任务挂到后台运行[](https://cloud.tencent.cn/developer/article/2651283)                      |
| `Ctrl+L`                   | 清屏，不删除对话历史[](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)          |
| `Ctrl+D`                   | 退出会话[](https://apifox.com/apiskills/claude-code-cli-commands-tutorial/)                |
| `Esc` + `Esc`（/rewind）       | 回滚 AI 操作[](https://developer.aliyun.com/article/1716291)                               |
| `Ctrl+O`                   | 切换详细输出模式（查看 AI 思考过程）[](https://developer.aliyun.com/article/1716291)                   |
| `Ctrl+T`                   | 显示/隐藏任务列表面板[](https://developer.aliyun.com/article/1724549)                            |
| `Shift+Enter`              | 输入框内换行（跨平台通用）[](https://developer.aliyun.com/article/1716291)                          |
| `Ctrl+V`（Windows: `Alt+V`） | 粘贴截图给 Claude 分析 UI/报错                                                                  |

### 四、自定义斜杠命令

将 Markdown 文件放入 `.claude/commands/`（项目级）或 `~/.claude/commands/`（全局），文件名即为命令名。支持 `$ARGUMENTS` 接收参数[](https://cloud.tencent.cn/developer/article/2637673)。

示例 `.claude/commands/review.md`：

```markdown
---
description: 审查代码质量，检查类型安全、性能、安全和规范
---
审查以下代码，重点关注 TypeScript 类型安全、最佳实践、性能隐患和安全问题：
$ARGUMENTS
```

调用方式：`/review @src/components/Component.tsx` [](https://cloud.tencent.cn/developer/article/2637673)

### 五、三种工作模式
通过 `Shift+Tab` 循环切换。
- **Default（默认）**：每次修改文件和执行命令均需用户确认
- **Auto-Accept（自动接受）**：文件修改自动执行，shell 命令仍需确认
- **Plan（计划）**：纯只读模式，只做分析和规划，不修改代码

