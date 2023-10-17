import * as THREE from "three"
import "./index.css"

const width = window.innerWidth / window.devicePixelRatio
const height = window.innerHeight / window.devicePixelRatio

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement
canvas.width = width
canvas.height = height

const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 100)
camera.position.set(0, 1, -3)
camera.lookAt(new THREE.Vector3(0, 1, 0))

const scene = new THREE.Scene()
scene.background = new THREE.Color("skyblue")

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  logarithmicDepthBuffer: false,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true

const material = new THREE.MeshPhongMaterial({ color: new THREE.Color("pink") })
const geometry = new THREE.BoxGeometry(1, 1, 1)

const box = new THREE.Mesh(geometry, material)
scene.add(box)

const light = new THREE.DirectionalLight()
light.position.set(0, 10, -10)
light.target.position.set(0, 5, 0)
const helper = new THREE.DirectionalLightHelper(light)
scene.add(light, helper)

renderer.render(scene, camera)
