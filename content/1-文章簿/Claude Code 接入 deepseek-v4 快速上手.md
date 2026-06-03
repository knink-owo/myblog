---
title: Claude Code 接入 deepseek-v4 快速上手
node-colour: "#6b8a9e"
---

## 一、安装
官方推荐的 WinGet 安装：
1. 在“开始”菜单（点击 windows 图标进入）顶部搜索栏中输入PowerShell，在搜索结果中找到它。
2. 以管理员身份运行 PowerShell
3. 在 PowerShell 中输入 `winget install Anthropic.ClaudeCode`，开始安装ClaudeCode。
4. 安装完成后，关闭 PowerShell 窗口，再重新打开一个新的（普通权限）。
5. 验证安装 `claude --version`，若能正确显示版本号，则安装成功。

## 二、环境配置
这里使用 deepseek-v4 为例：
建议先使用临时配置后，在 powershell 中输入 `claude` 检查是否可以使用，若可以，再考虑设置永久配置。
### 1. 临时配置
只对当前命令台生效，每次打开都需要重新输入。
```powershell
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="sk-你的Key"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL="max"
```

### 2. 永久配置
推荐法二，方便一点。
#### 方法一：手动配置
1. 按下键盘上的 ** `Win` + `R` ** 键，打开“运行”对话框。
2. 输入 `sysdm.cpl` 并回车，打开“系统属性”。
3. 点击顶部的 **“高级”** 选项卡。
4. 点击右下角的 **“环境变量”** 按钮。
5. 在用户变量下点击**新建**。
6. 在弹出的对话框中，分别填写下列 **变量名** 和 **变量值**。

| 变量名                              | 变量值                                  | 说明                                               |
| -------------------------------- | ------------------------------------ | ------------------------------------------------ |
| `ANTHROPIC_BASE_URL`             | `https://api.deepseek.com/anthropic` | 将 API 请求地址指向 DeepSeek 的 Anthropic 兼容接口           |
| `ANTHROPIC_AUTH_TOKEN`           | `sk-你的Key`                           | DeepSeek API 密钥                                  |
| `ANTHROPIC_MODEL`                | `deepseek-v4-pro[1m]`                | 默认调用的模型                                          |
| `ANTHROPIC_DEFAULT_OPUS_MODEL`   | `deepseek-v4-pro[1m]`                | 最强（Opus）级别模型映射                                   |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | `deepseek-v4-pro[1m]`                | 平衡（Sonnet）级别模型映射                                 |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL`  | `deepseek-v4-flash`                  | 轻量（Haiku）级别模型映射                                  |
| `CLAUDE_CODE_SUBAGENT_MODEL`     | `deepseek-v4-flash`                  | 控制内部子代理使用的模型，用 v4-flash 加速辅助任务                   |
| `CLAUDE_CODE_EFFORT_LEVEL`       | `max` `low` `medium` 三选一             | 设置模型的“思考预算”，`max` 推理最深，`low` 效率最高，`medium` 平衡模式。 |


7. 添加完所有变量后，点击所有窗口的“确定”。  
注：需打开新的 PowerShell 窗口，新的环境变量才会生效。

#### 方法二：通过 PowerShell 配置
以管理员身份运行 PowerShell
```powershell
[Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://api.deepseek.com/anthropic", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "sk-你的新Key", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "deepseek-v4-pro[1m]", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_OPUS_MODEL", "deepseek-v4-pro[1m]", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_SONNET_MODEL", "deepseek-v4-pro[1m]", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_HAIKU_MODEL", "deepseek-v4-flash", "User")
[Environment]::SetEnvironmentVariable("CLAUDE_CODE_SUBAGENT_MODEL", "deepseek-v4-flash", "User")
[Environment]::SetEnvironmentVariable("CLAUDE_CODE_EFFORT_LEVEL", "max", "User")
```
运行后重启 PowerShell 终端即可。

## 三、绕过登录
因为 Claude Code 首次运行强制要求登录 Anthropic 官方账号，所以需要手动修改一个配置文件绕过它。
1. 找到配置文件：在 `C盘\用户\你的用户名` 下搜索 `.claude.json` 文件。（若文件不存在，则右键新建一个文本文件，将其改名为 `.claude.json`
2. 修改文件内容：打开该文件（可使用 VS Code），找到并确保其内容包含以下字段，并且使 `hasCompletedOnboarding` 的值是 `ture`（如果没有就手动添加）。
```json
{
    "hasCompletedOnboarding": true
}
```
3. 完成修改后，保存并关闭文件。
注：记得保存，拼写准确，确保是英文符号。（能复制就别手打）

## 四、开始使用
在终端中输入 `claude` 即可进入。
首次启动会让你选择主题，按自己喜好选择就行。

推荐一个 Claude code 实践项目 `claude-code-best-practice`，包含从入门到进阶各种使用技巧。
项目地址：https://github.com/shanraisshan
可以从 Pull requests 中找到项目 README.md 的中文版本。

---

相关：
[[Claude Code 命令参考（粗略）]]
[[Claude Code 高手之路（进行中）]]