import * as THREE from "three"

type Landmarks = { x: number; y: number; z: number }[]

const material = new THREE.MeshPhongMaterial({ color: new THREE.Color("#ffff00") })
const geometry = new THREE.SphereGeometry(0.2)

const leftBall = new THREE.Mesh(geometry, material)
const rightBall = new THREE.Mesh(geometry, material)

export const balls = new THREE.Group()
balls.add(leftBall, rightBall)

const LEFT_HAND_INDICES = [16, 18, 20]
const RIGHT_HAND_INDICES = [15, 17, 19]

export const move = (landmarks: Landmarks) => {
  const { x: lx, y: ly, z: lz } = calculateMidpoint(LEFT_HAND_INDICES.map(index => landmarks[index]!))
  const { x: rx, y: ry, z: rz } = calculateMidpoint(RIGHT_HAND_INDICES.map(index => landmarks[index]!))

  leftBall.position.set(lx, ly, lz)
  rightBall.position.set(rx, ry, rz)

  const leftRot = calculateQuaternion(LEFT_HAND_INDICES.map(index => landmarks[index]))
  const rightRot = calculateQuaternion(RIGHT_HAND_INDICES.map(index => landmarks[index]))

  leftBall.rotation.setFromQuaternion(new THREE.Quaternion(leftRot.x, leftRot.y, leftRot.z, leftRot.w))
  rightBall.rotation.setFromQuaternion(new THREE.Quaternion(rightRot.x, rightRot.y, rightRot.z, rightRot.w))
}

function calculateQuaternion(coords: { x: number; y: number; z: number }[]) {
  // Calculate the rotation matrix.
  const rotationMatrix: any = calculateRotationMatrix(coords)

  // Convert the rotation matrix to a quaternion.
  const trace = rotationMatrix[0][0] + rotationMatrix[1][1] + rotationMatrix[2][2]
  let w: number, x: number, y: number, z: number

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(1 + trace)
    w = 0.25 / s
    x = (rotationMatrix[2][1] - rotationMatrix[1][2]) * s
    y = (rotationMatrix[0][2] - rotationMatrix[2][0]) * s
    z = (rotationMatrix[1][0] - rotationMatrix[0][1]) * s
  } else if (rotationMatrix[0][0] > rotationMatrix[1][1] && rotationMatrix[0][0] > rotationMatrix[2][2]) {
    const s = 2 * Math.sqrt(1 + rotationMatrix[0][0] - rotationMatrix[1][1] - rotationMatrix[2][2])
    w = (rotationMatrix[2][1] - rotationMatrix[1][2]) / s
    x = 0.25 * s
    y = (rotationMatrix[0][1] + rotationMatrix[1][0]) / s
    z = (rotationMatrix[0][2] + rotationMatrix[2][0]) / s
  } else if (rotationMatrix[1][1] > rotationMatrix[2][2]) {
    const s = 2 * Math.sqrt(1 + rotationMatrix[1][1] - rotationMatrix[0][0] - rotationMatrix[2][2])
    w = (rotationMatrix[0][2] - rotationMatrix[2][0]) / s
    x = (rotationMatrix[0][1] + rotationMatrix[1][0]) / s
    y = 0.25 * s
    z = (rotationMatrix[1][2] + rotationMatrix[2][1]) / s
  } else {
    const s = 2 * Math.sqrt(1 + rotationMatrix[2][2] - rotationMatrix[0][0] - rotationMatrix[1][1])
    w = (rotationMatrix[1][0] - rotationMatrix[0][1]) / s
    x = (rotationMatrix[0][2] + rotationMatrix[2][0]) / s
    y = (rotationMatrix[1][2] + rotationMatrix[2][1]) / s
    z = 0.25 * s
  }

  return { w, x, y, z }
}

function calculateRotationMatrix(coords: { x: number; y: number; z: number }[]) {

  // Calculate the centroid (average) of the original coordinates.
  const centroid = {
    x: 0,
    y: 0,
    z: 0,
  }

  for (const coord of coords) {
    centroid.x += coord.x
    centroid.y += coord.y
    centroid.z += coord.z
  }

  centroid.x /= coords.length
  centroid.y /= coords.length
  centroid.z /= coords.length

  // Translate the coordinates to move the centroid to the origin.
  const translatedCoords = coords.map(coord => ({
    x: coord.x - centroid.x,
    y: coord.y - centroid.y,
    z: coord.z - centroid.z,
  }))

  // Calculate the unit vectors.
  const unitVectors = translatedCoords.map(coord => {
    const magnitude = Math.sqrt(coord.x * coord.x + coord.y * coord.y + coord.z * coord.z)
    return {
      x: coord.x / magnitude,
      y: coord.y / magnitude,
      z: coord.z / magnitude,
    }
  })

  // Create the rotation matrix using the unit vectors.
  const rotationMatrix = [
    [unitVectors[0].x, unitVectors[1].x, unitVectors[2].x],
    [unitVectors[0].y, unitVectors[1].y, unitVectors[2].y],
    [unitVectors[0].z, unitVectors[1].z, unitVectors[2].z],
  ]

  return rotationMatrix
}

function calculateMidpoint(coords: { x: number; y: number; z: number }[]) {
  // Calculate the average of X, Y, and Z coordinates.
  let avgX = 0
  let avgY = 0
  let avgZ = 0

  for (const coord of coords) {
    avgX += coord.x
    avgY += coord.y
    avgZ += coord.z
  }

  avgX /= coords.length
  avgY /= coords.length
  avgZ /= coords.length

  // Create a new point for the midpoint.
  const midpoint = {
    x: avgX,
    y: avgY,
    z: avgZ,
  }

  return midpoint
}
