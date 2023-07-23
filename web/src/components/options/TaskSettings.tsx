import { css } from "@emotion/css"
import { state, setState } from "../../state"

export default () => {
  return (
    <fieldset
      disabled={state.camera}
      class={css`
        z-index: 1;

        input[type="radio"] {
          accent-color: pink;
        }

        label:has(input[type="radio"]) {
          margin-right: 0.5rem;
        }
      `}
    >
      <legend>Run</legend>
      <label
        class={css`
          @media (orientation: landscape) {
            display: block;
            margin-bottom: 0.5rem;
          }
          @media (orientation: portrait) {
            margin-right: 0.5rem;
          }
        `}
      >
        Model:{" "}
        <select>
          <option value="pose_landmarker_lite.task" selected={state.input.model === "pose_landmarker_lite.task"}>
            Lite
          </option>
          <option value="pose_landmarker_full.task" selected={state.input.model === "pose_landmarker_full.task"}>
            Full
          </option>
          <option value="pose_landmarker_heavy.task" selected={state.input.model === "pose_landmarker_heavy.task"}>
            Heavy
          </option>
        </select>
      </label>
      <label>
        <input
          type="radio"
          name="delegate"
          value="CPU"
          checked={state.input.delegate === "CPU"}
          onChange={() => setState("input", "delegate", "CPU")}
        />{" "}
        CPU
      </label>
      <label>
        <input
          type="radio"
          name="delegate"
          value="GPU"
          checked={state.input.delegate === "GPU"}
          onChange={() => setState("input", "delegate", "GPU")}
        />{" "}
        GPU
      </label>
    </fieldset>
  )
}
