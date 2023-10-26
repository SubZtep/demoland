import type WebSocket from "ws"
import { type Box } from "./objects/box"

export const connections = {
  active: 0,
  top: 0,
}

/** @deprecated will became `channel` */
export const players = new Map<WebSocket, Player>()

export const obstacles = new Map<string, Box>()

export const updateStats = (wss: WebSocket.Server) => {
  connections.active = wss.clients.size
  if (connections.active > connections.top) {
    connections.top = connections.active
  }
}

export function getSerializedObstacles(obs): BoxObstacle[] {
  return (Array.from(obs.values()) as BoxObstacle[]).map(v => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rigidBody, collider, ...rest } = v
    return rest
  })
}

export function getSerializedPlayer(player: Player): Player {
  const { name, landmarks } = player
  return { name, landmarks }
}
