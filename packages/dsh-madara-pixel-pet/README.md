# 宇智波斑像素桌宠

带有红甲、长发和写轮眼的像素风宇智波斑原生桌面伴侣。支持待机眨眼、思考、结印工作、搜索张望、等待、完成、错误、拖拽、落地、摸头、戳动及空闲动作，共 16 组。任务状态直接来自 Harness 会话事件。

## 安装与使用

支持 Windows x64，已验证 Harness 0.2.1-rc.2。通过官方桌面应用的「插件 → 添加插件」选择 dsh-madara-pixel-pet-1.0.0.tgz，安装后启用。依赖会从原作者的 dsh-dafeiyu@0.1.22 自动安装；无需单独启用大肥鱼 bundle。

在本插件的配置中调整角色大小、气泡大小、空闲动作频率、减少动态、提示音和气泡显示。角色可拖动，松手播放落地；不同位置点击或双击触发互动。随 Harness 启动和退出。

如果已经启用原版大肥鱼，两者会各显示一个角色。只想保留斑时，在插件管理中关闭大肥鱼，保留本插件。关闭或卸载本插件会停止斑的进程；设置、日志和本地运行库保留供重装使用。

本插件不会修改大肥鱼文件，也不需要管理员权限。运行目录是 DSH_HOME/plugins/madara-pixel-pet；未指定 DSH_HOME 时使用 ~/.dsh/plugins/madara-pixel-pet。首次启动会把原作者预编译运行库和本包的像素帧复制到独立目录。首次联网安装仍需下载上游依赖；运行时不调用图像生成或模型 API。

## 状态与隐私

显示真实会话任务、工具调用和待办状态。不读取屏幕，不读取或发布账号凭据。内部错误被限制在本插件内，避免阻断 Harness 的其他会话事件订阅。

## 来源与授权

原生运行库、任务状态转换和进程管理来自 QCYTSN/dsh-dafeiyu；本包新增独立的像素斑素材、动作清单、运行目录及生命周期与配置接入。详见 THIRD-PARTY-NOTICES.md、ASSET-NOTICE.md 和 LICENSE。人物是非官方同人外观。

## 公开安装包

下载：https://github.com/BossKrabs/product/raw/refs/heads/main/dist/dsh-madara-pixel-pet-1.0.0.tgz

源码：https://github.com/BossKrabs/product/tree/main/packages/dsh-madara-pixel-pet
