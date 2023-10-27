import RAPIER from "@dimforge/rapier3d-compat"

export class Player {
  world: RAPIER.World
  leftBody: RAPIER.RigidBody
  rightBody: RAPIER.RigidBody
  leftCollider: RAPIER.Collider
  rightCollider: RAPIER.Collider
  #oldLeft: Position
  #oldRight: Position

  constructor(world: RAPIER.World) {
    this.world = world
    ;[this.leftBody, this.leftCollider] = this.createBall(0.2, "left")
    ;[this.rightBody, this.rightCollider] = this.createBall(0.2, "right")
    this.#oldLeft = { x: 0, y: 0, z: 0 }
    this.#oldRight = { x: 0, y: 0, z: 0 }
  }

  position(left: Position, right: Position) {
    this.leftCollider.setTranslation(left)
    this.rightCollider.setTranslation(right)
    // this.leftBody.setTranslation(left, true)
    // this.rightBody.setTranslation(right, true)
    // this.leftBody.addForceAtPoint(this.#oldLeft, left, true)
    // this.leftBody.addForceAtPoint(this.#oldRight, right, true)
  }

  private createBall(radius: number, userData: string): [RAPIER.RigidBody, RAPIER.Collider] {
    const rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic).setUserData()
    const rigidBody = this.world.createRigidBody(rigidBodyDesc)

    const colliderDesc = RAPIER.ColliderDesc.ball(radius / 2).setSensor(true)
    // const collider = this.world.createCollider(colliderDesc, rigidBody)
    const collider = this.world.createCollider(colliderDesc)
    // collider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL)

    return [rigidBody, collider]
  }

  serialize() {
    return {
      left: this.leftCollider.translation(),
      right: this.rightCollider.translation(),
      // left: this.leftBody.translation(),
      // right: this.rightBody.translation(),
    }
  }
}
