import mime from "mime/lite";
import message from "@/ts/message";

// 定义测试环境
let debug = import.meta.env.DEV;

async function file2base64(file: File): Promise<string> {
  let fileBuffer = await file.arrayBuffer();
  let fileBase64 = btoa(
    new Uint8Array(fileBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  let fileExt = file.name.split(".").reverse()[0]
  let fileMIME = mime.getType(fileExt);
  if (!fileMIME) {
    message.error(`未知文件类型：${fileExt}`);
    throw new Error(`未知文件类型：${fileExt}`);
  }
  let fileBase64Url = `data:${fileMIME};base64,${fileBase64}`;
  if (debug) {
    console.log("file2base64() return:");
    console.log(fileBase64Url.slice(0, 100));
  }
  return fileBase64Url;
}

export default file2base64;
