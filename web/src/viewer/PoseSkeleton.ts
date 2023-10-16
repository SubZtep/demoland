import * as THREE from "three"
import { POSE_LANDMARKS } from "../const"
import { useEffect, useRef } from "react"

const dotGeometry = new THREE.SphereGeometry(0.1)
const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }) // left hand
const redMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }) // right hand
const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })

const leftHandIndices = [16, 18, 20, 22]
const rightHandIndices = [15, 17, 19, 21]

interface Props {
  pid?: string
  scene: THREE.Scene
  landmarks: Landmark[]
}

export default function PoseSkeleton({ pid, scene, landmarks }: Props) {
  const dots = useRef(new Map<number, THREE.Mesh>())
  const pose = useRef(new THREE.Group())

  const createDot = (material = whiteMaterial) => {
    const dot = new THREE.Mesh(dotGeometry, material)
    dot.receiveShadow = true
    dot.castShadow = true
    return dot
  }

  const createObjects = () => {
    // create joint dots
    for (let i = 0; i < POSE_LANDMARKS.length; i++) {
      const dot = createDot(
        leftHandIndices.includes(i) ? blueMaterial : rightHandIndices.includes(i) ? redMaterial : whiteMaterial,
      )
      dots.current.set(i, dot)
      pose.current.add(dot)
    }
  }

  useEffect(() => {
    createObjects()
    scene.add(pose.current)

    const grid = new THREE.GridHelper(10, 10)
    console.log("G", grid)
    scene.add(grid)
    
    return () => {
      dots.current.forEach(dot => pose.current.remove(dot))
      scene.remove(pose.current)
      scene.remove(grid)
    }
  }, [])

  useEffect(() => {
    landmarks.forEach(({ x, y, z }, i) => {
      
      dots.current.get(i)!.position.set(x, y * -1 + 3, z)
    })
  }, [landmarks])

  return null
}
