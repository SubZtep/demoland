import { onMount } from "solid-js"
import { Map as MapLibre, GeolocateControl, FullscreenControl, type GeolocateOptions } from "maplibre-gl"
import { SocketControl } from "../lib/socket-control"
import styles from "./map.module.css"

if (!((await import("maplibre-gl")) as any).supported()) {
  throw new Error("Your browser is not currently supported")
}

interface MapProps {
  /** Callback when user requests GPS coordinates */
  onGeolocate?: (lngLat: LngLatTuple) => void
}

let map: MapLibre

export default function ({ onGeolocate }: MapProps) {
  onMount(() => {
    map = new MapLibre({
      container: "map",
      style: "style.json",
      attributionControl: false
    })

    map.once("load", () => {
      const el = map.getContainer()
      el.classList.remove(styles.hidden)
      nextTick(() => el.classList.remove(styles.fade))

      const geolocate = new GeolocateControl({
        showAccuracyCircle: true,
        showUserLocation: true,
        fitBoundsOptions: {
          padding: 30,
          maxZoom: 5
        }
      } as GeolocateOptions)

      geolocate.on("geolocate", ({ coords: { latitude, longitude } }) => {
        onGeolocate?.([longitude, latitude])
      })

      map
        .addControl(new FullscreenControl({ container: document.body }))
        .addControl(geolocate)
        .addControl(new SocketControl())
    })
  })

  return <div id="map" class={[styles.map, styles.hidden, styles.fase].join(" ")} />
}

function nextTick(callback: Fn) {
  setTimeout(callback, 1)
}
