import { createContext } from "react"

export const defaultOptions: Options = {
  name: "",
  streaming: false,
  model: "pose_landmarker_full.task",
  delegate: "GPU",
  playing: false,
}

export const OptionsContext = createContext({ options: {} as Options, setOptions: (v: Options) => {} })
