import extract from "png-chunks-extract";

/**
 * Returns the URL of a file with the given name.
 * @param {string} fileName - The name of the file.
 * @returns {string} - The URL of the file, or an empty string if the URL could not be generated.
 */
export async function getObjectURL(fileName: string): Promise<string> {
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
    return URL.createObjectURL(new Blob([fileUnit8Array]));
  }
}
