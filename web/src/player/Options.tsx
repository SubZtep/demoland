import { useContext, useEffect, useState } from "react"
import { StreamingContext } from "./context"
import styles from "./player.module.css"

export default function Options() {
  const [name, setName] = useState(localStorage.getItem("name") ?? "")
  const [model, setModel] = useState(localStorage.getItem("model") ?? "pose_landmarker_full.task")
  const [delegate, setDelegate] = useState(localStorage.getItem("delegate") ?? "GPU")
  // const [camera, setCamera] = useState(false)
  const [playing, setPlaying] = useState(false)
  const { streaming, setStreaming } = useContext(StreamingContext)

  useEffect(() => {
    localStorage.setItem("name", name)
  }, [name])

  useEffect(() => {
    localStorage.setItem("model", model)
  }, [model])

  useEffect(() => {
    localStorage.setItem("delegate", delegate)
  }, [delegate])

  useEffect(() => {
    // if (playing) {
    //   sendMessage({ cmd: "player-hi", player: { name: state.player.name, landmarks: state.player.landmarks } })
    // } else {
    //   sendMessage({ cmd: "player-bye", player: { name: state.player.name } })
    // }
  }, [playing])

  return (
    <div className={styles.options}>
      <input type="text" value={name} placeholder="Enter your name" onChange={ev => setName(ev.target.value)} />

      <button onClick={() => setStreaming(!streaming)}>{streaming ? "Turn Off Camera" : "Turn On Camera"}</button>

      <fieldset disabled={streaming} className={styles.AIsettings}>
        <legend>AI settings</legend>
        <label className={styles.modelLabel}>
          Model:{" "}
          <select onChange={ev => setModel(ev.target.value)} defaultValue={model}>
            <option value="pose_landmarker_lite.task">Lite</option>
            <option value="pose_landmarker_full.task">Full</option>
            <option value="pose_landmarker_heavy.task">Heavy</option>
          </select>
        </label>
        <label>
          <input
            type="radio"
            name="delegate"
            value="CPU"
            checked={delegate === "CPU"}
            onChange={() => setDelegate("CPU")}
          />{" "}
          CPU
        </label>
        <label>
          <input
            type="radio"
            name="delegate"
            value="GPU"
            checked={delegate === "GPU"}
            onChange={() => setDelegate("GPU")}
          />{" "}
          GPU
        </label>
      </fieldset>

      <button
        onClick={() => setPlaying(!playing)}
        // disabled={props.disabled || isUnprepared()}
        className={`${styles.start}${playing ? "" : " pulse"}`}
      >
        {playing ? "Stop" : "Start"}
      </button>
    </div>
  )
}
