const fs = require('fs');
const path = require('path');

let vonPath = path.join(__dirname, 'dist', 'assets');
let nachPath = path.join(__dirname, 'xyy');
let list = fs.readdirSync(vonPath);
console.log(list);
list.forEach(element => {
    fs.copyFileSync(path.join(vonPath, element), path.join(nachPath, 'index' + path.extname(element)));
});

// 取消本地测试的注释
let appPath = path.join(__dirname, 'src', 'App.vue');
let text = fs.readFileSync(appPath, { encoding: 'utf-8' });
text = text.replace(
    /<!-- 本地测试（开始） --><!--/g,
    `<!-- 本地测试（开始） -->`
);
text = text.replace(
    /--><!-- 本地测试（结束） -->/g,
    `<!-- 本地测试（结束） -->`
);
text = text.replace(
    /\/\* 本地测试（开始）/g,
    `// 本地测试（开始）`
);
text = text.replace(
    /\/\/ 本地测试（结束）\*\//g,
    `// 本地测试（结束）`
);

fs.writeFileSync(appPath, text);