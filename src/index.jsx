/* @refresh reload */
import { render } from "solid-js/web"
import { createSocketEventsElement } from "./lib/socket-events"
import App from "./App"
import "./index.css"

document.body.classList.add(`sky-gradient-${new Date().getHours()}`)
document.body.prepend(createSocketEventsElement())

render(() => <App />, document.getElementById("root"))
