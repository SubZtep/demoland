/* @refresh reload */
// import { render } from "solid-js/web"
// import { createSocketEventsElement } from "./lib/socket-events"
// import App from "./App"
import "./lib/socket-events"
import "./components/world-map"
import "./components/touch-joystick"
import "./main.css"

// document.body.classList.add(`sky-gradient-${new Date().getHours()}`)
// document.body.prepend(createSocketEventsElement())

// render(() => <App />, document.getElementById("root"))
import { createTRPCProxyClient, createWSClient, httpLink, splitLink, wsLink } from "@trpc/client"
// import AbortController from 'abort-controller';
// import fetch from 'node-fetch';
import ws from "ws"
import type { AppRouter } from "@nasi/server"

// polyfill fetch & websocket
// const globalAny = global as any
// globalAny.AbortController = AbortController
// globalAny.fetch = fetch
// globalAny.WebSocket = ws

const wsClient = createWSClient({
  url: `ws://localhost:2022`
})
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    // call subscriptions through websockets and the rest over http
    splitLink({
      condition(op) {
        return op.type === "subscription"
      },
      true: wsLink({
        client: wsClient
      }),
      false: httpLink({
        url: `http://localhost:2022`
      })
    })
  ]
})

async function main() {
  const helloResponse = await trpc.greeting.hello.query({
    name: "world"
  })

  console.log("helloResponse", helloResponse)

  const createPostRes = await trpc.post.createPost.mutate({
    title: "hello world",
    text: "check out https://tRPC.io"
  })
  console.log("createPostResponse", createPostRes)

  let count = 0
  await new Promise<void>(resolve => {
    const subscription = trpc.post.randomNumber.subscribe(undefined, {
      onData(data) {
        // ^ note that `data` here is inferred
        console.log("received", data)
        count++
        if (count > 3) {
          // stop after 3 pulls
          subscription.unsubscribe()
          resolve()
        }
      },
      onError(err) {
        console.error("error", err)
      }
    })
  })
  wsClient.close()
}

main()
