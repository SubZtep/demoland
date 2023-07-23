import RAPIER from "@dimforge/rapier3d-compat"

export const channels = new Map<string, {
  player: Player
  world: RAPIER.World
  obstacles: Map<string, Obstacle>
}>()
