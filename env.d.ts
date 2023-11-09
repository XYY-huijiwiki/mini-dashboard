/// <reference types="vite/client" />

// 定义请求的返回值
interface ResponseData {
  _id: string;
  _return: number;
  _embedded: Array<{
    _id: string;
    [key: string]: any;
  }>;
}

// 定义 mw
interface Api {
  postWithToken(
    token: string,
    params: {
      action: string;
      title?: string;
      from?: string;
      to?: string;
      tags?: string;
      createonly?: boolean;
      deletetalk?: boolean;
      movetalk?: boolean;
      movesubpages?: boolean;
      noredirect?: boolean;
      titles?: string;
      rvprop?: string;
      text?: string;
      summary?: string;
      format?: string;
      filename?: string;
      file?: File;
    }
  ): Promise<any>;
}

declare const mw: {
  Api: any;
  huijiApi: any;
  config: any;
  user: any;
};

declare const CHP: Promise<void>;

// define naive-ui api from huijiWiji
declare const $message: MessageApiInjection;
declare const $dialog: DialogApiInjection;
declare const $loadingBar: LoadingBarApiInjection;
declare const $notification: NotificationApiInjection;

// FileMetadata
interface FileMetadata {
  file: {
    name: string;
    type: string;
    size: number;
    lastModified: Date;
  };
  video?: {
    length: number;
    frameWidth: number;
    frameHeight: number;
  };
  audio?: IAudioMetadata;
  origin?: {
    publisher: string;
    encodedBy: string;
    authorURL: string;
    copyright: string;
  };
  wiki: {
    fileSource: string;
    fileLicense: string;
    uploader: string;
    uploadTime: Date;
  };
  model?: {
    animations: string[];
  };
}

interface RetrievedDataItem extends FileMetadata {
  _id: string;
}

// MIDIjs api
declare const MIDIjs: {
  play: (url: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
};
