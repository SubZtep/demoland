import express, { type Express } from "express"
import { createServer } from "node:http"
import { WebSocketServer, WebSocket } from "ws"

export const app: Express = express()
export const server = createServer(app)
export const wss = new WebSocketServer({ server })

export function sendMessage(msg: ServerMessage, client?: WebSocket) {
  // console.log(`sending${client ? " to one" : ""}`, msg)
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
