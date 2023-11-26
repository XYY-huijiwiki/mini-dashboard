import getMediaInfo from "@/utils/getMediaInfo";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { fileTypeFromBuffer } from "file-type";

async function generateFileData(
  file: File,
  wiki: FileMetadata["wiki"],
): Promise<FileMetadata> {
  const fileMetadata: FileMetadata = {
    file: {
      name: file.name,
      type:
        (await fileTypeFromBuffer(await file.slice(0, 128).arrayBuffer()))
          ?.mime || file.type,
      size: file.size,
    },
    wiki,
  };

  // get mediaInfo for video and audio
  if (
    fileMetadata.file.type.startsWith("video/") ||
    fileMetadata.file.type.startsWith("audio/")
  ) {
    fileMetadata.mediaInfo = await getMediaInfo(file);
  }

  // get model for 3d models
  if (fileMetadata.file.type.startsWith("model/")) {
    const loader = new GLTFLoader();
    const gltf = (await new Promise((resolve, reject) => {
      loader.load(URL.createObjectURL(file), resolve, undefined, reject);
    })) as any;
    fileMetadata.model = {
      animations: gltf.animations.map((animation: any) => animation.name),
      asset: gltf.asset,
    };
  }

  return fileMetadata;
}

export default generateFileData;
