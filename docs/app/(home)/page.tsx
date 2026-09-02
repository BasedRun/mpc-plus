import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, Settings2, TerminalSquare } from "lucide-react";

const stages = ["配置发现", "配置加载", "环境解析", "参数解析", "平台分发", "上传成功"];

const features = [
  {
    icon: Settings2,
    title: "一份配置",
    description: "通过 mpc.config.ts 集中声明项目、版本、平台与环境。",
  },
  {
    icon: Layers3,
    title: "批量分发",
    description: "不传筛选参数时，依次上传配置中的全部平台和环境。",
  },
  {
    icon: TerminalSquare,
    title: "过程透明",
    description: "每个执行环节实时输出结果，失败目标不会遮住后续任务。",
  },
];

export default function HomePage() {
  return (
    <main className="flex-1 overflow-hidden">
      <section className="mpc-hero-grid relative border-b px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-fd-background/80 px-3 py-1 text-sm text-fd-muted-foreground backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-500" />
              Mini Program CI · one command
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              一次配置，发布所有小程序环境
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-fd-muted-foreground">
              MPC Plus 把配置发现、环境合并、平台分发和上传结果串成一条清晰的 CLI 流程。 本地和 CI
              使用相同命令，每一步都能在终端看到。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/docs/installation"
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-3 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                快速开始
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/docs/configuration"
                className="inline-flex items-center rounded-lg border bg-fd-background px-5 py-3 font-medium transition-colors hover:bg-fd-accent"
              >
                查看配置
              </Link>
            </div>
          </div>

          <div className="mpc-code-glow overflow-hidden rounded-2xl border bg-[#0d1117] text-sm shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-white/45">terminal</span>
            </div>
            <div className="space-y-3 overflow-x-auto p-5 font-mono leading-6 text-white/75 sm:p-7">
              <p>
                <span className="text-emerald-400">$</span> pnpm exec mpc upload
              </p>
              {stages.map((stage, index) => (
                <p key={stage} className={index === 0 ? "pt-2" : undefined}>
                  <span className="text-sky-400">[mpc]</span>{" "}
                  <span className="text-emerald-400">✔</span> {stage}
                  {stage === "上传成功" ? " · wechat/dev" : ""}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium text-fd-primary">面向真实发布流程</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">从配置到结果，保持简单</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border bg-fd-card p-6">
                <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-fd-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-fd-muted/30 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">五分钟完成首次上传</h2>
            <p className="mt-4 leading-7 text-fd-muted-foreground">
              安装 CLI、创建配置、准备微信密钥，然后执行一条命令。
            </p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-3">
            {["安装 CLI", "配置环境", "执行上传"].map((label, index) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border bg-fd-background p-4"
              >
                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
                <span className="font-medium">
                  {index + 1}. {label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
