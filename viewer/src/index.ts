import { camera, scene, renderer, controls } from "./scene"
import { runForever, Loop } from "./loop"
// import { move, pose } from "./avatars/skeleton"
import { move, boxes } from "./avatars/handboxes"
import { log } from "./hud"
import "./index.css"

// const channel = window.location.pathname.replaceAll("/", "")

// scene.add(pose)
scene.add(boxes)

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

ws.addEventListener("error", () => {
  log("error")
})

ws.addEventListener("open", () => {
  log("connected")
  document.getElementById("myCanvas")?.classList.remove("fade")
})

ws.addEventListener("close", () => {
  log("close")
  document.getElementById("myCanvas")?.classList.add("fade")
})

let dataCounter = 0

ws.addEventListener("message", ({ data }) => {
  log(`data: ${++dataCounter}`)
  const msg = JSON.parse(data) as { name: string; landmarks: Landmark[] }
  // move(msg.landmarks)
  // move(msg.landmarks.map(v => ({ ...v, y: v.y + 2 })))
  move(msg.landmarks.map(v => ({ x: v.x * -1, y: v.y * -1 + 1, z: v.z * -1 })))
})
