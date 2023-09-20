import mime from "mime/lite";

// 定义测试环境
const debug = import.meta.env.DEV;

async function file2base64(file: File): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  const fileBase64 = btoa(
    new Uint8Array(fileBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    ),
  );
  const fileExt = file.name.split(".").reverse()[0];
  const fileMIME = mime.getType(fileExt);
  if (!fileMIME) {
    $message.error(`未知文件类型：${fileExt}`);
    throw new Error(`未知文件类型：${fileExt}`);
  }
  const fileBase64Url = `data:${fileMIME};base64,${fileBase64}`;
  if (debug) {
    console.log("file2base64() return:");
    console.log(fileBase64Url.slice(0, 100));
  }
  return fileBase64Url;
}

export default file2base64;
