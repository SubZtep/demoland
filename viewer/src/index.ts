import * as THREE from "three"
import "./index.css"
import { camera, scene, renderer } from "./scene"
import { runForever, Loop } from "./loop"

new Loop().start()

runForever.add(() => {
  renderer.render(scene, camera)
})
