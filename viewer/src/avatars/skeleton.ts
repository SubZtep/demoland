import * as THREE from "three"
import { POSE_CONNECTIONS, POSE_LANDMARKS } from "../const"

type Landmarks = { x: number, y: number, z: number }[]

const dotGeometry = new THREE.SphereGeometry(0.1)
const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }) // left hand
const redMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }) // right hand
const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 })

const leftHandIndices = [16, 18, 20, 22]
const rightHandIndices = [15, 17, 19, 21]

const dots = new Map<number, THREE.Mesh>()
const lines = new Set<THREE.Line>()
export const pose = new THREE.Group()

const createDot = (material = whiteMaterial) => {
  const dot = new THREE.Mesh(dotGeometry, material)
  dot.receiveShadow = true
  dot.castShadow = true
  return dot
}

const createLine = (from: THREE.Vector3, to: THREE.Vector3) => {
  const geometry = new THREE.BufferGeometry().setFromPoints([from, to])
  const line = new THREE.Line(geometry, lineMaterial)
  return line
}

const createObjects = (landmarks: Landmarks) => {
  // create joint dots
  for (let i = 0; i < landmarks.length; i++) {
    const dot = createDot(
      leftHandIndices.includes(i) ? blueMaterial : rightHandIndices.includes(i) ? redMaterial : whiteMaterial,
    )
    const { x, y, z } = landmarks[i]!
    dot.position.set(x, y, z)
    dots.set(i, dot)
    pose.add(dot)
  }
  POSE_CONNECTIONS.forEach(([a, b]) => {
    const { x: x1, y: y1, z: z1 } = landmarks[a]!
    const { x: x2, y: y2, z: z2 } = landmarks[b]!
    const line = createLine(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2))
    lines.add(line)
    pose.add(line)
  })
}

export const move = (landmarks: Landmarks) => {
  landmarks.forEach(({ x, y, z }, i) => {
    dots.get(i)?.position.set(x, y, z)
  })
  lines.clear()
}

createObjects(POSE_LANDMARKS.map(v => ({ ...v, y: v.y * -1 + 3 })))
