import type {Platform} from "@mpc-plus/core";
import {upload} from './upload.ts'

export const wechatPlatform: Platform = {
    name: 'wechat',
    upload,
}