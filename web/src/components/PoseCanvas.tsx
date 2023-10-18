import { type RefObject, useEffect, useRef } from "react"
import { type NormalizedLandmark } from "@mediapipe/tasks-vision"
import { POSE_CONNECTIONS } from "../const"
// import "@mediapipe/drawing_utils"

const drawingUtils = window

interface Props {
  landmarks: NormalizedLandmark[]
  width: number
  height: number
  canvasRef: RefObject<HTMLCanvasElement>
  children?: ({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement> }) => JSX.Element
}

export default function PoseCanvas({ landmarks, width, height, canvasRef, children }: Props) {
  // const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    console.log("pose", landmarks)
    const ctx = canvasRef.current!.getContext("2d")!
    ctx.clearRect(0, 0, width, height)

    if (!landmarks) return

    // // @ts-ignore
    // drawingUtils.drawConnectors(ctx, landmarks, POSE_CONNECTIONS, { visibilityMin: 0.65, color: "white" })
    // // @ts-ignore
    // drawingUtils.drawLandmarks(ctx, landmarks, { visibilityMin: 0.65, color: "white", fillColor: "rgb(255,138,0)" })

    // console.log(landmarks)

    // const flippedLandmarks = landmarks.map(v => {
    //   return {
    //     ...v,
    //     x: v.x * -1 + 1,
    //   }
    // })

    landmarks.forEach(v => {
      drawCircle(ctx, n2px(v.x, width), n2px(v.y, height))
    })

    // flippedLandmarks.forEach(v => {
    //   drawCircle(ctx, n2px(v.x, width), n2px(v.y, height))
    // })

    // POSE_CONNECTIONS.forEach(([a, b]) => {
    //   const { x: x1, y: y1 } = flippedLandmarks[a]!
    //   const { x: x2, y: y2 } = flippedLandmarks[b]!
    //   drawLine(ctx, n2px(x1, width), n2px(y1, height), n2px(x2, width), n2px(y2, height))
    // })
  }, [landmarks])

  return (
    <>
      <canvas ref={canvasRef} width={width} height={height} />
      {children?.({ canvasRef })}
    </>
  )
}

/** Normalized value to pixel */
function n2px(num: number, multi: number) {
  return num * multi
  // return (num + 0.5) * multi * 0.2
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
