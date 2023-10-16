import { useEffect, useState } from "react"
import { OptionsContext } from "./context"
import CameraVideo from "./CameraVideo"
import PoseCanvas from "./PoseCanvas"
import Options from "./Options"
import styles from "./player.module.css"
import usePose from "../hooks/usePose"
import { NormalizedLandmark } from "@mediapipe/tasks-vision"
import type useWebSocket from "../hooks/useWebSocket"
import { POSE_LANDMARKS } from "../const"

interface Props {
  sendMessage: ReturnType<typeof useWebSocket>["sendMessage"]
}

export default function Player({ sendMessage }: Props) {
  const [options, setOptions] = useState<Options>({
    name: "",
    streaming: false,
    model: "pose_landmarker_full.task",
    delegate: "GPU",
    playing: false,
  })
  const [localLandmarks, setLocalLandmarks] = useState<NormalizedLandmark[]>(POSE_LANDMARKS)
  const [dimensions, setDimensions] = useState({ width: 320, height: 240 })
  const { init, start, stop, loading } = usePose(res => {
    setLocalLandmarks(res.landmarks[0]!)
    // setLocalLandmarks(res.worldLandmarks[0])
    sendMessage(options.name, res.landmarks[0]!)
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
      <div className={styles.wrapper}>
        <div className={styles.videoWrapper}>
          <CameraVideo
            enabled={options.streaming}
            onLoaded={async videoEl => {
              setDimensions({ width: videoEl.videoWidth, height: videoEl.videoHeight })
              await init(videoEl, options.model, options.delegate)
            }}
          />

          <PoseCanvas landmarks={localLandmarks} width={dimensions.width} height={dimensions.height} />
        </div>

        <Options />
      </div>
    </OptionsContext.Provider>
  )
}
