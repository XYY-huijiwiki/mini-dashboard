const fs = require('fs');
const path = require('path');

// 查询所有组件路径
let files = [path.join(__dirname, 'src', 'App.vue')];
let components = fs.readdirSync(path.join(__dirname, 'src', 'components'));
components.forEach((element, index) => {
    components[index] = path.join(__dirname, 'src', 'components', element);
});
files = files.concat(components);
console.log(files);

// 删除全部本地测试的注释
files.forEach(element => {
    addComment(element);
});

// 增加本地测试的注释
function addComment(path) {
    let text = fs.readFileSync(path, { encoding: 'utf-8' });
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
    fs.writeFileSync(path, text);
}

// 导出js和css在固定位置
let vonPath = path.join(__dirname, 'dist', 'assets');
let nachPath = path.join(__dirname, 'xyy');
let list = fs.readdirSync(vonPath);
console.log(list);
list.forEach(element => {
    fs.copyFileSync(path.join(vonPath, element), path.join(nachPath, 'index' + path.extname(element)));
});