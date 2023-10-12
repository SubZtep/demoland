import { useRef, useState } from "react"
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"
import { type PoseLandmarkerResult } from "@mediapipe/tasks-vision"

function usePose(onPredict: (landmarks: PoseLandmarkerResult) => void) {
  const [loading, setLoading] = useState(false)
  const landmarker = useRef<PoseLandmarker>()
  const lastVideoTime = useRef(-1)
  const rafId = useRef(0)
  const video = useRef<HTMLVideoElement>()

  const init = async (videoEl: HTMLVideoElement, model: string, delegate: "CPU" | "GPU") => {
    setLoading(true)
    video.current = videoEl
    const vision = await FilesetResolver.forVisionTasks(import.meta.env.VITE_WASM)
    landmarker.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: import.meta.env.VITE_TASK + model,
        delegate,
      },
      runningMode: "VIDEO",
    })
  }

  const predict = async () => {
    const startTimeMs = performance.now()
    const el = video.current!
    if (lastVideoTime.current !== el.currentTime && el.srcObject !== null) {
      lastVideoTime.current = el.currentTime
      return landmarker.current!.detectForVideo(el, startTimeMs)
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
