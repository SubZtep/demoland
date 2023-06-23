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
  if (isSimilar) {
    startConfetti()
  } else {
    stopConfetti()
  }
})

socket.addEventListener("message", ({ data }) => {
  const { cmd, time, players: msgPlayers, player } = JSON.parse(data) as Message
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
    players.set(player.id, players.has(player.id) ? { ...players.get(player.id)!, ...player } : (player as Player))
    setState({ lastPlayersUpdate: Date.now() })
  
    if (player.colour && players.get(player.id)!.colour !== player.colour) {
      document.querySelectorAll<HTMLElement>(`[data-pid="${player.id}"]`).forEach(el => {
        el.style.setProperty("--colour", player.colour!)
      })
    }
  }

  // find similar poses
  // if (players.size > 1) {
  //   const { playerIds, angleThreshold: threshold } = unwrap(state)
  //   compareWorker.postMessage({ playerIds, threshold, players })
  // } else {
  //   stopConfetti()
  // }
})

export const startMessageLoop = (fps = 30) => {
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
  }, 1_000 / fps)
}

export const stopMessageLoop = () => {
  clearInterval(messageInterval)
}
