import type { ControlPosition, IControl, Map as MapLibre } from "maplibre-gl"
import netIcon from "/network-wired.svg?raw"

let eventsEl: HTMLElement

export class SocketControl implements IControl {
  // #map!: MapLibre
  #container!: HTMLElement
  #button: HTMLButtonElement

  constructor() {
    this.#container = this.createContainerElement()
    this.#button = this.createButtonElement()
    this.#container.append(this.#button)
  }

  private onPlayerEvent({ detail: player }: CustomEvent<PlayerEventDetail>) {
    console.log("MAP ON PLAYER EVENT", player)
  }

  onAdd(map: MapLibre) {
    //   this.#map = map
    //   eventsEl = document.querySelector("socket-events")!
    //   // @ts-expect-error
    //   eventsEl.addEventListener("player", this.onPlayerEvent)
    return this.#container
  }

  onRemove() {
    // @ts-expect-error
    eventsEl.removeEventListener("player", this.onPlayerEvent)
    this.#container.parentNode!.removeChild(this.#container)
  }

  createContainerElement() {
    const container = document.createElement("div")
    container.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group")
    container.style.opacity = "0.6"
    return container
  }

  createButtonElement() {
    const button = document.createElement("button")
    button.classList.add("maplibregl-ctrl-icon", "socket-btn")
    button.title = "Displaying data from WebSocket"
    button.innerHTML = netIcon
    button.setAttribute("disabled", "")
    button.style.fill = "green"
    return button
  }

  getDefaultPosition(): ControlPosition {
    return "bottom-right"
  }
}
