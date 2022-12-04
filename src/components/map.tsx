import { onMount } from "solid-js"
import { Map as MapLibre, NavigationControl, GeolocateControl, FullscreenControl } from "maplibre-gl"
import "./map.css"

if (!((await import("maplibre-gl")) as any).supported()) {
  throw new Error("Your browser is not currently supported")
}

export default function () {
  onMount(() => {
    const map = new MapLibre({
      container: "map",
      style: "/style.json",
      attributionControl: false,
      zoom: 0
    })

    map.once("load", () => {
      const el = map.getContainer()
      el.classList.remove("hidden")
      nextTick(() => el.classList.remove("fade"))

      map.addControl(
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showAccuracyCircle: false
        }),
        "bottom-right"
      )

      map.addControl(
        new NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true
        }),
        "bottom-right"
      )

      map.addControl(new FullscreenControl({ container: document.body }))
    })
  })

  return <div id="map" class="hidden fade" />
}

function nextTick(callback: Fn) {
  setTimeout(callback, 1)
}
