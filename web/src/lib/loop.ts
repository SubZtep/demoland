import { setState, myLandmarks } from "../app/state"
import { predictCamera } from "../app/mediapipe"

/** Run a function */
export const runOnce = new Set<TickFn>()

/** Run a function every frame */
export const runForever = new Set<TickFn>()

export class Loop {
  /** Set up the animation loop */
  #previousTime = 0

  start() {
    const animate = (currentTime: number) => {
      requestAnimationFrame(animate)

      // Calculate the time difference (delta) since the last frame
      const deltaTime = (currentTime - this.#previousTime) / 1000 // Convert to seconds
      this.#previousTime = currentTime

      runForever.forEach(fn => fn(deltaTime))
      runOnce.forEach(fn => fn(deltaTime))
      runOnce.clear()
    }

    requestAnimationFrame(animate)
    return this
  }
}
