import type {
  GetSizeFunc,
  MediaInfo,
  ReadChunkFunc,
  MediaType,
} from "mediainfo.js";
import MediaInfoFactory from "mediainfo.js";

async function getMediaInfo(file: File): Promise<MediaType | undefined> {
  const mediaInfo: MediaInfo = await MediaInfoFactory({
    locateFile: () =>
      "https://cdn.jsdelivr.net/npm/mediainfo.js@0.2.1/dist/MediaInfoModule.wasm",
  });
  const getSize: GetSizeFunc = () => file.size;
  const readChunk: ReadChunkFunc = (chunkSize, offset) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) return reject("No event target");
        if (event.target.error) {
          return reject(event.target.error);
        }
        if (event.target.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(event.target.result));
        } else {
          return reject("Expected ArrayBuffer");
        }
      };
      reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
    });
  const result = await (await mediaInfo.analyzeData(getSize, readChunk)).media;
  return result;
}

export default getMediaInfo;
