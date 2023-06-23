interface Player {
  id: string
  x: number
  y: number
  colour: string
  landmarks?: Landmark[]
  angles?: Angles
}

interface Message {
  cmd?: "list" | "hi" | "bye"
  player: RequireField<Partial<Player>, "id">
  players?: Player[]
  time: number
}

type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>
