import { onMount, createEffect, on } from "solid-js"
import { Map as MapLibre, GeolocateControl, FullscreenControl, GeoJSONSource } from "maplibre-gl"
import {lngLatSignal } from "../store"
import "./map.css"

if (!((await import("maplibre-gl")) as any).supported()) {
  throw new Error("Your browser is not currently supported")
}

let map: MapLibre

export default function () {
  const [lngLat] = lngLatSignal

  onMount(() => {
    map = new MapLibre({
      container: "map",
      style: "style.json",
      attributionControl: false,
      zoom: 0
    })

    map.once("load", () => {
      const el = map.getContainer()
      el.classList.remove("hidden")
      nextTick(() => el.classList.remove("fade"))

      map
        .addControl(new FullscreenControl({ container: document.body }))
        .addControl(
          new GeolocateControl({
            // positionOptions: {
            //   enableHighAccuracy: true
            // },
            // trackUserLocation: false,
            showAccuracyCircle: true,
            showUserLocation: true,
            // showUserLocation: true,
            fitBoundsOptions: {
              // TODO: add don't move the map option
              padding: 30,
              maxZoom: 5
              // linear: true,
              // zoom: map.getZoom(),
              // center: map.getCenter(),
              // animate: false
            }
          })
        )
        .addSource("users", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "MultiPoint",
              coordinates: [[0, 0]]
            }
          }
        })
        .addLayer(
          {
            id: "userslayer",
            type: "circle",
            source: "users",
            paint: {
              "circle-radius": 8,
              "circle-color": "#ff0",
              "circle-opacity": 0.6,
              "circle-stroke-color": "#00f",
              "circle-stroke-width": 4,
              "circle-stroke-opacity": 0.8
            }
          },
          map.getStyle().layers.find(({ type }) => type === "symbol")?.id
        )
    })
  })

  createEffect(
    on(lngLat, v => {
      if (!v || !map) return

      const source = map.getSource("users") as GeoJSONSource
      if (source) {
        const data: GeoJSON.GeoJSON = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "MultiPoint",
            coordinates: [v]
          }
        }
        source.setData(data)
      }
    })
  )

  return <div id="map" class="hidden fade" />
}

function nextTick(callback: Fn) {
  setTimeout(callback, 1)
}
