import { type Express } from "express"
import { resolve } from "node:path"
import { connections, players } from "./state"

export function setViews(app: Express) {
  app.set("view engine", "pug")
  app.set("views", resolve(__dirname, "../views"))
  app.get("/favicon.ico", (_, res) => res.sendStatus(204))
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
}
