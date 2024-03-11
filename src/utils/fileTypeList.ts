type FileTypeList = {
  [key: string]: {
    name: string;
    ext: string[];
  };
};

const fileTypeList: FileTypeList = {
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
    ext: ["mp4", "webm", "swf"],
  },
  model: {
    name: "模型",
    ext: ["glb"],
  },
  other: {
    name: "其他",
    ext: ["ssf"],
  },
};

export default fileTypeList;
