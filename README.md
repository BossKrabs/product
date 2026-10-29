# Harness · 宇智波斑像素插件

两个分别安装的 DeepSeek Harness 插件。

| 插件 | 功能 | 源码 | 安装包 |
| --- | --- | --- | --- |
| 宇智波斑像素主题 | 深蓝暗红配色、中文像素字体、可跳过的写轮眼启动动画 | [主题](packages/dsh-madara-pixel-theme) | [1.0.0](dist/dsh-madara-pixel-theme-1.0.0.tgz) |
| 宇智波斑像素桌宠 | Windows x64 桌宠，16 组动作随 Harness 任务状态变化 | [桌宠](packages/dsh-madara-pixel-pet) | [1.0.0](dist/dsh-madara-pixel-pet-1.0.0.tgz) |

下载对应安装包后，在官方 Harness 的「插件 → 添加插件」中填写 .tgz 的完整本地路径，安装后启用。已验证 Harness 0.2.1-rc.2；详细用法、兼容范围和许可证见各子包 README。

主题和桌宠彼此独立。桌宠直接依赖 QCYTSN 原作者发布的 dsh-dafeiyu@0.1.22，不覆盖大肥鱼文件。首次安装依赖仍需要联网下载原作者的运行库。

本仓库不包含账号、会话或个人配置，不包含额外生成的预览图。角色外观为非官方同人制作，相关角色权利归各自权利人；项目代码、字体与依赖分别遵循各自许可证。

本地验证：主题启用、关闭、Esc 跳过、设置保存与清理；桌宠状态转发、配置、独立素材目录以及原生 Helper 的 ready/ping/shutdown 均已通过。打包清单和校验值见 dist/validation.json 与 dist/checksums.json。
