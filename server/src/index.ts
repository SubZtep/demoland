import { onMessage } from "./onebox.js"
import { updateStats } from "./state.js"
import { server, wss } from "./conn.js"
import { startPhysics } from "./physics.js"

const port = Number(process.env.PORT ?? 8080)

startPhysics(wss)

wss.on("connection", async ws => {
  ws.on("message", data => {
    onMessage(data, ws, wss)
  })

  ws.on("close", () => {
    updateStats(wss)
  })

  ws.on("upgrade", _req => console.log("WS Upgrade"))
  ws.on("error", _ev => console.log("WS Error"))
  updateStats(wss)
})

server.listen(port, () => {
  console.log("Server is running on port", port)
})
