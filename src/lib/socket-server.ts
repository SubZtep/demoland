import type { Plugin } from "vite"
import { Server, type Socket } from "socket.io"

const connections = new Set<Socket>()

export default function (): Plugin {
  return {
    name: "vite-plugin-mapsocket",

    transformIndexHtml(html) {
      return html.replace(/<\/body>/, `<script src="/socket.io/socket.io.js"></script></body>`)
    },

    configureServer(server) {
      const io = new Server(server.httpServer!).on("connection", socket => {
        connections.add(socket)

        socket.once("disconnect", v => {
          connections.delete(socket)
          // TODO: emit disconnect event
        })

        socket.on("player", (msg: PlayerEventDetail) => {
          socket.broadcast.emit("playerx", msg)
        })
      })
    }
  }
}
