import { useEffect, useRef, useState } from "react"
import { OptionsContext, defaultOptions } from "./context"
import useWebSocket from "./hooks/useWebSocket"
import { type NormalizedLandmark } from "@mediapipe/tasks-vision"
import { POSE_LANDMARKS } from "./const"
import styles from "./player.module.css"
import Options from "./components/Options"
import useDimensions from "./hooks/useDimensions"
import CameraVideo from "./components/CameraVideo"
import PoseCanvas from "./components/PoseCanvas"
import usePose from "./hooks/usePose"

export default function App() {
  const [options, setOptions] = useState<Options>(defaultOptions)
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[]>(POSE_LANDMARKS)
  const { connected, sendMessage } = useWebSocket(import.meta.env.VITE_WSPP)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { width, height } = useDimensions(wrapperRef)

  const { init, start, stop, loading } = usePose(res => {
    setLandmarks(res.landmarks[0]!)
    sendMessage(options.name, res.worldLandmarks[0]!)
  })

  useEffect(() => {
    if (options.playing) {
      start()
    } else {
      stop()
    }
  }, [options.playing])

  return (
    <OptionsContext.Provider value={{ options, setOptions }}>
      <div ref={wrapperRef} className={styles.videoWrapper}>
        <CameraVideo
          enabled={options.streaming}
          onLoaded={async videoEl => {
            await init(videoEl, options.model, options.delegate)
          }}
          width={width}
          height={height}
        />
        <PoseCanvas canvasRef={canvasRef} landmarks={landmarks} width={width} height={height} />
      </div>

      <Options />
    </OptionsContext.Provider>
  )
}
