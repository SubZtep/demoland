import { createSignal } from "solid-js"
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import { setState, state } from "../state"

function useHand() {
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
      numHands: 2,
    })
  }

  const predict = async () => {
    const startTimeMs = performance.now()
    if (lastVideoTime !== video.currentTime && video.srcObject !== null) {
      lastVideoTime = video.currentTime
      const predicted = landmarker.detectForVideo(video, startTimeMs)
      return predicted.landmarks
    }
  }

  const handLoop = async () => {
    rafId = requestAnimationFrame(handLoop)
    const now = Date.now()

    if (now - lastPredictTime < state.messageDelay) return

    const handLandmarks = await predict()
    lastPredictTime = now

    if (handLandmarks) {
      setState("player", "handLandmarks", handLandmarks)
    }
  }

  const start = async () => {
    await Promise.resolve()
    await handLoop()
    setLoading(false)
  }
  const stop = () => {
    cancelAnimationFrame(rafId)
    lastPredictTime = 0
  }

  return { init, start, stop, loading }
}

export default useHand
