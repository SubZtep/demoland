import { Component } from "solid-js"

const HandCanvas: Component<{
  width: number
  height: number
}> = props => {
  return <canvas width={props.width} height={props.height}></canvas>
}

export default HandCanvas
