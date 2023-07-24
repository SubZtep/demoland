import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import express, { type Express } from "express"
import { connections, players } from "./state.js"
import channelApi from "./api/api.js"

export const app: Express = express()

app.set("view engine", "pug")
app.set("views", resolve(dirname(fileURLToPath(import.meta.url)), "../views"))
app.get("/", (_req, res) => {
  res.render("index", {
    title: "Stats",
    connections,
    players: Array.from(players.values()),
    mem: Object.fromEntries(
      Object.entries(process.memoryUsage()).map(([key, value]) => [key, `${(value / 1_000_000).toFixed(2)} MB`]),
    ),
  })
})

app.use(channelApi)
