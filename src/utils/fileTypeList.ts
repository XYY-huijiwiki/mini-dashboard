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
    // ext: ["mp3", "mid", "wav"],
    ext: ["mp3"],
  },
  video: {
    name: "视频",
    ext: ["mp4"],
  },
  model: {
    name: "模型",
    // ext: ["glb"],
    ext: [],
  },
};

export default fileTypeList;
