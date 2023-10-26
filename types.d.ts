type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>

type Landmark = import("./web/node_modules/@mediapipe/tasks-vision/").NormalizedLandmark
type Collider = import("./server/node_modules/@dimforge/rapier3d-compat").Collider
type RigidBody = import("./server/node_modules/@dimforge/rapier3d-compat").RigidBody

interface Player {
  /** @deprecated */
  id?: string
  name: string
  landmarks?: Landmark[]
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

// type Obstacle = PlaneObstacle | BoxObstacle

//
// MESSAGES
// WebSocket
//

interface PlayerHiMessage {
  cmd: "player-hi"
  player: Player
}

interface PlayerByeMessage {
  cmd: "player-bye"
  player: Pick<Player, "name">
}

interface CreatePlayerMessage {
  cmd: "create-player"
  player: Player
}

interface CreateObstaclesMessage {
  cmd: "create-obstacles"
  obstacles: Obstacle[]
}

interface UpdateMessage {
  cmd: "update"
  player?: Player
  obstacles?: Obstacle[]
}

interface ViewerHiMessage {
  cmd: "viewer-hi"
  channel: string
}

interface ViewerByeMessage {
  cmd: "viewer-bye"
  channel: string
}

interface ErrorMessage {
  cmd: "error"
  error: string
}

/** From server to client */
// type ServerMessage = PlayerHiMessage | UpdateMessage | PlayerByeMessage | CreateObstaclesMessage | CreatePlayerMessage | ErrorMessage

/** From client to server */
type ClientMessage = ViewerHiMessage | ViewerByeMessage | PlayerHiMessage | UpdateMessage | PlayerByeMessage

//
//
//
//
//
//

type Position = { x: number; y: number; z: number }
type Rotation = { x: number; y: number; z: number; w: number }
type Dimensions = { width: number; height: number; depth: number }

interface ServerMessage {
  channel: string
  player?: {
    left: Position
    right: Position
  }
  obstacles: (
    | {
        id: string
        command: "create"
        type: "box"
        position: Position
        rotation: Rotation
        dimensions: Dimensions
      }
    | {
        id: string
        command: "move"
        position: Position
        rotation: Rotation
      }
    | {
        id: string
        command: "destroy"
      }
  )[]
}
