(async () => {
  // eslint-disable-next-line no-undef
  if (import.meta.env.PROD && dev === "MediaWiki-Common.js") {
    // 此处代码只在生产环境且发现`dev`值为`MediaWiki-Common.js`时执行
    // 此时停止继续加载代码即可，剩下的交给篡改猴脚本
    throw new Error("检测到dev环境，停止加载prod代码");
    // 虽然并不推荐throw new Error，但是这是最简单的方法
  }
  // 获取vite构建的manifest.json文件
  let response = await fetch(
    "https://xyy-huijiwiki.github.io/mini-dashboard/.vite/manifest.json"
  );
  let data = await response.json();
  // 根据manifest.json文件获取入口文件的url
  let moduleUrl =
    "https://xyy-huijiwiki.github.io/mini-dashboard/" +
    data["index.html"]["file"];
  // 导入模块
  import(moduleUrl);
})();
