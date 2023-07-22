import { type Component, createEffect } from "solid-js"

const PoseCanvas: Component<{ landmarks?: Landmark[][]; width: number; height: number }> = props => {
  let canvas: HTMLCanvasElement | undefined

  const drawCircle = (ctx: CanvasRenderingContext2D) => (x: number, y: number) => {
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, 2 * Math.PI, false)
    ctx.fillStyle = "green"
    ctx.fill()
    ctx.lineWidth = 5
    ctx.strokeStyle = "#003300"
    ctx.stroke()
  }

  createEffect(() => {
    // render predictions
    const ctx = canvas!.getContext("2d")!
    ctx.clearRect(0, 0, props.width, props.height)
    ctx.fillStyle = "cyan"
    const circle = drawCircle(ctx)

    props.landmarks?.forEach(landmarks => {
      landmarks.forEach(({ x, y }) => {
        circle(x * props.width, y * props.height)
      })
    })
  })

  return <canvas ref={canvas} width={props.width} height={props.height} />
}

export default PoseCanvas
