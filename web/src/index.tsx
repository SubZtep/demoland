import { startConfetti, stopConfetti } from "./lib/confetti"
import { render } from "solid-js/web"
import { Loop } from "./lib/loop"
import App from "./App"
// import "cursor-bee"
import "./style.css"

render(() => <App />, document.body)

new Loop().start()

startConfetti()
setTimeout(() => stopConfetti(), 369)
