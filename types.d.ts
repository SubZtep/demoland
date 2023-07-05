type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>

type Landmark = import("./web/node_modules/@mediapipe/tasks-vision/").NormalizedLandmark
type Collider = import("./server/node_modules/@dimforge/rapier3d-compat").Collider
type RigidBody = import("./server/node_modules/@dimforge/rapier3d-compat").RigidBody

interface Player {
  id: string
  colour: string
  dimensions: { dotSize: number }
  position: { x: number; y: number; z: number }
  landmarks: Landmark[]
  angles?: Angles
  // updated?: number
  /** server side can has rapier rigid bodies */
  rigidBodies?: RigidBody[]
  /** server side has rapier colliders */
  colliders?: Collider[]
}

//
// OBSTACLES
// Server generated 3d objects with physics
//

interface BaseObstacle {
  id: string
  color: string
  position: { x: number; y: number; z: number }
  /** no rotation no rigid body */
  rotation?: { x: number; y: number; z: number; w: number }
  /** client side has three.js object */
  object3d?: THREE.Object3D
  /** server side can has rapier rigid body */
  rigidBody?: RigidBody
  /** server side has rapier collider */
  collider?: Collider
}

interface PlaneObstacle extends BaseObstacle {
  component: "Plane"
  dimensions: { width: number; height: number }
}

interface BoxObstacle extends BaseObstacle {
  component: "Box"
  dimensions: { width: number; height: number; depth: number }
}

type Obstacle = PlaneObstacle | BoxObstacle

//
// MESSAGES
// WebSocket
//

interface CreateMessage {
  cmd: "create"
  players?: Player[]
  obstacles?: Obstacle[]
}

interface ByeMessage {
  cmd: "bye"
  player: Pick<Player, "id">
}

interface UpdateMessage {
  cmd: "update"
  players?: Player[]
  obstacles?: Obstacle[]
}

/** From server to client */
type ServerMessage = CreateMessage | UpdateMessage | ByeMessage

/** From client to server */
type ClientMessage = CreateMessage | UpdateMessage | ByeMessage
