import extract from "png-chunks-extract";
import JSZip from "jszip";

/**
 * Returns the URL of a file with the given name.
 * @param {string} fileName - The name of the file.
 * @returns {string} - The URL of the file, or an empty string if the URL could not be generated.
 */
export async function getObjectURL(
  fileNames: string | string[],
): Promise<string> {
  const fileList: File[] = [];
  for (let index = 0; index < fileNames.length; index++) {
    const fileName = fileNames[index];
    const containerURL = mw.huijiApi.getImageUrl(
      fileName.replace(/ /g, "_") + ".png",
      "xyy",
    );
    const containerStream = await fetch(containerURL);
    const containerBuffer = await containerStream.arrayBuffer();
    const containerArray = new Uint8Array(containerBuffer);
    const containerChunks = extract(containerArray);
    const fileUnit8Array = containerChunks.find((chunk) => {
      return chunk.name === "IXYY";
    })?.data;
    if (!fileUnit8Array) {
      $message.error("获取文件失败");
      return "";
    } else {
      fileList.push(new File([fileUnit8Array], fileName));
    }
  }
  // if only one file, return the url of the file
  // if multiple files, return the url of the zip file
  if (fileList.length === 1) {
    return URL.createObjectURL(fileList[0]);
  } else {
    const zip = new JSZip();
    fileList.forEach((file) => {
      zip.file(file.name, file);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    return URL.createObjectURL(blob);
  }
}
