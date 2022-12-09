import { v4 } from "uuid"

export function initPlayerID() {
  let id = localStorage.getItem("player")
  if (!id) {
    id = v4()
    localStorage.setItem("player", id)
  }
  return id
}
