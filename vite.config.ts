import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import { Server } from "socket.io"

export default defineConfig({
  plugins: [
    solidPlugin(),
    {
      name: "devsocket",
      configureServer(server) {
        const io = new Server(server.httpServer!)
          .on("connection", socket => {
            console.log("CONNECTED")
            socket.on("hammer", msg => {
              io.emit("hammer", msg)
            })
          })
          .on("disconnect", _socket => {
            console.log("DOSCONNECTED")
          })
          .on("error", _socket => {
            console.log("ERROR")
          })
      },
      transformIndexHtml(html) {
        return html.replace(/<\/body>/, `<script src="/socket.io/socket.io.js"></script></body>`)
      }
    }
  ],
  server: {
    port: 3000
    // host: true
  },
  build: {
    target: "esnext"
  }
})
