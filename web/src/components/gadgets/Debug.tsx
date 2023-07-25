import { createEffect, createSignal, type Component } from "solid-js"

const Debug: Component<{ var: any }> = props => {
  const [debug, setDebug] = createSignal("")

  createEffect(() => {
    setDebug(JSON.stringify(props.var ?? {}, null, 2))
  })

  return <pre>{debug()}</pre>
}

export default Debug
