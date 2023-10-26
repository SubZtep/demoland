import { camera, scene, renderer, controls } from "./app/scene"
import { runForever, Loop } from "./app/loop"
// import { move, pose } from "./avatars/skeleton"
import { move, balls } from "./avatars/handballs"
import { log } from "./app/hud"
import "./index.css"
import { Box } from "./obstacles/box"

// const channel = window.location.pathname.replaceAll("/", "")

const obstacles = new Map<string, Box>()

scene.add(balls)

new Loop().start()

runForever.add(delta => {
  controls.update(delta)
  renderer.render(scene, camera)
})

let ws!: WebSocket
try {
  ws = new WebSocket(import.meta.env.VITE_WSPP)
  log(typeof ws)
} catch (e: any) {
  log(e.message)
}

ws.addEventListener("message", ({ data }) => {
  const msg = JSON.parse(data) as ServerMessage

  msg.obstacles.forEach(obstacle => {
    switch (obstacle.command) {
      case "create":
        if (!obstacles.has(obstacle.id)) {
          obstacles.set(obstacle.id, new Box({ scene, ...obstacle }))
        }
        break
      case "destroy":
        if (obstacles.has(obstacle.id)) {
          obstacles.get(obstacle.id)!.destroy()
          obstacles.delete(obstacle.id)
        }
        break
      case "move":
        const obs = obstacles.get(obstacle.id)
        if (obs) {
          obs.position(obstacle.position)
          obs.rotation(obstacle.rotation)
        }
        break
    }
  })

  if (msg.player) {
    move(msg.player)
  }
})

ws.addEventListener("open", () => {
  log("connected")
  document.getElementById("myCanvas")?.classList.remove("fade")
})

ws.addEventListener("close", () => {
  log("close")
  document.getElementById("myCanvas")?.classList.add("fade")
  setTimeout(() => location.reload(), 2000)
})

ws.addEventListener("error", () => {
  log("error")
})
