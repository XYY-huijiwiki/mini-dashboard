// this file is used to mock message in dev mode
// in dev mode, message will be logged to console
// in prod mode, message will be shown through naive-ui from Huijiwiki

import type { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";

let message: MessageApiInjection;

if (import.meta.env.DEV) {
  message = {
    success: (msg) => {
      console.log(`[success] ${msg}`);
      return {
        type: "success",
        destroy: () => {},
      };
    },
    info: (msg) => {
      console.log(`[info] ${msg}`);
      return {
        type: "info",
        destroy: () => {},
      };
    },
    warning: (msg) => {
      console.log(`[warning] ${msg}`);
      return {
        type: "warning",
        destroy: () => {},
      };
    },
    error: (msg) => {
      console.log(`[error] ${msg}`);
      return {
        type: "error",
        destroy: () => {},
      };
    },
    loading: (msg) => {
      console.log(`[loading] ${msg}`);
      return {
        type: "loading",
        destroy: () => {},
      };
    },
    create: (msg) => {
      console.log(`[create] ${msg}`);
      return {
        type: "default",
        destroy: () => {},
      };
    },
    destroyAll: () => {},
  };
} else {
  message = $message
}

export default message;
