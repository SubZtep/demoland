import { state, setState } from "./state"
import { startMessageLoop, stopMessageLoop } from "./message"
import { sendMessage } from "../lib/websocket"

export function gotoLobby() {
  sendMessage({
    cmd: "hello",
    player: {
      id: state.player.id,
      colour: state.player.colour,
      x: state.player.x,
      y: state.player.y,
    },
  })
  startMessageLoop()
  setState({ lobby: true })
}

export function leaveLobby() {
  sendMessage({
    cmd: "bye",
    player: {
      id: state.player.id,
    },
  })
  stopMessageLoop()
  setState({ lobby: false, players: [], obstacles: [] })
}
