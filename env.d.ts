/// <reference types="vite/client" />

// 定义await-sleep的类型
declare module "await-sleep" {
  function sleep(ms: number): Promise<void>;
  export default sleep;
}

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
};

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
}

interface RetrievedDataItem extends FileMetadata {
  _id: string;
}
