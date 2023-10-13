import { useEffect, useRef } from "react"
import { type NormalizedLandmark } from "@mediapipe/tasks-vision"

interface Props {
  landmarks: NormalizedLandmark[]
  width: number
  height: number
}

export default function PoseCanvas({ landmarks, width, height }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvas.current!.getContext("2d")!

  }, [])

  useEffect(() => {
    console.log("draw", landmarks)
  }, [landmarks])

  return <canvas ref={canvas} width={width} height={height} />
}
