/* @refresh reload */
import { render } from "solid-js/web"
import App from "./App"
import "./index.css"

document.body.classList.add(`sky-gradient-${new Date().getHours()}`)

render(() => <App />, document.getElementById("root"))
