import { unwrap } from "solid-js/store"
import { state, setState } from "./state"
import { startMessageLoop, stopMessageLoop } from "./message"
import { sendMessage } from "./conn"

export function gotoLobby() {
  sendMessage({
    cmd: "create",
    players: [unwrap(state.player)],
  })
  startMessageLoop()
  setState({ lobby: true })
}

export function leaveLobby() {
  sendMessage({
    cmd: "bye",
    player: { id: state.player.id },
  })
  stopMessageLoop()
  setState({ lobby: false, players: [], obstacles: [] })
}
