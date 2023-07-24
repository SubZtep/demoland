import { css } from "@emotion/css"
import { createEffect, type ParentComponent, Switch, Match, Show, type JSXElement, onMount, onCleanup } from "solid-js"
import { state, setState } from "../../state"
import useResizeObserver from "../../hooks/useResizeObserver"

const monitorClass = css`
  position: relative;
  background-color: #123;
  box-shadow: var(--box-shadow-inset);
  // border-radius: var(--border-radius);

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

const CameraStream: ParentComponent<{
  enabled: boolean
  onStart?: (video: HTMLVideoElement) => void
  onStop?: () => void
}> = props => {
  let video: HTMLVideoElement | undefined
  let mediaStream: MediaStream | null = null
  // useResizeObserver(video, (width, height) => {
  //   console.log("resize")
  //   setState({ input: { width, height } })
  // })

  const resizeChildren = () => {
    // console.log(mediaStream?.getVideoTracks()[0].)
    // console.log("xxx", [video!.clientWidth, video!.clientHeight])
    // setState({ input: { width: video!.clientWidth, height: video!.clientHeight } })
    // console.log([video!.clientWidth, video!.clientHeight])
    // // const w = wrapper!.clientWidth - (props.border ? 4 : 0)
    // // const h = wrapper!.clientHeight - (props.border ? 4 : 0)
    // // renderer.setSize(w, h)
    // // camera.aspect = w / h
    // // camera.updateProjectionMatrix()
    // const children = Array.isArray(props.children) ? props.children : [props.children]
    // children.forEach(child => {
    //   // @ts-ignore
    //   child.style.width = video!.clientWidth
    //   // @ts-ignore
    //   child.style.height = video!.clientHeight
    //   // child.setAttribute("width", video!.clientWidth)
    //   // @ts-ignore
    //   child.setAttribute("height", video!.clientHeight)
    //   // console.log("Xxx", child)
    // })
    // // if (Array.isArray(props.children)) {
    // // } else {
    // // }
    // // console.log("CCC", props.children)
  }

  // const videoLoaded = () => {
  //   document.body.style.setProperty("--input-aspect-ratio", String(video!.videoWidth / video!.videoHeight))
  //   setState({ input: { width: video!.clientWidth, height: video!.clientHeight } })
  // }

  // onMount(() => {
  //   resizer = new ResizeObserver(throttle(resizeChildren, 200))
  //   // resizer.observe(video!, { box: "content-box" })
  //   video!.addEventListener("loadedmetadata", videoLoaded)
  // })

  // onCleanup(() => {
  //   video!.removeEventListener("loadedmetadata", videoLoaded)
  //   setState("camera", false)
  //   resizer?.disconnect()
  // })

  createEffect(async () => {
    if (props.enabled) {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      console.log(mediaStream)
      video!.srcObject = mediaStream

      // resizer?.observe(video!, { box: "content-box" })

      props.onStart?.(video!)
    } else {
      // resizer?.unobserve(video!)
      props.onStop?.()
      video!.srcObject = null
      mediaStream?.getTracks().forEach(track => {
        if (track.readyState === "live") {
          track.stop()
        }
      })
      mediaStream = null
    }
  })

  onCleanup(() => {
    if (props.enabled) {
      props.onStop?.()
    }
  })

  return (
    <video
      ref={video}
      playsinline
      autoplay
      muted
      // @ts-ignore
      disablePictureInPicture={true}
      class={css`
        width: 100%;
        height: 100%;
      `}
    ></video>
  )
}

export default CameraStream
