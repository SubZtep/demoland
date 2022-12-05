import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import mapsocketPlugin from "./src/lib/socket-server"
// import { Server } from "socket.io"

export default defineConfig({
  plugins: [
    solidPlugin(),
    mapsocketPlugin()
    // {
    //   name: "mapsocket",
    //   configureServer(server) {
    //     const io = new Server(server.httpServer!)
    //       .on("connection", socket => {
    //         socket.on("player", msg => {
    //           console.log("i am client player connected to the server", msg)
    //         })

    //         // console.log("CONNECTED", socket)
    //         // console.log("CONNECTED", socket)
    //         // socket.emit("new_client", "New client connected") // TODO: ADD CLIENT ID
    //         // socket.emit("new_client", {}) // TODO: ADD CLIENT ID

    //         // socket.on("player", msg => {
    //         //   console.log("PPPPPP", msg)
    //         //   // io.emit("joystick", msg)
    //         // })
    //         // socket.on("joystick", msg => {
    //         //   io.emit("joystick", msg)
    //         // })
    //       })
    //       .on("disconnect", v => {
    //         console.log("DOSCONNECTED", v)
    //       })
    //       .on("error", v => {
    //         console.log("ERROR", v)
    //       })

    //     setTimeout(() => {
    //       io.emit("player", { player: "123" })
    //     }, 3000)
    //   },
    //   transformIndexHtml(html) {
    //     return html.replace(/<\/body>/, `<script src="/socket.io/socket.io.js"></script></body>`)
    //   }
    // }
  ],
  server: {
    port: 3000
    // host: true
  },
  build: {
    target: "esnext"
  }
})
