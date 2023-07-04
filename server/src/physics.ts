import RAPIER from "@dimforge/rapier3d-compat"
import WebSocket from "ws"
import { getSerializedObstacles, obstacles } from "./state.js"

const gravity = { x: 0.0, y: -9.81, z: 0.0 }
const frameLimit = 1000 / 30
const message: UpdateMessage = { cmd: "update" }


export async function startPhysics(server: WebSocket.Server) {
  await RAPIER.init()
  const world = new RAPIER.World(gravity)
  createObstacles(world, obstacles)
  const gameLoop = () => {
    world.step()

    obstacles.forEach(obstacle => {
      if (obstacle.rigidBody) {
        obstacle.position = obstacle.rigidBody.translation()
        obstacle.rotation = obstacle.rigidBody.rotation()
      }
    })

    message.obstacles = getSerializedObstacles(obstacles).filter(v => v.id !== "ground")

    // broadcast to all clients
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })

    setTimeout(gameLoop, frameLimit)
  }

  gameLoop()

  setInterval(resetBox1, 5000)
  // setInterval(pushUpBox1, 5000)
}

function resetBox1() {
  const keys = Array.from(obstacles.keys())
  keys.forEach(key => {
    if (key === "box1") {
      const obstacle = obstacles.get(key)!
      if (obstacle.rigidBody) {
        obstacle.rigidBody.setTranslation(new RAPIER.Vector3(0.0, 3.0, 0.0), true)
      }
    }
  })
}

function pushUpBox1() {
  const keys = Array.from(obstacles.keys())
  keys.forEach(key => {
    if (key === "box1") {
      const obstacle = obstacles.get(key)!
      if (obstacle.rigidBody) {
        obstacle.rigidBody.applyImpulse({ x: 0, y: 1, z: 0 }, true)
      }
    }
  })
}

function createObstacles(world: RAPIER.World, obstacles: Map<string, Obstacle>) {
  obstacles.forEach((obstacle, id) => {
    if (id === "ground") {
      // create the ground
      const { width, height } = obstacle.dimensions
      const groundColliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, 0.1, height / 2).setTranslation(0.0, -0.1, 0.0)
      obstacle.collider = world.createCollider(groundColliderDesc)
    } else {
      // create the box
      const { x, y, z } = (obstacle as BoxObstacle).position
      const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z)
      obstacle.rigidBody = world.createRigidBody(rigidBodyDesc)

      const { width, height, depth } = (obstacle as BoxObstacle).dimensions
      const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2, depth / 2)
      obstacle.collider = world.createCollider(colliderDesc, obstacle.rigidBody)
    }
  })
}

export function createPlayerCollider() {
  // const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2, depth / 2)
  // obstacle.collider = world.createCollider(colliderDesc, obstacle.rigidBody)
}
