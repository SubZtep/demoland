import RAPIER from "@dimforge/rapier3d-compat"

export class Player {
  world: RAPIER.World
  leftBody: RAPIER.RigidBody
  rightBody: RAPIER.RigidBody
  leftCollider: RAPIER.Collider
  rightCollider: RAPIER.Collider

  constructor(world: RAPIER.World) {
    this.world = world
    ;[this.leftBody, this.leftCollider] = this.createBall(0.2)
    ;[this.rightBody, this.rightCollider] = this.createBall(0.2)
  }

  position(left: RAPIER.Vector3, right: RAPIER.Vector3) {
    this.leftBody.setTranslation(left, true)
    this.rightBody.setTranslation(right, true)
  }

  private createBall(radius: number): [RAPIER.RigidBody, RAPIER.Collider] {
    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic)
    const rigidBody = this.world.createRigidBody(rigidBodyDesc)

    const colliderDesc = RAPIER.ColliderDesc.ball(radius / 2).setSensor(true) // .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS).setSensor(true)
    // const collider = this.world.createCollider(colliderDesc, rigidBody)
    const collider = this.world.createCollider(colliderDesc)
    collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL)
    // collider
    // collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT | RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED)

    return [rigidBody, collider]
  }

  serialize() {
    return {
      left: this.leftBody.translation(),
      right: this.rightBody.translation(),
    }
  }
}
