export interface WechatUploadOptions {
  setting?: Record<string, unknown>;
}

export interface WechatPreviewOptions {
  scene?: number;
}

export interface WechatConfigInput {
  appid: string;
  privateKey: string;
  output: string;
  robot?: number;
  upload?: WechatUploadOptions;
  preview?: WechatPreviewOptions;
}
