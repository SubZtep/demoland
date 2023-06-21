import { createEffect, createSignal, type Component, Switch, Match } from "solid-js"
import { startHandLoop, stopHandLoop } from "../lib/loop"

const CameraStream: Component<{ class?: string }> = props => {
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
    <div class={`${cameraEnabled() ? "" : ` no-signal`} ${props.class ? ` ${props.class}` : ""}`}>
      <video ref={video} playsinline autoplay muted></video>
      <button class={cameraEnabled() ? "" : "pulse"} onClick={() => setCameraEnabled(!cameraEnabled())}>
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
