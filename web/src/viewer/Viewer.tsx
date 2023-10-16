import { useState } from "react"
import ThreeScene from "./ThreeScene"
import PoseSkeleton from "./PoseSkeleton"
import { type NormalizedLandmark } from "@mediapipe/tasks-vision"
import Box from "./Box"

interface Props {
  message: { name: string; landmarks: NormalizedLandmark[] }
}

export default function Viewer({ message }: Props) {
  // const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [dimensions, setDimensions] = useState({ width: 640, height: 480 })

  return (
    <>
      <ThreeScene width={dimensions.width} height={dimensions.height}>
        {({ scene, controls }) => {
          return (
            <>
              <Box scene={scene} />
              <PoseSkeleton scene={scene} landmarks={message.landmarks} />
            </>
          )
        }}
      </ThreeScene>
      <pre>{JSON.stringify(message, null, 2)}</pre>
    </>
  )
}
