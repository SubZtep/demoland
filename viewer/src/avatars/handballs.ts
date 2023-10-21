import * as THREE from "three"

type Landmarks = { x: number; y: number; z: number }[]

const material = new THREE.MeshPhongMaterial({ color: new THREE.Color("#ffff00") })
const geometry = new THREE.SphereGeometry(0.2)

const leftBall = new THREE.Mesh(geometry, material)
const rightBall = new THREE.Mesh(geometry, material)

export const balls = new THREE.Group()
balls.add(leftBall, rightBall)

export const move = (landmarks: Landmarks) => {
  const [right, left] = landmarks
      .filter((_, index) => [19, 20].includes(index))
      .map(v => ({ x: v.x * -1, y: v.y * -1 + 1, z: v.z * -1 }))
  const { x: lx, y: ly, z: lz } = left!
  const { x: rx, y: ry, z: rz } = right!
  leftBall.position.set(lx, ly, lz)
  rightBall.position.set(rx, ry, rz)
}
