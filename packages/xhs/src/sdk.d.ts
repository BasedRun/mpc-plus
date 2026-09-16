// xhs-mp-cli@2.1.6 publishes its declarations under dist/src, but its types entry
// points to the missing dist/index.d.ts. Keep this narrow runtime boundary private.
declare module "xhs-mp-cli/dist/ci.js" {
  export class CI {
    core: {
      login: () => Promise<void>;
    };
    setAppConfig(options: { appId: string; config: { token: string } }): void;
    upload(options: {
      project: { projectPath: string };
      version: string;
      desc: string;
      verbose: boolean;
    }): Promise<unknown>;
  }
}
