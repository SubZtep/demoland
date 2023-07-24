import type RAPIER from "@dimforge/rapier3d-compat"
import type WebSocket from "ws"

export const channels = new Map<
  string,
  {
    player: Player
    world: RAPIER.World
    obstacles: Map<string, Obstacle>
    viewers: Set<WebSocket>
  }
>()
