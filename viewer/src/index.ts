import { camera, scene, renderer } from "./scene"
import { runForever, Loop } from "./loop"
import { move, pose } from "./skeleton"
import "./index.css"

const channel = window.location.pathname.replaceAll("/", "")

scene.add(pose)

new Loop().start()

runForever.add(() => {
  renderer.render(scene, camera)
})

// @ts-ignore
const ws = new WebSocket(import.meta.env.VITE_WSPP)

ws.addEventListener("open", () => {
  console.log("connected")
})

ws.addEventListener("close", () => {
  console.log("disconnected")
})

ws.addEventListener("message", ({ data }) => {
  const msg = JSON.parse(data) // as ServerMessage
  // console.log(msg)
  move(msg.landmarks.map(v => ({ ...v, y: v.y * -1 + 2 })))
})
