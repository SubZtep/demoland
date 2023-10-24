import * as THREE from "three"
import CameraControls from "camera-controls"

CameraControls.install({ THREE })

const width = window.innerWidth / window.devicePixelRatio
const height = window.innerHeight / window.devicePixelRatio

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement
canvas.width = width
canvas.height = height

export const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  logarithmicDepthBuffer: true,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true

export const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 300)
export const controls = new CameraControls(camera, renderer.domElement)
controls.minDistance = 0.5
controls.maxDistance = 150
controls.setLookAt(0, 0.5, 3, 0, 1, 0, false)

export const scene = new THREE.Scene()
scene.background = new THREE.Color("#008B8B")

scene.add(createPlane(), ...createLights())

function createLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.35)

  const light = new THREE.DirectionalLight(0xffffff, 0.5)
  // const grid = new THREE.GridHelper(50, 50)
  light.castShadow = true
  light.position.set(-8, 15, 1)
  light.target.position.set(-8, 5, 1)
  // light.target.position.set(5, 10, -1)
  light.shadow.camera.near = 5
  light.shadow.camera.far = 25
  const side = 100
  light.shadow.camera.top = side
  light.shadow.camera.bottom = -side
  light.shadow.camera.left = side
  light.shadow.camera.right = -side

  const pointLight = new THREE.PointLight(0xff0000, 1, 100)
  pointLight.position.set(0, 1, 0)

  return [
    ambient,
    light,
    pointLight,
    // grid,
    new THREE.DirectionalLightHelper(light),
    new THREE.CameraHelper(light.shadow.camera),
  ]
}

function createPlane() {
  const geometry = new THREE.PlaneGeometry(100, 100)
  const material = new THREE.MeshPhongMaterial({ color: 0x00cc00 })
  const plane = new THREE.Mesh(geometry, material)
  plane.rotateX(Math.PI / -2)
  plane.receiveShadow = true
  return plane
}
