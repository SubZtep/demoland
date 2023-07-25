import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import express, { type Express } from "express"
import cors from "cors"
import { connections } from "./state.js"
import channelApi from "./api/api.js"
import { channels } from "./channels.js"

export const app: Express = express()

app.set("view engine", "pug")
app.set("views", resolve(dirname(fileURLToPath(import.meta.url)), "../views"))
app.get("/", (_req, res) => {
  res.render("index", {
    title: "Stats",
    connections,
    channels: Array.from(channels.keys()),
    mem: Object.fromEntries(
      Object.entries(process.memoryUsage()).map(([key, value]) => [key, `${(value / 1_000_000).toFixed(2)} MB`]),
    ),
  })
})

app.use(cors())
app.use(channelApi)
