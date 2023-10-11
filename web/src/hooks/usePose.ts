import { createRef, useRef, useState } from "react"
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"
import { type PoseLandmarkerResult } from "@mediapipe/tasks-vision"
// import { createSignal } from "solid-js"
// import { setState, state } from "../state"

function usePose(onPredict: (landmarks: PoseLandmarkerResult) => void) {
  const [loading, setLoading] = useState(false)
  let landmarker: PoseLandmarker
  let lastVideoTime = -1
  const rafId = useRef(0)
  let video: HTMLVideoElement

  const init = async (videoRef: HTMLVideoElement, model: string, delegate: "CPU" | "GPU") => {
    setLoading(true)
    video = videoRef
    const vision = await FilesetResolver.forVisionTasks(import.meta.env.VITE_WASM)
    landmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: import.meta.env.VITE_TASK + model,
        delegate,
      },
      runningMode: "VIDEO",
    })
  }

  const predict = async () => {
    const startTimeMs = performance.now()
    if (lastVideoTime !== video.currentTime && video.srcObject !== null) {
      lastVideoTime = video.currentTime
      return landmarker.detectForVideo(video, startTimeMs)
    }
  }

  const poseLoop = async () => {
    rafId.current = requestAnimationFrame(poseLoop)
    const predicted = await predict()
    if (predicted) {
      onPredict(predicted)
    }
  }

  const start = async () => {
    await Promise.resolve()
    await poseLoop()
    setLoading(false)
  }

  const stop = () => {
    cancelAnimationFrame(rafId.current)
  }

  return { init, start, stop, loading }
}

export default usePose
