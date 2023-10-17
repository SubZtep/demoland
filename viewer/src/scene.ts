import * as THREE from "three"

const width = window.innerWidth / window.devicePixelRatio
const height = window.innerHeight / window.devicePixelRatio

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement
canvas.width = width
canvas.height = height

export const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 100)
camera.position.set(0, 0.5, -5)
camera.lookAt(new THREE.Vector3(0, 1, 0))

export const scene = new THREE.Scene()
scene.background = new THREE.Color("skyblue")

export const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  logarithmicDepthBuffer: false,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true


const material = new THREE.MeshPhongMaterial({ color: new THREE.Color("pink") })
const geometry = new THREE.BoxGeometry(2, 0.1, 2)

const box = new THREE.Mesh(geometry, material)
box.rotateY(90)
scene.add(box)


const ambient = new THREE.AmbientLight(0xffffff, 0.35)
const light = new THREE.DirectionalLight(0xffffff, 0.5)
const grid = new THREE.GridHelper(50, 50)

light.castShadow = true
light.position.set(-8, 15, 1)
light.target.position.set(5, 10, -1)
light.shadow.camera.near = 5
light.shadow.camera.far = 25
const side = 10
light.shadow.camera.top = side
light.shadow.camera.bottom = -side
light.shadow.camera.left = side
light.shadow.camera.right = -side

scene.add(
  ambient,
  light,
  grid,
  // new THREE.DirectionalLightHelper(light),
  // new THREE.CameraHelper(light.shadow.camera),
)

loadSkybox().then(texture => {
  scene.background = texture
  renderer.render(scene, camera)
})

async function loadSkybox(nr = 4): Promise<THREE.CubeTexture> {
  return new Promise((resolve, reject) => {
    if (nr < 1 || nr > 15) {
      return reject("a valid skybox number is between 1 and 15")
    }
    const loader = new THREE.CubeTextureLoader()
    const onError = (err: ErrorEvent | unknown) => reject(err)
    const onLoad = (texture: THREE.CubeTexture) => resolve(texture)
    const path = `/textures/skybox/${String(nr).padStart(2, "0")}/`
    const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.webp`)
    loader.setPath(path).load(urls, onLoad, undefined, onError)
  })
}
