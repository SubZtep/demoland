import mobile from "is-mobile"
import { createStore } from "solid-js/store"
import { POSE_LANDMARKS } from "./app/const"

export const [state, setState] = createStore({
  player: {
    name: window.localStorage.getItem("name") ?? "",
    landmarks: POSE_LANDMARKS,
  } as Player,
  input: {
    width: 0,
    height: 0,
    model: "pose_landmarker_lite.task",
    delegate: "CPU" as "CPU" | "GPU",
  },
  playing: false,
  error: "",
  channel: window.location.pathname.replaceAll("/", "") || null,
  camera: false,
  isDesktop: !mobile(),
  connected: false,
  messageDelay: 1_000 / 30,
  lastLandmarksUpdate: Date.now(),
  /** Player landmarks for display to viewver received from the server */
  landmarks: [] as Landmark[],
  obstacles: [] as Obstacle[],
})
