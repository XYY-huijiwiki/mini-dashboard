import { readFileSync } from "fs";

const file = readFileSync("./dist/manifest.json", "utf-8");
const json = JSON.parse(file);
const list = Object.keys(json).map((key) => {
  const value = json[key];
  return value.file;
});

list.forEach((element) => {
  let baseURL = `https://cdn.jsdelivr.net/gh/XYY-huijiwiki/mini-dashboard@dist/`;
  let url = baseURL + element;
  console.log(url);
  fetch(url);
});