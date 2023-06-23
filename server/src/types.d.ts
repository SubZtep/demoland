declare namespace NodeJS {
  export interface ProcessEnv {
    /** WebSocket port */
    PORT: string
  }
}

interface Player {
  id: string
  colour: string
  x: number
  y: number
}
