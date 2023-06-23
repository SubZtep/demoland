declare namespace NodeJS {
  export interface ProcessEnv {
    /** Express server port */
    PORT: string
  }
}

interface Player {
  id: string
  colour: string
  x: number
  y: number
}
