import { css } from "@emotion/css"
import { Show } from "solid-js/web"
import { type Component } from "solid-js"

const Loading: Component<{ visible: boolean }> = props => {
  return (
    <Show when={props.visible}>
      <div
        class={css`
          color: #ff0;
          font-size: 2rem;
        `}
      >
        Loading
      </div>
    </Show>
  )
}

export default Loading
