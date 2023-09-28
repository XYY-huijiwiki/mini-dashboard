# base64-file-manager

用于在羊羊百科上传base64编码的文件。这可以用于存档一些灰机wiki不允许上传的文件类型，原文件不会因为转码而被破坏。在羊羊本科的对应页面为[Project:上传特殊文件](https://xyy.huijiwiki.com/wiki/Project:上传特殊文件)。

## 测试

输入以下命令，启动测试。

```cmd
npm i
npm run dev
```

打开[Project:上传特殊文件](https://xyy.huijiwiki.com/wiki/Project:上传特殊文件)页面即可。如果是先打开页面，后执行命令，需要再刷新一次页面。

## 构建

输入以下命令，构建常规网页代码，放在 dist 文件夹内。

```cmd
npm i
npm run build
```

对于本项目，单独构建并没有什么用。在 Github 更新代码后，会自动构建并把常规网页代码放在 dist 分支中。一段时间后 JsDeliver 会同步 dist 分支中的代码，羊羊百科上的**Project:上传特殊文件**也会同步更新。

### 计划更新

- [x] 支持多语言。