import { useEffect, useRef, useState } from "react"
import styles from "../player.module.css"

interface Props {
  enabled: boolean
  onLoaded: (videoEl: HTMLVideoElement) => void
  width: number
  height: number
}

export default function CameraVideo({ enabled, onLoaded, width, height }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const mediaStream = useRef<MediaStream | null>(null)
  // const [width, setWidth] = useState(0)
  // const [height, setHeight] = useState(0)

  const setDimensions = () => {
    // if (video.current!.videoWidth > maxWidth && video.current!.videoWidth > video.current!.videoHeight) {
    //   const ratio = video.current!.videoWidth / video.current!.videoHeight
    //   console.log("a", ratio)
    //   setHeight(maxWidth / ratio)
    //   setWidth(maxWidth)
    // } else if (video.current!.videoHeight > maxHeight && maxHeight > video.current!.videoWidth) {
    //   const ratio = video.current!.videoHeight / video.current!.videoWidth
    //   console.log("b", ratio)
    //   setWidth(maxHeight / ratio)
    //   setHeight(maxHeight)
    // } else {
    //   setWidth(maxWidth)
    //   setHeight(maxHeight)
    // }
    // document.documentElement.style.setProperty("--width", `${width}px`)
    // document.documentElement.style.setProperty("--height", `${height}px`)

    const el = video.current!
    const { videoWidth, videoHeight } = el

    const ratio = el.videoHeight / el.videoWidth
    // const ratio = el.videoWidth / el.videoHeight
    // setWidth(maxWidth * ratio)
  }

  useEffect(() => {
    video.current!.addEventListener("loadedmetadata", ev => {
      const videoEl = ev.target as HTMLVideoElement

      // console.log("loaded", ev.target)
      onLoaded(videoEl)

      // // @ts-ignore
      // console.log(ev.target.clientHeight)

      // @ts-ignore
      document.body.style.setProperty("--input-aspect-ratio", String(ev.target.videoWidth / ev.target.videoHeight))

      // setDimensions()
    })
  }, [])

  // useEffect(() => {
  //   setDimensions()
  // }, [maxWidth, maxHeight])

  useEffect(() => {
    const mediaSettings: MediaStreamConstraints = {
      video: {
        facingMode: { exact: "user" },
      },
      audio: false,
    }
    async function startMediaStream() {
      try {
        mediaStream.current = await navigator.mediaDevices.getUserMedia(mediaSettings)
      } catch {
        mediaSettings.video = true
        mediaStream.current = await navigator.mediaDevices.getUserMedia(mediaSettings)
      }
      video.current!.srcObject = mediaStream.current
    }

    function stopMediaStream() {
      video.current!.srcObject = null
      mediaStream.current?.getTracks().forEach(track => {
        if (track.readyState === "live") {
          track.stop()
        }
      })
      mediaStream.current = null
    }

    if (enabled) {
      startMediaStream()
    } else {
      stopMediaStream()
    }
  }, [enabled])

  return (
    <video
      ref={video}
      playsInline
      autoPlay
      muted
      disablePictureInPicture
      className={styles.video}
      width={width}
      height={height}
    ></video>
  )
}
