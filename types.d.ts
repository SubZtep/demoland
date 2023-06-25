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
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number; w: number }
}

interface Message {
  cmd?: "list" | "hi" | "bye"
  player: RequireField<Partial<Player>, "id">
  players?: Player[]
  obstacles?: Obstacle[]
  time: number
}

type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>
