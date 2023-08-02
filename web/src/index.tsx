import { startConfetti, stopConfetti } from "./lib/confetti"
import { render } from "solid-js/web"
import App from "./App"
import "./style.css"

render(() => <App />, document.body)

startConfetti()
setTimeout(() => stopConfetti(), 369)
