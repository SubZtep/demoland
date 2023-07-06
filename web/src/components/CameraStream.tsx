import { css } from "@emotion/css"
import { createEffect, createSignal, type Component, Switch, Match, Show } from "solid-js"
import useMediapipe from "../hooks/useMediapipe"
import { state } from "../app/state"

const monitorClass = css`
  position: relative;
  background-color: #123;
  box-shadow: var(--box-shadow-inset);
  border-radius: var(--border-radius);

  &.no-signal {
    background:
      radial-gradient(transparent 35%, #000) 50% calc(50% + 0.1rem),
      url("/images/no-signal.jpg") no-repeat center center;
    background-size: cover;
  }

  &:not(.no-signal) button {
    opacity: 0.8;
  }

  & > * {
    position: absolute;
    top: 0;
    left: 0;
  }

  & > video {
    width: 100%;
    height: 100%;
    box-shadow: var(--box-shadow-inset);
  }
`

const CameraStream: Component = _props => {
  const [active, setActive] = createSignal(false)
  const { init, start, stop } = useMediapipe()
  let video: HTMLVideoElement | undefined
  let mediaStream: MediaStream | null = null

  createEffect(async () => {
    if (active()) {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      video!.srcObject = mediaStream
      await init(video!)
      await start()
    } else {
      stop()
      video!.srcObject = null
      mediaStream?.getTracks().forEach(track => {
        if (track.readyState === "live") {
          track.stop()
        }
      })
      mediaStream = null
    }
  })

  createEffect(() => {
    if (!state.broadcast) {
      setActive(false)
    }
  })

  return (
    <div classList={{ "no-signal": !active(), [monitorClass]: true, "grid-col-span-2": state.isDesktop }}>
      <video ref={video} playsinline autoplay muted></video>
      <Show when={state.broadcast}>
        <button classList={{ pulse: active() }} onClick={() => setActive(!active())}>
          🎥{" "}
          <Switch>
            <Match when={!active()}>On</Match>
            <Match when={active()}>Off</Match>
          </Switch>
        </button>
      </Show>
    </div>
  )
}

export default CameraStream
