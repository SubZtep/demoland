/// <reference types="vite/client" />

declare global {
  type Fn = () => void
  type LngLatTuple = [number, number]

  interface Player {
    /** Unique ID for each client */
    player: string

    /** `[longitude, latitude]` tuple that satisfy MapLibre's `LngLatLike` */
    position?: LngLatTuple
  }

  interface PlayerEventDetail extends Player {
    event: "connect" | "disconnect" | "update"
  }
}

export {}
