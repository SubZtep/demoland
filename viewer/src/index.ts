import { camera, scene, renderer } from "./scene"
import { runForever, Loop } from "./loop"
import { move, pose } from "./skeleton"
import { log } from "./hud"
import "./index.css"

// const channel = window.location.pathname.replaceAll("/", "")

scene.add(pose)

new Loop().start()

runForever.add(() => {
  renderer.render(scene, camera)
})

let ws!: WebSocket
try {
  // @ts-ignore
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
  document.getElementById("myCanvas")!.className = ""
})

ws.addEventListener("close", () => {
  log("close")
  document.getElementById("myCanvas")?.classList.add("fade")
})

let dataCounter = 0
  
ws.addEventListener("message", ({ data }) => {
  log(`data: ${++dataCounter}`)
  const msg = JSON.parse(data) // as ServerMessage
  // // console.log(msg)
  move(msg.landmarks)
  // move(msg.landmarks.map(v => ({ ...v, y: v.y + 2 })))
})
