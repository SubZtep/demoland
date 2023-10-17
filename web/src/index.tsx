import { createRoot } from "react-dom/client"
import * as Sentry from "@sentry/react"
// import App from "./App"
import "./style.css"

function App() {
  return <div>I am React</div>
}

Sentry.init({
  dsn: "https://3a2e355c5187e395deed22b12b982f0e@o326475.ingest.sentry.io/4506065002889216",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      // tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    }),
    // new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Session Replay
  // replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  // replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

const root = createRoot(document.getElementById("app")!)
root.render(<App />)
