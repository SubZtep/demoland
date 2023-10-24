import RAPIER from "@dimforge/rapier3d-compat"

export class Player {
  world: RAPIER.World
  leftBody: RAPIER.RigidBody
  rightBody: RAPIER.RigidBody
  leftCollider: RAPIER.Collider
  rightCollider: RAPIER.Collider

  constructor(world: RAPIER.World) {
    this.world = world
    ;[this.leftBody, this.leftCollider] = this.createBall()
    ;[this.rightBody, this.rightCollider] = this.createBall()
  }

  position(left: RAPIER.Vector3, right: RAPIER.Vector3) {
    this.leftBody.setTranslation(left, true)
    this.rightBody.setTranslation(right, true)
  }

  private createBall(): [RAPIER.RigidBody, RAPIER.Collider] {
    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic)
    const rigidBody = this.world.createRigidBody(rigidBodyDesc)

    const colliderDesc = RAPIER.ColliderDesc.ball(0.2) // .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
    const collider = this.world.createCollider(colliderDesc, rigidBody)
    // collider.setSensor(true)
    // collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT | RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED)

    return [rigidBody, collider]
  }
}
