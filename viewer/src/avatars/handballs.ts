import * as THREE from "three"

type Landmarks = { x: number; y: number; z: number }[]

const material = new THREE.MeshPhongMaterial({ color: new THREE.Color("#ffff00") })
const geometry = new THREE.SphereGeometry(0.2)

const leftBall = new THREE.Mesh(geometry, material)
const rightBall = new THREE.Mesh(geometry, material)

let lastLeftPos = new THREE.Vector3()
let lastRightPos = new THREE.Vector3()

export const balls = new THREE.Group()
balls.add(leftBall, rightBall)

export const move = (landmarks: Landmarks) => {
  const [right, left] = landmarks
    .filter((_, index) => [19, 20].includes(index))
    .map(v => ({ x: v.x * -1, y: v.y * -1 + 1, z: v.z * -1 }))

  const { x: lx, y: ly, z: lz } = left!
  const { x: rx, y: ry, z: rz } = right!

  const leftPos = new THREE.Vector3(lx, ly, lz)
  const rightPos = new THREE.Vector3(rx, ry, rz)

  const leftTo = lastLeftPos.lerp(leftPos, 0.5)
  const rightTo = lastRightPos.lerp(rightPos, 0.5)
    
  lastLeftPos = leftPos.clone()
  lastRightPos = rightPos.clone()

  leftBall.position.set(leftTo.x, leftTo.y, leftTo.z)
  rightBall.position.set(rightTo.x, rightTo.y, rightTo.z)
}
