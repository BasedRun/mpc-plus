import { createMPC } from '@mpc-plus/core'
import { wechatPlatform } from '@mpc-plus/wechat'
import type {MPC} from "@mpc-plus/core";

export function createStandardMPC(): MPC {
    const mpc = createMPC()
    mpc.register(wechatPlatform)
    return mpc
}