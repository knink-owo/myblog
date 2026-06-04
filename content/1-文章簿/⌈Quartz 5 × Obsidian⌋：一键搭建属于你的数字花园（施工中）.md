## 准备工作
如果之前下过的话可以跳过。
1. Git：前往官网 [Git](https://git-scm.com/) 下载
2. Node.js：前往官网 [Node.js](https://nodejs.org/zh-cn) 下载 
3. Obsidian：前往官网 [Obsidian](https://obsidian.md/zh/)下载
4. Github 账号：前往官网 [GitHub](https://github.com/) 注册（需梯子）
安装完成后打开终端输入以下命令，显示版本号则安装成功：
```cmd
git --version
node -v
npm -v
```

## 开始搭建
1. 创建博客项目文件夹，打开终端：
```cmd
# 克隆 Quartz 项目
git clone https://github.com/jackyzha0/quartz.git myblog
# 进入项目文件夹并安装依赖
cd myblog
npm i
# 初始化 Quartz 项目
npx quartz create
```
2. 本地预览博客，确保成功运行：在项目文件夹下终端输入 `npx quartz build --serve`。看到提示“Started a Quartz server...”后，在浏览器打开 `http://localhost:8080` 就能看到你的博客站点。按 `Ctrl + C` 可以停止预览。

## 用 Obsidian 管理博客
1. 打开 obsidian，选择打开本地文件夹作为仓库,选中刚才
