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

const isMobile = mobile()
if (isMobile) {
  document.documentElement.style.setProperty("--app-cols", "1fr 1fr")
  document.documentElement.style.setProperty("--app-rows", "1fr auto")
}

export const [state, setState] = createStore({
  id,
  colour,
  x: Math.random() * PLANE_SIZE - PLANE_SIZE / 2,
  y: Math.random() * PLANE_SIZE - PLANE_SIZE / 2,
  isDesktop: !isMobile,
  lobby: false,
  connected: false,
  messageDelay: 1_000 / 30,
  angleThreshold: 30,
  lastLandmarksUpdate: Date.now(),
  lastPlayersUpdate: Date.now(),
  playerIds: [] as string[],
})

export const players = new Map<string, Player>()

export const myLandmarks = new Set<Landmark>(HAND_LANDMARKS)
