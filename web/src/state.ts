import mobile from "is-mobile"
import { createStore } from "solid-js/store"
import { POSE_LANDMARKS } from "./app/const"

export const [state, setState] = createStore({
  player: {
    name: window.localStorage.getItem("name") ?? "",
    // position: { x, y: 0, z },
    dimensions: { dotSize: 0.06 },
    landmarks: POSE_LANDMARKS,
  } as Player,
  input: {
    width: 0,
    height: 0,
    model: "pose_landmarker_lite.task",
    delegate: "CPU" as "CPU" | "GPU",
  },
  playing: false,
  channel: window.location.pathname.replaceAll("/", "") || null,
  camera: false,
  isDesktop: !mobile(),
  connected: false,
  /** Create player in lobby */
  broadcast: true,
  messageDelay: 1_000 / 30,
  angleThreshold: 28,
  lastLandmarksUpdate: Date.now(),
  players: [] as Player[],
  obstacles: [] as Obstacle[],
})
