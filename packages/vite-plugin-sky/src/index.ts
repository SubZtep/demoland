import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"
import "./sky.css"

export default function skyPlugin(): Plugin {
  return {
    name: "vite-plugin-sky",
    enforce: "post",

    transformIndexHtml: {
      transform(html) {
        const dir = dirname(fileURLToPath(import.meta.url))
        const css = readFileSync(resolve(dir, "index.css"), { encoding: "utf-8", flag: "r" })
        // TODO: less aweful way to inject css
        return html
          .replace(/<\/head>/, `<style type="text/css">${css}</style>\n<\/head>`)
          .replace(
            /<body>/,
            `<body>\n<script>document.body.classList.add(\`sky-gradient-${new Date().getHours()}\`)</script>`
          )
      }
    }
  }
}
