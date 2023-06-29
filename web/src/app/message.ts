import * as THREE from "three"
import { unwrap, produce } from "solid-js/store"
import { socket, sendMessage } from "../lib/websocket"
import { startConfetti, stopConfetti } from "../lib/confetti"
import { state, setState } from "./state"

const anglesWorker = new Worker("/workers/angles.js")
const compareWorker = new Worker("/workers/compare.js")
let lastMessageSentTime = 0
let messageInterval: NodeJS.Timer

anglesWorker.addEventListener("message", ({ data: player }) => {
  sendMessage({ cmd: "update", time: Date.now(), players: [player] } as ClientMessage)
})

compareWorker.addEventListener("message", ({ data: isSimilar }) => {
  if (isSimilar) {
    startConfetti()
  } else {
    stopConfetti()
  }
})

socket.addEventListener("message", ({ data }) => {
  const msg = JSON.parse(data) as ServerMessage

  switch (msg.cmd) {
    case "bye":
      setState(
        produce(state => {
          state.players = state.players.filter(player => player.id !== msg.player.id)
        }),
      )
      return

    case "create":
      setState(
        produce(state => {
          if (msg.obstacles) {
            state.obstacles.push(...msg.obstacles)
          }
          if (msg.players) {
            state.players.push(...msg.players)
          }
        }),
      )
      break

    case "update":
      msg.obstacles?.forEach(msgobs => {
        const obs = state.obstacles.find(v => v.id === msgobs.id)!
        obs.object3d!.position.set(msgobs.position.x, msgobs.position.y, msgobs.position.z)
        if ("rotation" in msgobs) {
          obs.object3d!.rotation.setFromQuaternion(
            new THREE.Quaternion(msgobs.rotation.x, msgobs.rotation.y, msgobs.rotation.z, msgobs.rotation.w),
          )
        }
      })

      if (msg.players) {
        setState(
          produce(state => {
            for (const msgPlayer of msg.players!) {
              const statePlayer = state.players.find(p => p.id === msgPlayer!.id)
              if (statePlayer) {
                Object.assign(statePlayer, msgPlayer)
              }
            }
          }),
        )
      }
      break
  }

  // find similar poses
  // if (state.players.length > 1) {
  //   const { playerIds, angleThreshold: threshold } = unwrap(state)
  //   compareWorker.postMessage({ playerIds, threshold, players })
  // } else {
  //   stopConfetti()
  // }
})

export const startMessageLoop = () => {
  messageInterval = setInterval(() => {
    if (state.lastLandmarksUpdate <= lastMessageSentTime) return

    anglesWorker.postMessage({ player: unwrap(state.player) })

    lastMessageSentTime = Date.now()
  }, state.messageDelay)
}

export const stopMessageLoop = () => {
  clearInterval(messageInterval)
}
