我也刚刚开始研究，本文暂时会比较杂乱。

### 保存聊天记录
#### 原生方法：
- **恢复最近的对话**：在项目目录下，直接输入 `claude -c` 就能继续上次的对话。
- **恢复指定的历史对话**：找到你想要恢复的那条记录的 `session_id`（例如 `abc123`），然后执行 `claude -r "abc123"` 即可继续。
	- `session_id` 位置：`此电脑/C 盘/用户/你的用户名/.claude/projects` 然后便可看到使用过 claude 的各个项目文件夹，里面有以 UUID 格式[^1]命名的 `.jsonl` 文件，文件名就是 `session_id`。（打开文件后，文件里也可找到 `session_id`）
#### 工具插件：claude-code-session-viewr
1. 检查 Node.js 版本：打开终端，输入 `node -v`。若看到版本号低于 18.17 或是提示 `command not found`，则运行 `winget upgrade OpenJS.NodeJS.LTS` 安装最新版 Node.js 。
2. 安装 ccsv
```bash
npm install -g claude-code-session-viewer
```
3. 使用：安装成功后，输入 `ccsv`，显示如下即为成功：
```cmd
PS C:\Users\ink14> ccsv

  ▲ Claude Code Session Viewer
  ▸ http://localhost:3838

  ▲ Next.js 14.2.18
  - Local:        http://127.0.0.1:3838
  - Network:      http://127.0.0.1:3838

 ✓ Starting...
 ✓ Ready in 63ms
```
在浏览器中打开 `http://127.0.0.1:3838`（摁住 `ctrl` 点击链接也可直接跳转）
![[Pasted image 20260604001142.png|634]]

[^1]: **通用唯一标识符**（Universally Unique Identifier）。它是一种 128 位的数字，通常用 32 个十六进制数字（加上 4 个连字符）表示，标准格式如下：
	xxxxxxxx-xxxx-4 xxx-yxxx-xxxxxxxxxxxx
	- **示例**：`550e8400-e29b-41d4-a716-446655440000`
