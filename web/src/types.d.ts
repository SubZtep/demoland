/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** WebSocket URL with port */
  readonly VITE_WSPP: string
  readonly VITE_WASM: string
  readonly VITE_TASK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type Fn = () => void

/** Options Context */
interface Options {
  streaming: boolean
  model: "pose_landmarker_lite.task" | "pose_landmarker_full.task" | "pose_landmarker_heavy.task"
  delegate: "CPU" | "GPU"
  playing: boolean
}
