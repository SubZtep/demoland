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
      dimensions: { width: 10, height: 10 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0, w: 1 },
    },
  ],
  [
    "box1",
    {
      id: "box1",
      component: "Box",
      color: "red",
      position: { x: 0, y: 100, z: 0 },
      // position: { x: 0, y: 0.25, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      dimensions: { width: 0.5, height: 0.5, depth: 0.5 },
    },
  ],
  [
    "box2",
    {
      id: "box2",
      component: "Box",
      color: "green",
      position: { x: 0, y: 0.75, z: 0 },
      rotation: { x: 0, y: 0.131, z: 0, w: 0.991 },
      dimensions: { width: 0.5, height: 0.5, depth: 0.5 },
    },
  ],
  [
    "box3",
    {
      id: "box3",
      component: "Box",
      color: "blue",
      position: { x: 0, y: 1.25, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      dimensions: { width: 0.5, height: 0.5, depth: 0.5 },
    },
  ],
])

export function getSerializedObstacles(obs): BoxObstacle[] {
  return (Array.from(obs.values()) as BoxObstacle[]).map(v => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rigidBody, collider, ...rest } = v
    return rest
  })
}
