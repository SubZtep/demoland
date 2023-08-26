import { startConfetti, stopConfetti } from "./lib/confetti"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./style.css"

const root = createRoot(document.getElementById("app")!)
root.render(<App />)

startConfetti()
setTimeout(() => stopConfetti(), 369)
