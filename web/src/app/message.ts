import { produce, unwrap } from "solid-js/store"
import { socket, sendMessage } from "../lib/websocket"
import { startConfetti, stopConfetti } from "../lib/confetti"
import { state, setState, players, myLandmarks } from "../state"

const anglesWorker = new Worker("/workers/angles.js")
const compareWorker = new Worker("/workers/compare.js")
let lastMessageReceivedTime = 0
let lastMessageSentTime = 0
let messageInterval: NodeJS.Timer

anglesWorker.onmessage = ({ data: message }) => {
  sendMessage(message)
}

compareWorker.addEventListener("message", ({ data: isSimilar }) => {
  if (isSimilar) {
    startConfetti()
  } else {
    stopConfetti()
  }
})

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data) as Player & { time: number }
  if (message.time <= lastMessageReceivedTime) return
  lastMessageReceivedTime = message.time

  if (!message.colour) {
    // remove player
    setState({
      playerIds: state.playerIds.filter(id => id !== message.id),
      lastPlayersUpdate: Date.now(),
      lastLandmarksUpdate: Date.now(),
    })
    players.delete(message.id)
    return
  }

  if (!players.has(message.id)) {
    players.set(message.id, message)
    setState(
      produce(state => {
        state.playerIds.push(message.id)
      })
    )
  } else if (players.get(message.id)!.colour !== message.colour) {
    document.querySelectorAll<HTMLElement>(`[data-pid="${message.id}"]`).forEach(el => {
      el.style.setProperty("--colour", message.colour)
    })
  }

  players.set(message.id, message)
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
