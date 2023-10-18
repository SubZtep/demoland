import { type RefObject, useEffect } from "react"
import { type NormalizedLandmark } from "@mediapipe/tasks-vision"
import { POSE_CONNECTIONS } from "../const"

interface Props {
  landmarks: NormalizedLandmark[]
  width: number
  height: number
  canvasRef: RefObject<HTMLCanvasElement>
  children?: ({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement> }) => JSX.Element
}

export default function PoseCanvas({ landmarks, width, height, canvasRef, children }: Props) {
  useEffect(() => {
    if (!landmarks) return

    const ctx = canvasRef.current!.getContext("2d")!
    ctx.clearRect(0, 0, width, height)

    landmarks.forEach(v => {
      drawCircle(ctx, v.x * width, v.y * height)
    })

    POSE_CONNECTIONS.forEach(([a, b]) => {
      const { x: x1, y: y1 } = landmarks[a]!
      const { x: x2, y: y2 } = landmarks[b]!
      drawLine(ctx, x1 * width, y1 * height, x2 * width, y2 * height)
    })
  }, [landmarks])

  return (
    <>
      <canvas ref={canvasRef} width={width} height={height} />
      {children?.({ canvasRef })}
    </>
  )
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath()
  ctx.arc(x, y, 7, 0, 2 * Math.PI)
  ctx.fillStyle = "green"
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = "pink"
  ctx.stroke()
}

function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}
