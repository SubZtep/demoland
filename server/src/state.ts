import type WebSocket from "ws"

export const connections = {
  active: 0,
  top: 0,
}

export const players = new Map<WebSocket, Player>()
