type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>

interface Player {
  id: string
  x: number
  y: number
  colour: string
  landmarks?: Landmark[]
  angles?: Angles
  updated?: number
}

//
// OBSTACLES
//

interface BaseObstacle {
  id: string
  color: string
  position: { x: number; y: number; z: number }
  /** client side has three.js object */
  object3d?: THREE.Object3D
}

interface PlaneObstacle extends BaseObstacle {
  component: "Plane"
  dimensions: { width: number; height: number }
}

interface BoxObstacle extends BaseObstacle {
  component: "Box"
  dimensions: { width: number; height: number; depth: number }
  rotation: { x: number; y: number; z: number; w: number }
}

type Obstacle = PlaneObstacle | BoxObstacle

//
// MESSAGES
//

interface HelloMessage {
  cmd: "hello"
  player: Player
}

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
  player?: Player
  players?: Player[]
  obstacles?: Obstacle[]
  time: number
}

type ServerMessage = CreateMessage | UpdateMessage | ByeMessage

type ClientMessage = HelloMessage | UpdateMessage | ByeMessage
