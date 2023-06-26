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

interface Obstacle {
  id: string
  component: string
  color: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number; w: number }
  object3d?: THREE.Object3D
}

//
// MESSAGES
//

type HelloMessage = {
  cmd: "hello"
  player: Player
}

type CreateMessage = {
  cmd: "create"
  players?: Player[]
  obstacles?: Obstacle[]
}

type ByeMessage = {
  cmd: "bye"
  player: Pick<Player, "id">
}

type UpdateMessage = {
  cmd: "update"
  player?: Player
  players?: Player[]
  obstacles?: Obstacle[]
  time: number
}

type ServerMessage = CreateMessage | UpdateMessage | ByeMessage

type ClientMessage = HelloMessage | UpdateMessage | ByeMessage
