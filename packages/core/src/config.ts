import type { PlatformDefinition, PlatformRegistry } from "./platform.ts";

export type PlatformConfigInput<Definition> =
  Definition extends PlatformDefinition<string, infer ConfigInput, unknown> ? ConfigInput : never;

export type MpcConfigInput<Registry extends PlatformRegistry> = {
  project?: {
    root?: string;
  };
  release?: {
    version?: string;
    description?: string;
  };
  platforms: {
    [Name in keyof Registry]?: PlatformConfigInput<Registry[Name]>;
  };
};
