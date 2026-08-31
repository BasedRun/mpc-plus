import { createMPC } from '@mpc-plus/core'
import { wechatPlatform } from '@mpc-plus/wechat'

export function createStandardMpc() {
    return createMPC()
        .register(wechatPlatform)
}