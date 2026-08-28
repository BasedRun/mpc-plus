export interface ReleaseInfo {
  version: string;
  description: string;
}

export interface DoctorCheck {
  name: string;
  ok: boolean;
  message?: string;
}

export type PlatformEvent =
  | {
      type: "progress";
      message: string;
      percentage?: number;
    }
  | {
      type: "log";
      level: "info" | "warn" | "error";
      message: string;
    };

export interface PlatformActionInput {
  release: ReleaseInfo;
  signal?: AbortSignal;
}

export interface PlatformExecutor {
  upload(input: PlatformActionInput): Promise<unknown>;
  preview(input: PlatformActionInput): Promise<unknown>;
  doctor(): Promise<DoctorCheck[]>;
}

export interface PlatformDefinition<
  Name extends string = string,
  ConfigInput = unknown,
  Config = unknown,
> {
  name: Name;
  schema: {
    parse(input: unknown): Config;
  };
  create(options: {
    config: Config;
    projectRoot: string;
    emit(event: PlatformEvent): void;
  }): PlatformExecutor;
  readonly __configInput?: ConfigInput;
}

export type PlatformRegistry = Record<string, PlatformDefinition>;
