
export interface Platform<TUploadOptions = unknown> {
    name: string

    upload(options: TUploadOptions): Promise<unknown>
}
