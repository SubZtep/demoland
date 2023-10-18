import { camera, scene, renderer } from "./scene"
import { runForever, Loop } from "./loop"
import { move, pose } from "./skeleton"
import "./index.css"

// const channel = window.location.pathname.replaceAll("/", "")

// scene.add(pose)

// new Loop().start()
const debug = document.getElementById("debug")!

// runForever.add(() => {
//   renderer.render(scene, camera)
// })

let ws: WebSocket
// @ts-ignore
try {
  ws = new WebSocket(import.meta.env.VITE_WSPP)
  debug.innerText = typeof ws
} catch (e: any) {
  debug.innerText = e.message
}

ws.addEventListener("error", () => {
  debug.innerText = "error"
})

ws.addEventListener("open", () => {
  debug.innerText = "connected"
  // document.getElementById("myCanvas")?.classList.remove("fade")
})

// ws.addEventListener("close", () => {
//   document.getElementById("myCanvas")?.classList.add("fade")
// })
  
ws.addEventListener("message", ({ data }) => {
  debug.innerText = "data: " + data
  // const msg = JSON.parse(data) // as ServerMessage
  // // console.log(msg)
  // move(msg.landmarks.map(v => ({ ...v, y: v.y * -1 + 2 })))
})
