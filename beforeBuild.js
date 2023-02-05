const fs = require('fs');
const moment = require('moment');
const path = require('path');

let appPath = path.join(__dirname, 'src', 'App.vue');
let text = fs.readFileSync(appPath, { encoding: 'utf-8' });


// 增加本地测试的注释掉
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

fs.writeFileSync(appPath, text);