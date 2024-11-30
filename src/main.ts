import * as THREE from "three"
import "./style.css"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const aspect = window.innerWidth / window.innerHeight
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setAnimationLoop(animate)

const color = 0x112200
const bgColor = 0x031619

renderer.setClearColor(bgColor)

camera.position.z = 18

const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({ color })
const fog = new THREE.Fog(bgColor, 8, 20)

material.color.set(color)
scene.overrideMaterial = material
scene.fog = fog

const cubes = new Set<THREE.Mesh>()

for (let i = 0; i < 100; i++) {
  const cube = createCube()
  cube.position.x = Math.random() * 100 - 50
  cube.position.y = Math.random() * 100 - 50
  cubes.add(cube)
}

function animate() {
  cubes.forEach(cube => {
    cube.rotation.x += Math.random() / 30
    cube.rotation.y += Math.random() / 30
  })

  renderer.render(scene, camera)
}

function createCube() {
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  return cube
}
