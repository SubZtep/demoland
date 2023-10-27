import { updateStats } from "./state.js"
import { server, wss } from "./conn.js"
import { player, startPhysics } from "./physics.js"

const port = Number(process.env.PORT ?? 8080)

startPhysics(wss)

wss.on("connection", async ws => {
  ws.on("message", data => {
    const { landmarks } = JSON.parse(data.toString()) as ServerMessage
    if (landmarks) {
      const [right, left] = landmarks
        .filter((_, index) => [19, 20].includes(index))
        .map(v => ({ x: v.x * -2, y: v.y * -2 + 1, z: v.z * -2 }))

      player.position(left!, right!)
    }
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
