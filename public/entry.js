(async () => {
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
  // eslint-disable-next-line no-undef
  mw.loader.load(moduleUrl);
})();
