# mini-dashboard

羊羊百科的迷你控制中心。目前的主要功能有：

- 导入和导出动画剧集数据。
- 上传和管理特殊文件。
- 批量删除或恢复页面。

在羊羊本科的对应页面为[Project:迷你控制中心](https://xyy.huijiwiki.com/wiki/Project:迷你控制中心)。

## 开发测试

要求：
- Node.js 版本：20.0.0+
- 浏览器插件：[篡改猴](https://www.tampermonkey.net)
- 篡改猴脚本：[Dev-Toggle-for-GitHub-Code](https://github.com/XYY-huijiwiki/Dev-Toggle-for-GitHub-Code)

> [!NOTE]
> 结束测试后记得关闭篡改猴脚本，否则默认js将无法加载。

输入以下命令，启动测试。

```cmd
npm i
npm run dev
```

根据提示打开对应页面即可。

## 构建

输入以下命令，构建常规网页代码，放在 dist 文件夹内。

```cmd
npm i
npm run build
```

对于本项目，单独构建并没有什么用。在 Github 更新代码后，会自动构建并把常规网页代码同步到 GitHub Pages 上，羊羊百科上的**Project:迷你控制中心**也会同步更新。
