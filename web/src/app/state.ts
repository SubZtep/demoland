import mobile from "is-mobile"
import { v4 as uuid } from "uuid"
import { createStore } from "solid-js/store"
import { createRandomColour } from "../lib/misc"
import { HAND_LANDMARKS, PLANE_SIZE } from "./const"

let id = window.localStorage.getItem("id")
if (!id) {
  id = uuid()
  window.localStorage.setItem("id", id)
}

let colour = window.localStorage.getItem("colour")
if (!colour) {
  colour = createRandomColour()
  window.localStorage.setItem("colour", colour)
}

const x = Math.random() * PLANE_SIZE - PLANE_SIZE / 2 // TODO: pos from local storage
const z = Math.random() * PLANE_SIZE - PLANE_SIZE / 2

const isMobile = mobile()
if (isMobile) {
  document.documentElement.style.setProperty("--app-cols", "1fr 1fr")
  document.documentElement.style.setProperty("--app-rows", "1fr auto")
}

export const [state, setState] = createStore({
  player: {
    id,
    colour,
    position: { x, y: 0, z },
    dimensions: { dotSize: 0.06 },
    landmarks: HAND_LANDMARKS,
  } as Player,
  isDesktop: !isMobile,
  lobby: false,
  connected: false,
  /** Create player in lobby */
  broadcast: true,
  messageDelay: 1_000 / 30,
  angleThreshold: 28,
  lastLandmarksUpdate: Date.now(),
  players: [] as Player[],
  obstacles: [] as Obstacle[],
})
