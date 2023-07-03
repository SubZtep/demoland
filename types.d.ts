type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>

interface Player {
  id: string
  colour: string
  dimensions: { dotSize: number }
  position: { x: number; y: number; z: number }
  landmarks: Landmark[]
  angles?: Angles
  updated?: number
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
  rigidBody?: RAPIER.RigidBody
  /** server side has rapier collider */
  collider?: RAPIER.Collider
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
