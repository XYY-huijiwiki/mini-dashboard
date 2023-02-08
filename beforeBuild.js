const fs = require('fs');
const moment = require('moment');
const path = require('path');

// 查询所有组件路径
let files = [path.join(__dirname, 'src', 'App.vue')];
let components = fs.readdirSync(path.join(__dirname, 'src', 'components'));
components.forEach((element, index) => {
    components[index] = path.join(__dirname, 'src', 'components', element);
});
files = files.concat(components);
console.log(files);

// 全部加上注释
files.forEach(element => {
    addComment(element);
});

// 增加本地测试的注释
function addComment(path) {
    let text = fs.readFileSync(path, { encoding: 'utf-8' });
    text = text.replace(
        /<!-- 本地测试（开始） -->/g,
        `<!-- 本地测试（开始） --><!--`
    );
    text = text.replace(
        /<!-- 本地测试（结束） -->/g,
        `--><!-- 本地测试（结束） -->`
    );
    text = text.replace(
        /\/\/ 本地测试（开始）/g,
        `/* 本地测试（开始）`
    );
    text = text.replace(
        /\/\/ 本地测试（结束）/g,
        `// 本地测试（结束）*/`
    );
    // 添加最后编译时间
    text = text.replace(
        /<n-p>最后编译时间：(.*?)<\/n-p>/,
        `<n-p>最后编译时间：${moment().format('lll')}</n-p>`
    );
    fs.writeFileSync(path, text);
}
