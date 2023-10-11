import { useEffect, useState } from "react"
import { StreamingContext } from "./context"
import CameraStream from "./CameraStream"
import PoseCanvas from "./PoseCanvas"
import Options from "./Options"
import styles from "./player.module.css"
import usePose from "../hooks/usePose"
import { NormalizedLandmark } from "@mediapipe/tasks-vision"

export default function Player() {
  const [streaming, setStreaming] = useState(false)
  const [landmarks, setLandmarks]= useState<NormalizedLandmark[]>([])
  const { init, start, stop, loading } = usePose(v => {
    setLandmarks(v.landmarks[0])
    console.log(v)
  })

  // useEffect(() => {
  //   if (streaming && !loading) {
  //     console.log("start")
  //     // start()
  //   } else {
  //     console.log("end")
  //     // stop()
  //   }
  // }, [streaming, loading])

  return (
    <StreamingContext.Provider value={{ streaming, setStreaming }}>
      <div className={styles.wrapper}>
        <div className={styles.videoWrapper}>
          <CameraStream enabled={streaming} onLoaded={async video => {
            console.log("stream", video)
            await init(video, "pose_landmarker_full.task", "GPU")
            console.log("inited")
          }} />

          {/* <PoseCanvas landmarks={state.player.landmarks} width={state.input.width} height={state.input.height} /> */}



          {/* <div className={styles.blue}>
            <div>blue</div>
          </div> */}
        </div>


        <Options />
      </div>
    </StreamingContext.Provider>
  )
}
