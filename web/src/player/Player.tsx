import { useEffect, useState } from "react"
import { OptionsContext } from "./context"
import CameraVideo from "./CameraVideo"
import PoseCanvas from "./PoseCanvas"
import Options from "./Options"
import styles from "./player.module.css"
import usePose from "../hooks/usePose"
import { NormalizedLandmark } from "@mediapipe/tasks-vision"

export default function Player() {
  const [options, setOptions] = useState<Options>({
    name: "",
    streaming: false,
    model: "pose_landmarker_full.task",
    delegate: "GPU",
    playing: false,
  })
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[]>([
    {
      x: -0.031012525781989098,
      y: -0.5651821494102478,
      z: -0.1802978515625,
    },
    {
      x: -0.02013355679810047,
      y: -0.6032697558403015,
      z: -0.1854248046875,
    },
    {
      x: -0.019757084548473358,
      y: -0.6047178506851196,
      z: -0.1854248046875,
    },
    {
      x: -0.019397906959056854,
      y: -0.6051892042160034,
      z: -0.1859130859375,
    },
    {
      x: -0.0428064689040184,
      y: -0.599491536617279,
      z: -0.1685791015625,
    },
    {
      x: -0.04199007898569107,
      y: -0.5999404191970825,
      z: -0.1712646484375,
    },
    {
      x: -0.043087393045425415,
      y: -0.5999941825866699,
      z: -0.169677734375,
    },
    {
      x: 0.0605122372508049,
      y: -0.6032307147979736,
      z: -0.1419677734375,
    },
    {
      x: -0.03423221409320831,
      y: -0.5961384177207947,
      z: -0.0743408203125,
    },
    {
      x: 0.0017192661762237549,
      y: -0.5503795742988586,
      z: -0.16357421875,
    },
    {
      x: -0.026278745383024216,
      y: -0.5439289808273315,
      z: -0.14306640625,
    },
    {
      x: 0.16820774972438812,
      y: -0.45740678906440735,
      z: -0.08465576171875,
    },
    {
      x: -0.1280241310596466,
      y: -0.4528501033782959,
      z: -0.038665771484375,
    },
    {
      x: 0.22174201905727386,
      y: -0.2778150141239166,
      z: -0.16796875,
    },
    {
      x: -0.19128622114658356,
      y: -0.25416892766952515,
      z: -0.06341552734375,
    },
    {
      x: 0.192182719707489,
      y: -0.15839055180549622,
      z: -0.30517578125,
    },
    {
      x: -0.2359267622232437,
      y: -0.08384658396244049,
      z: -0.1881103515625,
    },
    {
      x: 0.19421067833900452,
      y: -0.09748843312263489,
      z: -0.350341796875,
    },
    {
      x: -0.23184138536453247,
      y: -0.007558989338576794,
      z: -0.2169189453125,
    },
    {
      x: 0.16548433899879456,
      y: -0.11484469473361969,
      z: -0.366943359375,
    },
    {
      x: -0.20366224646568298,
      y: -0.023946048691868782,
      z: -0.23779296875,
    },
    {
      x: 0.17694716155529022,
      y: -0.15424810349941254,
      z: -0.31494140625,
    },
    {
      x: -0.21526086330413818,
      y: -0.07409589737653732,
      z: -0.202880859375,
    },
    {
      x: 0.11881931871175766,
      y: 0.010723586194217205,
      z: -0.01329803466796875,
    },
    {
      x: -0.11837144941091537,
      y: -0.027353666722774506,
      z: 0.01739501953125,
    },
    {
      x: 0.06175140663981438,
      y: 0.0866818055510521,
      z: -0.04144287109375,
    },
    {
      x: -0.055875811725854874,
      y: -0.13240858912467957,
      z: -0.08172607421875,
    },
    {
      x: 0.08665201812982559,
      y: 0.4117144048213959,
      z: 0.1390380859375,
    },
    {
      x: -0.038550831377506256,
      y: 0.14330518245697021,
      z: -0.004360198974609375,
    },
    {
      x: 0.08072678744792938,
      y: 0.47155478596687317,
      z: 0.1734619140625,
    },
    {
      x: -0.06322973221540451,
      y: 0.2005160003900528,
      z: 0.05859375,
    },
    {
      x: 0.1875981241464615,
      y: 0.2421332746744156,
      z: -0.12420654296875,
    },
    {
      x: -0.052205923944711685,
      y: 0.00912997592240572,
      z: -0.28173828125,
    },
  ])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const { init, start, stop, loading } = usePose(res => {
    // setLandmarks(res.landmarks[0])
    setLandmarks(res.worldLandmarks[0])
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
          <pre>{JSON.stringify(landmarks, null, 2)}</pre>

          <PoseCanvas landmarks={landmarks} width={dimensions.width} height={dimensions.height} />

          {/* <div className={styles.blue}>
            <div>blue</div>
          </div> */}
        </div>

        <Options />
      </div>
    </OptionsContext.Provider>
  )
}
