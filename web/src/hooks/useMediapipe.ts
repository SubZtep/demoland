import { createSignal } from "solid-js"
import { produce } from "solid-js/store"
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import { setState, state } from "../app/state"
import { LANDMARK_SCALE } from "../app/const"

function useMediapipe() {
  const [loading, setLoading] = createSignal(false)
  let landmarker: HandLandmarker
  let lastPredictTime = 0
  let lastVideoTime = -1
  let rafId: number
  let video: HTMLVideoElement

  const init = async (videoRef: HTMLVideoElement) => {
    setLoading(true)
    video = videoRef
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

  const predict = async () => {
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

    const landmarks = await predict()
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

  const start = async () => {
    await Promise.resolve()
    await handLoop()
    setLoading(false)
  }
  const stop = () => cancelAnimationFrame(rafId)

  return { init, start, stop, loading }
}

export default useMediapipe
