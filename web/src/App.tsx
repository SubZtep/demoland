import { useEffect, useRef, useState } from "react"
import { OptionsContext, defaultOptions } from "./context"
import useWebSocket from "./hooks/useWebSocket"
import { type NormalizedLandmark } from "@mediapipe/tasks-vision"
import { POSE_LANDMARKS } from "./const"
import styles from "./player.module.css"
import Options from "./components/Options"
import useDimensions from "./hooks/useDimensions"
import CameraVideo from "./components/CameraVideo"

export default function App() {
  const [options, setOptions] = useState<Options>(defaultOptions)
  // const channel = useRef(window.location.pathname.replaceAll("/", ""))
  const [message, setMessage] = useState<{ name: string; landmarks: NormalizedLandmark[] }>({
    name: "",
    landmarks: POSE_LANDMARKS,
  })
  const { connected, sendMessage } = useWebSocket(import.meta.env.VITE_WSPP, data => {
    // console.log("received", data)
    // setMessage(data)
  })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { width, height } = useDimensions(wrapperRef)

  useEffect(() => {
    console.log({ width, height })
    // document.documentElement.style.setProperty("--width", `${width}px`)
    // document.documentElement.style.setProperty("--height", `${height}px`)
  }, [width, height])

  return (
    <OptionsContext.Provider value={{ options, setOptions }}>
      <div ref={wrapperRef} className={styles.videoWrapper}>
        <CameraVideo
            enabled={options.streaming}
            onLoaded={async videoEl => {
              const { videoWidth, videoHeight } = videoEl
              // setDimensions({ width: videoEl.videoWidth, height: videoEl.videoHeight })
              // await init(videoEl, options.model, options.delegate)
            }}
            maxWidth={width}
            maxHeight={height}
          />

      </div>

      <Options />
    </OptionsContext.Provider>
  )

  // // prettier-ignore
  // return connected && (
  //   channel.current
  //     ? <Viewer message={message} />
  //     : <Player sendMessage={sendMessage} />
  // )
}
