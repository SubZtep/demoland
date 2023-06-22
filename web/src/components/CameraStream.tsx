import { createEffect, createSignal, type Component, Switch, Match } from "solid-js"
import { startHandLoop, stopHandLoop } from "../app/mediapipe"
import { state } from "../state"
import styles from "./App.module.css"

const CameraStream: Component = _props => {
  const [cameraEnabled, setCameraEnabled] = createSignal(false)
  let video: HTMLVideoElement | undefined
  let mediaStream: MediaStream | null = null

  createEffect(async () => {
    if (cameraEnabled()) {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      video!.srcObject = mediaStream
      setTimeout(() => startHandLoop(), 500)
    } else {
      stopHandLoop()
      video!.srcObject = null
      mediaStream?.getTracks().forEach(track => {
        if (track.readyState === "live") {
          track.stop()
        }
      })
      mediaStream = null
    }
  })

  return (
    <div classList={{ "no-signal": !cameraEnabled(), [styles.monitor]: true, "grid-col-span-2": state.isDesktop }}>
      <video ref={video} playsinline autoplay muted></video>
      <button classList={{ pulse: cameraEnabled() }} onClick={() => setCameraEnabled(!cameraEnabled())}>
        🎥{" "}
        <Switch>
          <Match when={!cameraEnabled()}>On</Match>
          <Match when={cameraEnabled()}>Off</Match>
        </Switch>
      </button>
    </div>
  )
}

export default CameraStream
