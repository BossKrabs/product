# 宇智波斑像素主题

深蓝、暗红与金色的 Harness 操作界面，中文像素字体，以及写轮眼旋转的约三秒启动动画。主题默认启用像素字体、首页人物背景和启动动画，每项均可独立关闭。

## 安装

已验证 DeepSeek Harness 0.2.1-rc.2 的 Windows 官方桌面端。通过应用的「插件 → 添加插件」选择本包的完整 .tgz 路径，安装后按提示启用。浏览器 WebUI 可执行：

```sh
dsh plugin --profile web add /path/to/dsh-madara-pixel-theme-1.0.0.tgz
```

在「设置 → 通用」中的「宇智波斑 · 像素主题」调整主题、首页人物与点阵、像素字体和启动动画。启动动画支持 Esc 跳过、重播、系统减少动态设置；其进度条为视觉效果，不能代表后台加载进度。关闭主题或卸载时移除样式与颜色覆盖，并恢复启用前的明暗模式。

主题和其他外观插件都可能覆盖界面颜色，建议一次只启用一个外观主题。本版本面向 Harness 0.2.1-rc.2 的界面结构；其他版本需重新验证。

## 源码与授权

运行时已包含编译好的 client.js，安装不运行构建脚本。源码执行 `node build.cjs` 可重新构建。所有资源本地加载；不联网下载字体，不读取会话或账号凭据。详见 LICENSE、ASSET-NOTICE.md 与 licenses/。

## 公开安装包

下载：https://github.com/BossKrabs/product/raw/refs/heads/main/dist/dsh-madara-pixel-theme-1.0.0.tgz

源码：https://github.com/BossKrabs/product/tree/main/packages/dsh-madara-pixel-theme
