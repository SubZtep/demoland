import RAPIER from "@dimforge/rapier3d-compat"

interface Props {
  world: RAPIER.World
  id: string
  dimensions: Dimensions
  position: Position
}

export class Box {
  id: string
  world: RAPIER.World
  rigidBody: RAPIER.RigidBody
  collider: RAPIER.Collider
  dimensions: Dimensions

  constructor({ world, id, dimensions, position: { x, y, z } }: Props) {
    this.id = id
    this.world = world
    this.dimensions = dimensions

    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic).setUserData(id).setTranslation(x, y, z)
    this.rigidBody = this.world.createRigidBody(rigidBodyDesc)

    const { width, height, depth } = this.dimensions
    const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2, depth / 2)
    this.collider = this.world.createCollider(colliderDesc, this.rigidBody)
  }

  position(pos: RAPIER.Vector3) {
    this.rigidBody.setTranslation(pos, true)
  }

  serialize(command: "create" | "move" = "move") {
    const message = {
      id: this.id,
      command,
      position: this.rigidBody.translation(),
      rotation: this.rigidBody.rotation(),
    } as ServerMessage["obstacles"][number]
    if (message.command === "create") {
      message.dimensions = this.dimensions
    }
    return message
  }
}
