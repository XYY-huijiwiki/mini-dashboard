async function getVideoMetadata(videoFile: File) {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(videoFile);
  video.preload = "metadata";
  await new Promise<void>((resolve, reject) => {
    video.onloadeddata = () => {
      resolve();
    };
    video.onerror = () => {
      reject();
    };
  });
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  return {
    length: video.duration,
    frameWidth: video.videoWidth,
    frameHeight: video.videoHeight,
  };
}

export { getVideoMetadata };
