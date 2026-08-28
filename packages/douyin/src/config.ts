export interface DouyinUploadOptions {
  channel?: string;
  sourcemap?: boolean;
}

export interface DouyinConfigInput {
  appid: string;
  token: string;
  output: string;
  upload?: DouyinUploadOptions;
}
