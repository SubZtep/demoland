import { setViews } from "./view"
import { onMessage } from "./message"
import { connections, players } from "./state"
import { app, server, wss, sendMessage } from "./init"
// import { initPhysics } from "./physics"

setViews(app)
// initPhysics(wss)

wss.on("connection", ws => {
  ws.on("message", (data, binary) => {
    onMessage(data, binary, ws, wss)
  })

  ws.on("close", () => {
    if (players.has(ws)) {
      const { id } = players.get(ws)!
      players.delete(ws)
      sendMessage({ cmd: "bye", player: { id } })
    }

    connections.active = wss.clients.size
  })

  ws.on("upgrade", req => console.log("WS Upgrade", req))
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
