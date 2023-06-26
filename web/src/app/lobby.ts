import { state, setState, players, obstacles } from "./state"
import { startMessageLoop, stopMessageLoop } from "./message"
import { sendMessage } from "../lib/websocket"

export function gotoLobby() {
  sendMessage({
    cmd: "hello",
    player: {
      id: state.id,
      colour: state.colour,
      x: state.x,
      y: state.y,
    },
  })
  startMessageLoop()
  setState({ lobby: true })
}

export function leaveLobby() {
  sendMessage({
    cmd: "bye",
    player: {
      id: state.id,
    },
  })
  stopMessageLoop()
  setState({ lobby: false, playerIds: [], obstacleIds: [] })
  players.clear()
  obstacles.clear()
}
