import { unwrap, produce } from "solid-js/store"
import { socket, sendMessage } from "./conn"
import { startConfetti, stopConfetti } from "../lib/confetti"
import { state, setState } from "../state"
import { set } from "lodash"

// const anglesWorker = new Worker("/workers/angles.js")
const compareWorker = new Worker("/workers/compare.js")
let lastMessageSentTime = 0
let messageInterval: NodeJS.Timer

// anglesWorker.addEventListener("message", ({ data: player }) => {
//   sendMessage({ cmd: "update", time: Date.now(), players: [player] } as ClientMessage)
// })

compareWorker.addEventListener("message", ({ data: isSimilar }) => {
  if (isSimilar) {
    startConfetti()
  } else {
    stopConfetti()
  }
})

socket.addEventListener("message", ({ data }) => {
  const msg = JSON.parse(data) as ServerMessage
  console.log("received", msg)

  switch (msg.cmd) {
    case "create-obstacles":
      setState("obstacles", msg.obstacles)
      break

    case "create-player":
      setState("player", msg.player)
      break

    case "error":
      setState({ error: msg.error })
      break

    // case "bye":
    //   setState(
    //     produce(state => {
    //       state.players = state.players.filter(player => player.id !== msg.player.id)
    //     }),
    //   )
    //   return

    // case "create":
    //   setState(
    //     produce(state => {
    //       if (msg.obstacles) {
    //         state.obstacles.push(...msg.obstacles)
    //       }
    //       // if (msg.player) {
    //       //   state.players.push(...msg.players)
    //       // }
    //     }),
    //   )
    //   break

    case "update":
      if (msg.player) {
        setState("landmarks", msg.player.landmarks!)
      }
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

      // if (msg.players) {
      //   setState(
      //     produce(state => {
      //       for (const msgPlayer of msg.players!) {
      //         const statePlayer = state.players.find(p => p.id === msgPlayer!.id)
      //         if (statePlayer) {
      //           Object.assign(statePlayer, msgPlayer)
      //         }
      //       }
      //     }),
      //   )
      // }
      break
  }
})

export const startMessageLoop = () => {
  messageInterval = setInterval(() => {
    if (state.lastLandmarksUpdate <= lastMessageSentTime) return

    sendMessage({ cmd: "update", time: Date.now(), player: unwrap(state.player) } as ClientMessage)

    lastMessageSentTime = Date.now()
  }, state.messageDelay)
}

export const stopMessageLoop = () => {
  clearInterval(messageInterval)
}
