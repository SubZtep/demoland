// @ts-nocheck
import maplibgegl, {
  Map as MapLibre,
  GeolocateControl,
  FullscreenControl,
  type GeolocateOptions,
  LayerSpecification
} from "maplibre-gl"
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
  .maplibregl-ctrl-bottom-left {
    display: flex;
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
    fetch("css/maplibre-gl.css")
      .then(style => style.text())
      .then(css => this.#style.insertAdjacentText("beforeend", css))

    map = new MapLibre({
      container: this.#el,
      style: "https://api.maptiler.com/maps/fd4b92a2-66ef-4be1-afe7-c17ce466c45a/style.json?key=heAbRi5uv37OZtIz5txX",
      attributionControl: false,
      scrollZoom: true
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
        }
      } as GeolocateOptions)

      // geolocate.on("geolocate", ({ coords: { latitude, longitude } }) => {
      //   onGeolocate?.([longitude, latitude])
      // })

      map
        .addControl(new FullscreenControl({ container: document.body }), "top-left")
        .addControl(new SocketControl(), "bottom-left")
        .addControl(geolocate, "bottom-left")
        .removeLayerByType("symbol")
    })
  }
}

customElements.define("world-map", WorldMap)

export {}

function nextTick(callback: Fn) {
  setTimeout(callback, 0)
}

MapLibre.prototype.removeLayerByType = function (type: LayerSpecification["type"]) {
  // console.log("map", map.getStyle().layers
  this
    .getStyle()
    .layers.filter(v => v.type === type)
    .forEach(v => {
      map.removeLayer(v.id)
    })
  return this
}
