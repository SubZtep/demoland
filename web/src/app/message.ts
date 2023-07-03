import { unwrap, produce } from "solid-js/store"
import { socket, sendMessage } from "./conn"
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
  // console.log("received", msg)

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
            console.log("create obstacles", msg.obstacles)
            state.obstacles.push(...msg.obstacles)
          }
          if (msg.players) {
            state.players.push(...msg.players)
          }
        }),
      )
      break

    case "update":
      // console.log("update", state.obstacles.filter(v => msg.obstacles?.map(v => v.id).includes(v.id)).map(v => v.id))
      setState(
        produce(state => {
          state.obstacles
            .filter(v => msg.obstacles?.map(v => v.id).includes(v.id))
            .forEach(obs => {
              const msgobs = msg.obstacles?.find(v => v.id === obs.id)
              if (msgobs?.position) {
                obs.position = msgobs.position
              }
              if (msgobs?.rotation) {
                obs.rotation = msgobs.rotation
              }
            })
        }),
      )
      // console.log("update", [unwrap(msg)])
      // msg.obstacles?.forEach(msgobs => {
      //   const obs = state.obstacles.find(v => v.id === msgobs.id)
      //   if (obs?.object3d) {
      //     console.log("object3d update", [msgobs.position.x, msgobs.position.y, msgobs.position.z])
      //     obs.object3d.position.set(msgobs.position.x, msgobs.position.y, msgobs.position.z)
      //     if ("rotation" in msgobs) {
      //       obs.object3d.rotation.setFromQuaternion(
      //         new THREE.Quaternion(msgobs.rotation.x, msgobs.rotation.y, msgobs.rotation.z, msgobs.rotation.w),
      //       )
      //     }
      //     obs.object3d.updateMatrixWorld(true)
      //   }
      // })

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
