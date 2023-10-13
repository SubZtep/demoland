import { useEffect, useRef } from "react"
import styles from "./player.module.css"

interface Props {
  enabled: boolean
  onLoaded: (videoEl: HTMLVideoElement) => void
}

export default function CameraVideo({ enabled, onLoaded }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const mediaStream = useRef<MediaStream | null>(null)

  useEffect(() => {
    video.current!.addEventListener("loadedmetadata", ev => {
      // console.log("loaded", ev.target)
      onLoaded(ev.target as HTMLVideoElement)

      // // @ts-ignore
      // console.log(ev.target.clientHeight)

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

  return <video ref={video} playsInline autoPlay muted disablePictureInPicture className={styles.video}></video>
}
