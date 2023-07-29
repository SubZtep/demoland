import { unwrap } from "solid-js/store"
import { state, setState } from "../state"
import { startMessageLoop, stopMessageLoop } from "./message"
import { sendMessage } from "./conn"

export function gotoLobby() {
  const { name, landmarks } = unwrap(state.player)
  startMessageLoop()
  sendMessage({ cmd: "player-hi", player: { name, landmarks } })
  setState({ playing: true })
}

export function leaveLobby() {
  if (state.playing) {
    sendMessage({ cmd: "player-bye", player: { name: state.player.name } })
    stopMessageLoop()
  }
  setState({ playing: false })
}
