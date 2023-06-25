import { unwrap } from "solid-js/store"
import { socket, sendMessage } from "../lib/websocket"
import { startConfetti, stopConfetti } from "../lib/confetti"
import { state, setState, players, myLandmarks, obstacles } from "./state"
import { Quaternion } from "three"

const anglesWorker = new Worker("/workers/angles.js")
const compareWorker = new Worker("/workers/compare.js")
let lastMessageReceivedTime = 0
let lastMessageSentTime = 0
let messageInterval: NodeJS.Timer

anglesWorker.addEventListener("message", ({ data: message }) => {
  // console.log("send", message)
  sendMessage(message)
})

compareWorker.addEventListener("message", ({ data: isSimilar }) => {
  if (isSimilar) {
    startConfetti()
  } else {
    stopConfetti()
  }
})

socket.addEventListener("message", ({ data }) => {
  // console.log("received", data)
  const { cmd, time, player, players: msgPlayers, obstacles: msgObstacles } = JSON.parse(data) as Message
  if (time <= lastMessageReceivedTime) return
  lastMessageReceivedTime = time

  if (msgPlayers) {
    msgPlayers.forEach(player => players.set(player.id, player))
    setState({
      playerIds: msgPlayers.map(v => v.id),
      lastPlayersUpdate: Date.now(),
    })
    return
  }

  if (cmd) {
    switch (cmd) {
      case "hi":
        players.set(player.id, player as Player)
        setState({
          playerIds: [...state.playerIds, player.id],
          lastPlayersUpdate: Date.now(),
        })
        return
      case "bye":
        setState({
          playerIds: state.playerIds.filter(id => id !== player.id),
          lastPlayersUpdate: Date.now(),
        })
        players.delete(player.id)
        return
    }
  }

  if (player) {
    players.set(player.id, {
      ...(players.has(player.id) ? { ...players.get(player.id)!, ...player } : (player as Player)),
      updated: Date.now(),
    })
    setState({ lastPlayersUpdate: Date.now() })

    // update html ui elements with new colour
    if (player.colour && players.get(player.id)!.colour !== player.colour) {
      document.querySelectorAll<HTMLElement>(`[data-pid="${player.id}"]`).forEach(el => {
        el.style.setProperty("--colour", player.colour!)
      })
    }
  }

  // find similar poses
  if (players.size > 1) {
    const { playerIds, angleThreshold: threshold } = unwrap(state)
    compareWorker.postMessage({ playerIds, threshold, players })
  } else {
    stopConfetti()
  }

  if (msgObstacles) {
    msgObstacles.forEach(({ id, position, rotation }) => {
      if (obstacles.has(id)) {
        const obj = obstacles.get(id)!
        obj.position.set(position.x, position.y, position.z)
        obj.rotation.setFromQuaternion(new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w))
      }
    })
  }
})

export const startMessageLoop = () => {
  messageInterval = setInterval(() => {
    if (state.lastLandmarksUpdate <= lastMessageSentTime) return

    const message: Message = {
      player: {
        id: state.id,
        colour: state.colour,
        x: state.x,
        y: state.y,
      },
      time: Date.now(),
    }

    if (myLandmarks.size > 0) {
      anglesWorker.postMessage({ message, landmarks: myLandmarks })
    }

    lastMessageSentTime = Date.now()
  }, state.messageDelay)
}

export const stopMessageLoop = () => {
  clearInterval(messageInterval)
}
