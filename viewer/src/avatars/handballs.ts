import * as THREE from "three"

type Landmarks = { x: number; y: number; z: number }[]

const material = new THREE.MeshPhongMaterial({ color: new THREE.Color("#ffff00") })
const geometry = new THREE.SphereGeometry(0.2)

const leftBall = new THREE.Mesh(geometry, material)
const rightBall = new THREE.Mesh(geometry, material)

export const balls = new THREE.Group()
balls.add(leftBall, rightBall)

const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 0, 1, 0 );
balls.add( light );

export const move = (landmarks: Landmarks) => {
  const { x: lx, y: ly, z: lz } = landmarks[1]!
  const { x: rx, y: ry, z: rz } = landmarks[0]!
  leftBall.position.set(lx, ly, lz)
  rightBall.position.set(rx, ry, rz)
}
