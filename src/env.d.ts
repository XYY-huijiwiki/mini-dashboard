/// <reference types="vite/client" />

import type { MessageApi, DialogApi, LoadingBarApi, NotificationApi } from 'naive-ui'

declare global {
  type ViewMode = 'details' | 'list' | 'tiles'
  type SorterKey = 'type' | 'name' | 'updated_at' | 'uploader' | 'size'
  type SorterOrder = 'ascend' | 'descend'

  // 定义请求的返回值
  interface ResponseData {
    _id: string
    _return: number
    _embedded: Array<{
      _id: string
      [key: string]: any
    }>
  }

  // 定义 mw
  interface Api {
    postWithToken(
      token: string,
      params: {
        action: string
        title?: string
        from?: string
        to?: string
        tags?: string
        createonly?: boolean
        deletetalk?: boolean
        movetalk?: boolean
        movesubpages?: boolean
        noredirect?: boolean
        titles?: string
        rvprop?: string
        text?: string
        summary?: string
        format?: string
        filename?: string
        file?: File
      },
    ): Promise<any>
  }

  declare const mw: {
    Api: any
    huijiApi: any
    config: any
    user: any
  }

  declare const InPageEdit: undefined | any

  declare const CHP: Promise<void>
  declare module 'three'
  declare module 'three/addons/loaders/GLTFLoader.js'

  // define naive-ui api from huijiWiji
  declare const $message: MessageApi
  declare const $dialog: DialogApi
  declare const $loadingBar: LoadingBarApi
  declare const $notification: NotificationApi

  // MIDIjs api
  declare const MIDIjs: {
    play: (url: string) => void
    stop: () => void
    pause: () => void
    resume: () => void
  }

  interface Window {
    RufflePlayer: any
  }

  type FileInfo = {
    id: number
    file_name: string
    file_name_base62: string
    file_size: number
    content_type: string
    updated_at: string
    wikitext: string
    licence: string
    source: string
    uploader: string
    is_deleted: null | 1
    file_name_before_deleted: null | string
    deleted_at: null | string
  }
}
