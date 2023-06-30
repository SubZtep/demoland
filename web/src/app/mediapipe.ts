import { produce } from "solid-js/store"
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import { state, setState } from "./state"
import { LANDMARK_SCALE } from "./const"

export let landmarker: HandLandmarker
let lastPredictTime = 0
let lastVideoTime = -1
let rafId: number

export const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(import.meta.env.VITE_WASM)
  landmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: import.meta.env.VITE_TASK,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 1,
  })
}

export const predictCamera = async () => {
  const video = document.querySelector<HTMLVideoElement>("video")!
  const startTimeMs = performance.now()
  if (lastVideoTime !== video.currentTime && video.srcObject !== null) {
    lastVideoTime = video.currentTime
    return landmarker.detectForVideo(video, startTimeMs).worldLandmarks[0]
  }
}

const handLoop = async () => {
  rafId = requestAnimationFrame(handLoop)
  const now = Date.now()

  if (now - lastPredictTime < state.messageDelay) return

  const landmarks = await predictCamera()
  lastPredictTime = now

  if (landmarks) {
    setState(
      produce(state => {
        state.player.landmarks = landmarks.map(v => ({
          x: v.x * LANDMARK_SCALE,
          y: v.y * LANDMARK_SCALE + 1,
          z: v.z * LANDMARK_SCALE,
        }))
        state.lastLandmarksUpdate = now
      }),
    )
  }
}

export const startHandLoop = async () => {
  handLoop()
}

export const stopHandLoop = () => {
  cancelAnimationFrame(rafId)
}
