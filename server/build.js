import { context } from "esbuild"
import { globby } from "globby"

const args = new Set(process.argv.slice(2))

const builder = await context({
  entryPoints: await globby("src/**/*.ts"),
  outdir: "dist",
  platform: "node",
  format: "esm",
})

if (args.has("--watch")) {
  await builder.watch()
} else {
  builder.drop = ["console", "debugger"]
  await builder.rebuild()
}

process.exit()
