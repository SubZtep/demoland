import { useEffect, useRef } from "react"
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

  useEffect(() => {
    video.current!.addEventListener("loadedmetadata", ev => {
      const videoEl = ev.target as HTMLVideoElement

      onLoaded(videoEl)

      // @ts-ignore
      document.body.style.setProperty("--input-aspect-ratio", String(ev.target.videoWidth / ev.target.videoHeight))
    })
  }, [])

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
