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
            socket.on("joystick", msg => {
              io.emit("joystick", msg)
            })
          })
          .on("disconnect", v => {
            console.log("DOSCONNECTED", v)
          })
          .on("error", v => {
            console.log("ERROR", v)
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
