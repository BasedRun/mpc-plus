export interface ProjectConfig {
    root?: string
}

export interface ReleaseConfig {
    version?: string
    description?: string
}

export interface BaseMpcConfig<TPlatforms = Record<string, unknown>> {
    project?: ProjectConfig
    release?: ReleaseConfig
    platforms?: TPlatforms
}