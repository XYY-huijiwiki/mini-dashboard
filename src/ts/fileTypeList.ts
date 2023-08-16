type FileTypeList = {
  [key: string]: {
    name: string;
    ext: string[];
  };
};

let fileTypeList: FileTypeList = {
  image: {
    name: "图片",
    ext: [],
  },
  audio: {
    name: "音频",
    ext: ["mp3", "mid", "wav"],
  },
  video: {
    name: "视频",
    ext: ["mp4"],
  },
  model: {
    name: "模型",
    ext: ["glb"],
  },
};

export default fileTypeList;
