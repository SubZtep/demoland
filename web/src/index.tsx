import { startConfetti, stopConfetti } from "./lib/confetti"
import { createHandLandmarker } from "./app/mediapipe"
import { render } from "solid-js/web"
import { Loop } from "./lib/loop"
import App from "./components/App"
import "cursor-bee"
import "./style.css"

render(() => <App />, document.getElementById("app")!)

await createHandLandmarker()

new Loop().start()

startConfetti()
setTimeout(() => stopConfetti(), 369)
