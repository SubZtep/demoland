import { produce, unwrap } from "solid-js/store"
import { socket, sendMessage } from "../lib/websocket"
import { startConfetti, stopConfetti } from "../lib/confetti"
import { state, setState, players, myLandmarks } from "./state"

const anglesWorker = new Worker("/workers/angles.js")
const compareWorker = new Worker("/workers/compare.js")
let lastMessageReceivedTime = 0
let lastMessageSentTime = 0
let messageInterval: NodeJS.Timer

anglesWorker.addEventListener("message", ({ data: message }) => {
  sendMessage(message)
})

compareWorker.addEventListener("message", ({ data: isSimilar }) => {
  // if (isSimilar) {
  //   startConfetti()
  // } else {
  //   stopConfetti()
  // }
})

socket.addEventListener("message", ({ data }) => {
  const { time, players: remotePlayers, ...player } = JSON.parse(data) as Player & { time: number, players?: Player[] }
  if (time <= lastMessageReceivedTime) return
  lastMessageReceivedTime = time

  if (remotePlayers) {
    remotePlayers.forEach(player => {
      if (player.id === state.id) return
      players.set(player.id, player)
    })
    setState({ lastPlayersUpdate: Date.now(), players: Array.from(players.values()) })
    return
  }

  if (!player.colour) {
    // remove player
    setState({
      playerIds: state.playerIds.filter(id => id !== player.id),
      lastPlayersUpdate: Date.now(),
      lastLandmarksUpdate: Date.now(),
    })
    players.delete(player.id)
    return
  }

  if (!players.has(player.id)) {
    players.set(player.id, player)
    setState(
      produce(state => {
        state.playerIds.push(player.id)
      })
    )
  } else if (players.get(player.id)!.colour !== player.colour) {
    document.querySelectorAll<HTMLElement>(`[data-pid="${player.id}"]`).forEach(el => {
      el.style.setProperty("--colour", player.colour)
    })
  }

  players.set(player.id, player)
  setState({ lastPlayersUpdate: Date.now() })

  // find similar poses
  if (players.size > 1) {
    const { playerIds, angleThreshold: threshold } = unwrap(state)
    compareWorker.postMessage({ playerIds, threshold, players })
  } else {
    stopConfetti()
  }
})

export const startMessageLoop = (fps = 30) => {
  messageInterval = setInterval(() => {
    if (state.lastLandmarksUpdate <= lastMessageSentTime) return

    const message: Record<string, any> = {
      id: state.id,
      colour: state.colour,
      x: state.x,
      y: state.y,
      time: Date.now(),
    }

    if (myLandmarks.size > 0) {
      anglesWorker.postMessage({ message, landmarks: myLandmarks })
    }

    lastMessageSentTime = Date.now()
  }, 1_000 / fps)
}

export const stopMessageLoop = () => {
  clearInterval(messageInterval)
  sendMessage({ id: state.id, time: Date.now() })
}
