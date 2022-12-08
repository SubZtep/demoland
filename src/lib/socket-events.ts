import { io, type Socket } from "socket.io-client"
import { initPlayerID } from "./player"

class SocketEvents extends HTMLElement {
  #socket!: Socket
  /** Player, aka the current Client ID */
  #player!: string
  /** Player position */
  // #position?: LngLatTuple

  static get observedAttributes() {
    return ["player", "position"]
  }

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    // if (!this.hasAttribute("player")) {
    //   throw new Error("Missing required attribute `player`")
    // }
    // this.#player = this.getAttribute("player")!
    this.#socket = io()
    // this.#socket.emit("player", { player: this.#player, event: "connect" } as PlayerEventDetail)

    this.#socket.on("playerx", (player: PlayerEventDetail) => {
      console.log("DRAW ME i am client player from server", player)
    })
  }

  disconnectedCallback() {
    this.#socket.close()
  }

  attributeChangedCallback(name: "player" | "position", old: string, v: string) {
    switch (name) {
      case "player":
        if (old) {
          this.#socket.emit("player", { player: old, event: "disconnect" } as PlayerEventDetail)
        }
        this.#socket.emit("player", { player: v, event: "connect" } as PlayerEventDetail)
        break
      case "position":
        const position = v.split(",").map(Number) as LngLatTuple
        this.#socket.emit("player", {
          player: this.#player,
          event: "update",
          position
        } as PlayerEventDetail)
    }
  }
}

export default SocketEvents

// export function createSocketEventsElement() {
//   customElements.define("socket-events", SocketEvents)
//   const el = document.createElement("socket-events")
//   el.setAttribute("player", initPlayerID())
//   return el
// }
