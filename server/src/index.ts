import { createServer } from "node:http"
import { WebSocketServer } from "ws"
import express from "express"
import { setViews } from "./view"
import { onMessage } from "./message"
import { connections, players } from "./state"

const app = express()
setViews(app)

const server = createServer(app)
const wss = new WebSocketServer({ server })

wss.on("connection", ws => {
  ws.on("message", (data, binary) => {
    onMessage(data, binary, ws, wss)
  })

  ws.on("close", () => {
    connections.active = wss.clients.size
  })

  ws.on("upgrade", () => {
    console.log("WS Upgrade")
  })

  ws.on("error", ev => console.log("WS Error", ev))

  connections.active = wss.clients.size
  if (connections.active > connections.top) {
    connections.top = connections.active
  }
})

wss.on("error", err => console.log("WSS Error", err))

server.listen(Number(process.env.PORT), () => {
  console.log("Server is running on port", process.env.PORT)
})
