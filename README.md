# mini-dashboard

羊羊百科的迷你控制中心。目前的主要功能有：

- 导入和导出动画剧集数据。
- 上传和管理特殊文件。

在羊羊本科的对应页面为[Project:迷你控制中心](https://xyy.huijiwiki.com/wiki/Project:迷你控制中心)。

## 测试

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

对于本项目，单独构建并没有什么用。在 Github 更新代码后，会自动构建并把常规网页代码放在 dist 分支中。一段时间后 JsDeliver 会同步 dist 分支中的代码，羊羊百科上的**Project:迷你控制中心**也会同步更新。

### 计划更新

- [x] 支持多语言。

### wikitext support for monaco-editor

#### tokenizer

- [ ] 斜体
- [ ] 粗体
- [ ] 粗体加斜体
- [x] 注释
- [ ] 内部链接
- [ ] 外部链接
- [x] 签名
- [x] nowiki 标签
- [x] html 标签
- [ ] 插入缩略图
- [ ] 不同级别的标题
- [x] 无序列表
- [x] 有序列表
- [x] 定义列表
- [x] 文本缩进
- [ ] 重定向
- [ ] 模板
- [ ] 表格
- [x] 分割线

#### formatter

- [ ] 无序列表
- [ ] 有序列表
- [ ] 定义列表
- [ ] 文本缩进