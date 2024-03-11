/*
    this ts file export a function that checks if the real file extension is (basically) the same as that in the file name.
*/

import { fileTypeFromBuffer } from "file-type";
import { Buffer } from "buffer";

window.Buffer = Buffer;

async function checkFileExt(file: File): Promise<boolean> {
  // define dev environment (for console.log())
  const dev = import.meta.env.DEV;
  dev && console.group(`checkFileExt()`);
  // get the file extension from the file name
  let extFromName = file.name.split(".").pop();
  if (extFromName === undefined) {
    return false;
  }
  dev && console.log("extFromName: ", extFromName);
  // get the file extension from the file buffer
  const fileBuffer = await file.arrayBuffer();
  const fileUint8Array = new Uint8Array(fileBuffer);
  const extFromFile = await fileTypeFromBuffer(
    Buffer.from(fileUint8Array.slice(0, 128)),
  );
  dev && console.log("extFromFile: ", extFromFile);
  // process plain text file extensions
  if (["txt", "md"].includes(extFromName)) {
    return true;
  }
  // process private file extensions
  if (extFromName === "ssf") {
    extFromName = "zip";
  }
  // check if the file extension from the file name is the same as that from the file buffer
  dev && console.groupEnd();
  if (extFromName === extFromFile?.ext) {
    return true;
  } else {
    return false;
  }
}

export default checkFileExt;
