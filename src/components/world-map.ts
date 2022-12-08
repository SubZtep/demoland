import maplibgegl, { Map as MapLibre, GeolocateControl, FullscreenControl, type GeolocateOptions } from "maplibre-gl"
import { SocketControl } from "../lib/socket-control"

const css = `
  .map {
    position: absolute !important;
    width: 100vw;
    height: 100vh;
  }

  .fade {
    transition: opacity 300ms;
  }

  .unvisible {
    opacity: 0;
  }
`

let map: MapLibre

class WorldMap extends HTMLElement {
  #style: HTMLStyleElement
  #el: HTMLDivElement

  constructor() {
    super()
    if (!maplibgegl.supported()) {
      throw new Error("Your browser is not currently supported")
    }
    this.#style = document.createElement("style")
    this.#style.textContent = css
    this.#el = document.createElement("div")
    this.#el.classList.add("map", "unvisible", "fade")
    this.attachShadow({ mode: "open" }).append(this.#style, this.#el)
  }

  connectedCallback() {
    fetch("./maplibre-gl.css")
      .then(style => style.text())
      .then(css => this.#style.insertAdjacentText("beforeend", css))

    map = new MapLibre({
      container: this.#el,
      style: "style.json",
      attributionControl: false
    })

    map.once("load", () => {
      const el = map.getContainer()
      el.classList.remove("unvisible")
      nextTick(() => el.classList.remove("fade"))

      const geolocate = new GeolocateControl({
        showAccuracyCircle: true,
        showUserLocation: true,
        fitBoundsOptions: {
          padding: 30,
          maxZoom: 5
        }
      } as GeolocateOptions)

      // geolocate.on("geolocate", ({ coords: { latitude, longitude } }) => {
      //   onGeolocate?.([longitude, latitude])
      // })

      map
        .addControl(new FullscreenControl({ container: document.body }))
        .addControl(geolocate)
        .addControl(new SocketControl())
    })
  }
}

customElements.define("world-map", WorldMap)

export {}

function nextTick(callback: Fn) {
  setTimeout(callback, 1)
}
