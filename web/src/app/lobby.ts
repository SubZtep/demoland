import { unwrap } from "solid-js/store"
import { state, setState } from "../state"
import { startMessageLoop, stopMessageLoop } from "./message"
import { sendMessage } from "./conn"

export function gotoLobby() {
  // let players: Player[] | undefined = undefined
  if (state.broadcast) {
    // players = [unwrap(state.player)]
  }
  const { name, landmarks } = unwrap(state.player)
  startMessageLoop()
  console.log("gotoLobby", { name, landmarks })
  sendMessage({ cmd: "create", player: { name, landmarks } })
  setState({ playing: true })
}

export function leaveLobby() {
  // if (state.broadcast) {
    sendMessage({
      cmd: "bye",
      player: { id: state.player.id },
    })
    stopMessageLoop()
  // }
  setState({ playing: false, players: [], obstacles: [] })
}
