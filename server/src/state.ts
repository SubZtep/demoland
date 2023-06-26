import type WebSocket from "ws"

export const connections = {
  active: 0,
  top: 0,
}

export const players = new Map<WebSocket, Player>()

export const obstacles = new Map<string, Obstacle>([
  [
    "ground",
    {
      id: "ground",
      component: "Plane",
      color: "#ffc26f",
      position: { x: 0, y: -0, z: 0 },
      rotation: { x: -90, y: 0, z: 0, w: 1 },
    },
  ],
  [
    "box",
    {
      id: "box",
      component: "Box",
      color: "pink",
      position: { x: 0, y: 10, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
    },
  ],
])
