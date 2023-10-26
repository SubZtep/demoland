import RAPIER from "@dimforge/rapier3d-compat"

export class Box {
  id: string
  world: RAPIER.World
  body: RAPIER.RigidBody
  collider: RAPIER.Collider
  dimensions: Dimensions

  constructor(world: RAPIER.World, id: string, dimensions: Dimensions) {
    this.id = id
    this.world = world
    this.dimensions = dimensions
    ;[this.body, this.collider] = this.#createBox()
  }

  position(pos: RAPIER.Vector3) {
    this.body.setTranslation(pos, true)
  }

  serialize(command: "create" | "move" = "move") {
    const message = {
      id: this.id,
      command,
      position: this.body.translation(),
      rotation: this.body.rotation(),
    } as ServerMessage["obstacles"][number]
    if (message.command === "create") {
      message.dimensions = this.dimensions
    }
    return message
  }

  #createBox(): [RAPIER.RigidBody, RAPIER.Collider] {
    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic)
    const rigidBody = this.world.createRigidBody(rigidBodyDesc)

    const { width, height, depth } = this.dimensions
    const colliderDesc = RAPIER.ColliderDesc.cuboid(width, height, depth)
    const collider = this.world.createCollider(colliderDesc, rigidBody)

    return [rigidBody, collider]
  }
}
