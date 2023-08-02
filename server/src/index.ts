import RAPIER from "@dimforge/rapier3d-compat"
import { onMessage } from "./message.js"
import { players, updateStats } from "./state.js"
import { server, wss, sendMessage } from "./conn.js"

await RAPIER.init()

wss.on("connection", ws => {
  ws.on("message", (data, binary) => {
    onMessage(data, binary, ws, wss)
  })

  ws.on("close", () => {
    // if (players.has(ws)) {
    //   const { id } = players.get(ws)!
    //   players.delete(ws)
    //   sendMessage({ cmd: "bye", player: { id } })
    // }

    updateStats(wss)
  })

  ws.on("upgrade", _req => console.log("WS Upgrade"))
  ws.on("error", _ev => console.log("WS Error"))
  updateStats(wss)
})

server.listen(+process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT)
})
