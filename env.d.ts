/// <reference types="vite/client" />

import type {
  MessageApi,
  DialogApi,
  LoadingBarApi,
  NotificationApi,
} from "naive-ui";

declare global {
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

  declare const InPageEdit: undefined | any;

  declare const CHP: Promise<void>;
  declare module "three";
  declare module "three/addons/loaders/GLTFLoader.js";

  // define naive-ui api from huijiWiji
  declare const $message: MessageApi;
  declare const $dialog: DialogApi;
  declare const $loadingBar: LoadingBarApi;
  declare const $notification: NotificationApi;

  // FileMetadata
  interface FileMetadata {
    file: {
      name: string;
      type: string;
      size: number;
    };
    // legacy
    video?: {
      length: number;
      frameWidth: number;
      frameHeight: number;
    };
    // legacy
    audio?: IAudioMetadata;
    // legacy
    origin?: {
      publisher: string;
      encodedBy: string;
      authorURL: string;
      copyright: string;
    };
    mediaInfo?: MediaType;
    wiki: {
      fileSource: string;
      fileLicense: string;
      uploader: string;
      uploadTime: Date;
    };
    model?: {
      animations: string[];
      asset: {
        generator: string;
        version: string;
      };
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

  interface Window {
    RufflePlayer: any;
    dev: string | false;
  }

  type WarningType =
    | "not used"
    | "wanted"
    | "no source"
    | "no license"
    | "asset broken";
  interface FileDetail {
    name: string;
    type: string | null;
    size: number;
    html_url: string;
    thumb_url: string;
    download_url: string;
    desc: string;
    updated_at: string;
    uploader: string;
    uploader_html_url: string;
    warnings: WarningType[];
  }
  interface FileDetailFromGithub {
    id: number;
    tag_name: string;
    html_url: string;
    body: string;
    assets_broken: boolean;
    assets: {
      id: number;
      name: string;
      size: number;
      browser_download_url: string;
      updated_at: string;
      uploader: {
        login: string;
        html_url: string;
      };
    }[];
  }
}
