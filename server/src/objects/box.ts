import RAPIER from "@dimforge/rapier3d-compat"

export class Box {
  world: RAPIER.World
  body: RAPIER.RigidBody
  collider: RAPIER.Collider

  constructor(world: RAPIER.World) {
    this.world = world
    ;[this.body, this.collider] = this.createBox()
  }

  position(pos: RAPIER.Vector3) {
    this.body.setTranslation(pos, true)
  }

  private createBox(): [RAPIER.RigidBody, RAPIER.Collider] {
    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic)
    const rigidBody = this.world.createRigidBody(rigidBodyDesc)

    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.3, 0.3, 0.3)
    const collider = this.world.createCollider(colliderDesc, rigidBody)

    return [rigidBody, collider]
  }
}
