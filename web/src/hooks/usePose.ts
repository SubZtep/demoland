import { createRef, useRef, useState } from "react"
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"
// import { createSignal } from "solid-js"
// import { setState, state } from "../state"

function usePose(onPredict: (landmarks: Landmark[]) => void) {
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
      const predicted = landmarker.detectForVideo(video, startTimeMs)
      return predicted.landmarks
    }
  }

  const poseLoop = async () => {
    rafId.current = requestAnimationFrame(poseLoop)

    const landmarks = await predict()
    if (landmarks?.[0]) {
      onPredict(landmarks[0])
      // setState("player", "landmarks", landmarks[0])
      // setState("lastLandmarksUpdate", Date.now())
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
