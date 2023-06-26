import * as THREE from "three"
import { unwrap } from "solid-js/store"
import { socket, sendMessage } from "../lib/websocket"
import { startConfetti, stopConfetti } from "../lib/confetti"
import { state, setState, players, myLandmarks, obstacles } from "./state"

const anglesWorker = new Worker("/workers/angles.js")
const compareWorker = new Worker("/workers/compare.js")
let lastMessageReceivedTime = 0
let lastMessageSentTime = 0
let messageInterval: NodeJS.Timer

anglesWorker.addEventListener("message", ({ data: player }) => {
  sendMessage({ cmd: "update", time: Date.now(), player } as ClientMessage)
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
      setState({
        playerIds: state.playerIds.filter(id => id !== msg.player.id),
        lastPlayersUpdate: Date.now(),
      })
      players.delete(msg.player.id)
      return

    case "create":
      const stateUpdates: any = { lastPlayersUpdate: Date.now() }
      if (msg.obstacles) {
        msg.obstacles.forEach(obstacle => {
          obstacles.set(obstacle.id, obstacle)
        })
        stateUpdates.obstacleIds = Array.from(obstacles.keys())
      }
      if (msg.players) {
        msg.players.forEach(player => {
          players.set(player.id, player)
        })
        stateUpdates.playerIds = Array.from(players.keys())
      }
      setState(stateUpdates)
      break

    case "update":
      if (msg.time <= lastMessageReceivedTime) return
      lastMessageReceivedTime = msg.time

      msg.obstacles?.forEach(msgobs => {
        const obs = obstacles.get(msgobs.id)!
        obs.object3d!.position.set(msgobs.position.x, msgobs.position.y, msgobs.position.z)
        obs.object3d!.rotation.setFromQuaternion(
          new THREE.Quaternion(msgobs.rotation.x, msgobs.rotation.y, msgobs.rotation.z, msgobs.rotation.w),
        )
        obstacles.set(msgobs.id, { ...obs, ...msgobs })
      })

      msg.players?.forEach(msgplayer => {
        const player = players.get(msgplayer.id)!
        players.set(msgplayer.id, { ...player, ...msgplayer, updated: Date.now() })
      })

      if (msg.player) {
        const player = players.get(msg.player.id)!
        players.set(msg.player.id, { ...player, ...msg.player, updated: Date.now() })
      }

      setState({
        lastPlayersUpdate: Date.now(),
      })
      break
  }

  // find similar poses
  if (players.size > 1) {
    const { playerIds, angleThreshold: threshold } = unwrap(state)
    compareWorker.postMessage({ playerIds, threshold, players })
  } else {
    stopConfetti()
  }
})

export const startMessageLoop = () => {
  messageInterval = setInterval(() => {
    if (state.lastLandmarksUpdate <= lastMessageSentTime) return

    if (myLandmarks.size > 0) {
      anglesWorker.postMessage({
        player: {
          id: state.id,
          colour: state.colour,
          x: state.x,
          y: state.y,
        },
        landmarks: myLandmarks,
      })
    }

    lastMessageSentTime = Date.now()
  }, state.messageDelay)
}

export const stopMessageLoop = () => {
  clearInterval(messageInterval)
}
