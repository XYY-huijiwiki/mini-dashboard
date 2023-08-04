/// <reference types="vite/client" />

declare module 'await-sleep' {
    export default function sleep(ms: number): Promise<void>;
}

// 定义 mw
interface Api {
    postWithToken(token: string, params: {
        action: string,
        title?: string,
        from?: string,
        to?: string,
        tags?: string,
        createonly?: boolean,
        deletetalk?: boolean,
        movetalk?: boolean,
        movesubpages?: boolean,
        noredirect?: boolean,
        titles?: string,
        rvprop?: string,
        text?: string,
        summary?: string
    }): Promise<any>;
}

declare const mw: {
    Api: new () => Api;
};

// 定义 $message
type MessageFunction = (msg: string) => void;

declare let $message: {
    success: MessageFunction;
    loading: MessageFunction;
    error: MessageFunction;
    info: MessageFunction;
};