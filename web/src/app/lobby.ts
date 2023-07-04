import { unwrap } from "solid-js/store"
import { state, setState } from "./state"
import { startMessageLoop, stopMessageLoop } from "./message"
import { sendMessage } from "./conn"

export function gotoLobby() {
  let players: Player[] | undefined = undefined
  if (state.broadcast) {
    players = [unwrap(state.player)]
    startMessageLoop()
  }
  sendMessage({ cmd: "create", players })
  setState({ lobby: true })
}

export function leaveLobby() {
  if (state.broadcast) {
    sendMessage({
      cmd: "bye",
      player: { id: state.player.id },
    })
    stopMessageLoop()
  }
  setState({ lobby: false, players: [], obstacles: [] })
}
