import { useContext, useEffect, useState } from "react"
import { OptionsContext } from "./context"
import styles from "./player.module.css"

export default function Options() {
  const [name, setName] = useState(localStorage.getItem("name") ?? "")
  const [model, setModel] = useState(localStorage.getItem("model") ?? "pose_landmarker_full.task")
  const [delegate, setDelegate] = useState(localStorage.getItem("delegate") ?? "GPU")
  // const [camera, setCamera] = useState(false)
  const [playing, setPlaying] = useState(false)
  const { options, setOptions } = useContext(OptionsContext)

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

      <button onClick={() => setOptions({
        ...options,
        streaming: !options.streaming
      })}>{options.streaming ? "Turn Off Camera" : "Turn On Camera"}</button>

      <fieldset disabled={options.streaming} className={styles.AIsettings}>
        <legend>AI settings</legend>
        <label className={styles.modelLabel}>
          Model:{" "}
          <select onChange={ev => setOptions({
            ...options,
            // @ts-ignore
            model: ev.target.value
          })} defaultValue={options.model}>
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
            checked={options.delegate === "CPU"}
            onChange={() => setOptions({
              ...options,
              delegate: "CPU"
            })}
          />{" "}
          CPU
        </label>
        <label>
          <input
            type="radio"
            name="delegate"
            value="GPU"
            checked={options.delegate === "GPU"}
            onChange={() => setOptions({
              ...options,
              delegate: "GPU"
            })}
          />{" "}
          GPU
        </label>
      </fieldset>

      <button
        onClick={() => setOptions({
          ...options,
          playing: !options.playing
        })}
        disabled={!options.streaming}
        className={`${styles.start}${options.playing ? "" : " pulse"}`}
      >
        {playing ? "Stop" : "Start"}
      </button>
    </div>
  )
}
