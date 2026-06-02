## 安装
### 官方推荐的 WinGet 安装
以管理员身份运行 PowerShell
```powershell
winget install Anthropic.ClaudeCode
```
安装完成后，关闭 PowerShell 窗口，再重新打开一个新的（普通权限）。

验证安装：
```powershell
claude --version
```
若能正确显示版本号，则安装成功。

## 环境配置
这里使用 deepseek-v4 为例：
### 临时配置
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

### 永久配置
#### 方法一：手动配置
1. 按下键盘上的 ** `Win` + `R` ** 键，打开“运行”对话框。
2. 输入 `sysdm.cpl` 并回车，打开“系统属性”。
3. 点击顶部的 **“高级”** 选项卡。
4. 点击右下角的 **“环境变量”** 按钮。
5. 在用户变量下点击新建。
6. 在弹出的对话框中，分别填写 **变量名** 和 **变量值**，然后点击“确定”。

| 变量名                              | 变量值                                  | 说明                                     |
| -------------------------------- | ------------------------------------ | -------------------------------------- |
| `ANTHROPIC_BASE_URL`             | `https://api.deepseek.com/anthropic` | 将 API 请求地址指向 DeepSeek 的 Anthropic 兼容接口 |
| `ANTHROPIC_AUTH_TOKEN`           | `sk-你的Key`                           | DeepSeek API 密钥                        |
| `ANTHROPIC_MODEL`                | `deepseek-v4-pro[1m]`                | 默认调用的模型                                |
| `ANTHROPIC_DEFAULT_OPUS_MODEL`   | `deepseek-v4-pro[1m]`                | 最强（Opus）级别模型映射                         |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | `deepseek-v4-pro[1m]`                | 平衡（Sonnet）级别模型映射                       |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL`  | `deepseek-v4-flash`                  | 轻量（Haiku）级别模型映射                        |
| `CLAUDE_CODE_SUBAGENT_MODEL`     | `deepseek-v4-flash`                  | 控制内部子代理使用的模型，用 v4-flash 加速辅助任务         |
| `CLAUDE_CODE_EFFORT_LEVEL`       | `max`                                | 设置 Claude Code 的处理努力程度为最高（max），追求最佳质量  |

添加完所有变量后，点击所有窗口的“确定”关闭。  
需要重启之前打开的 PowerShell 窗口，新的环境变量才会生效。

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

## 使用
若前面配置成功，在终端中输入 `claude` 即可进入使用。

推荐一个 Claude code 实践项目 claude-code-best-practice，包含从入门到进阶各种使用技巧。
项目地址：https://github.com/shanraisshan
可以从 Pull requests 中找到项目的中文版本。