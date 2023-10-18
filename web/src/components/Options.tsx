import { useContext } from "react"
import { OptionsContext } from "../context"
import styles from "../player.module.css"

export default function Options() {
  const { options, setOptions } = useContext(OptionsContext)

  return (
    <div className={styles.options}>
      <input
        type="text"
        defaultValue={options.name}
        placeholder="Enter your name"
        onChange={ev =>
          setOptions({
            ...options,
            name: ev.target.value,
          })
        }
      />

      <button
        onClick={() =>
          setOptions({
            ...options,
            streaming: !options.streaming,
          })
        }
      >
        {options.streaming ? "Turn Off Camera" : "Turn On Camera"}
      </button>

      <fieldset disabled={options.streaming} className={styles.AIsettings}>
        <legend>AI settings</legend>
        <label className={styles.modelLabel}>
          Model:{" "}
          <select
            onChange={ev =>
              setOptions({
                ...options,
                // @ts-ignore
                model: ev.target.value,
              })
            }
            defaultValue={options.model}
          >
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
            onChange={() =>
              setOptions({
                ...options,
                delegate: "CPU",
              })
            }
          />{" "}
          CPU
        </label>
        <label>
          <input
            type="radio"
            name="delegate"
            value="GPU"
            checked={options.delegate === "GPU"}
            onChange={() =>
              setOptions({
                ...options,
                delegate: "GPU",
              })
            }
          />{" "}
          GPU
        </label>
      </fieldset>

      <button
        onClick={() =>
          setOptions({
            ...options,
            playing: !options.playing,
          })
        }
        disabled={!options.streaming}
        className={`${styles.start}${options.playing ? "" : " pulse"}`}
      >
        {options.playing ? "Stop" : "Start"}
      </button>
    </div>
  )
}
