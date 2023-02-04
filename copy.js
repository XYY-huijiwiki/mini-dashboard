const fs = require('fs');
const path = require('path');

let vonPath = path.join(__dirname, 'dist', 'assets');
let nachPath = path.join(__dirname, 'xyy');
let list = fs.readdirSync(vonPath);
console.log(list);
list.forEach(element => {
    fs.copyFileSync(path.join(vonPath, element), path.join(nachPath, element));
    fs.copyFileSync(path.join(vonPath, element), path.join(nachPath, 'index' + path.extname(element)));
});