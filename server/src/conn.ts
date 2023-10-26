import { createServer } from "node:http"
import { WebSocketServer, WebSocket } from "ws"
import { app } from "./app.js"

export const server = createServer(app)
export const wss = new WebSocketServer({ server })

wss.on("error", err => console.log("WSS Error", err))

export function sendMessage(msg: ServerMessage, client?: WebSocket) {
  // console.log(`sending${client ? " to one" : ""}`, JSON.stringify(msg))
  if (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg))
    }
    return
  }
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg))
    }
  })
}
