import { css } from "@emotion/css"
import { Show } from "solid-js/web"
import { type ParentComponent } from "solid-js"

const Text: ParentComponent<{ visible: boolean }> = props => {
  return (
    <Show when={props.visible}>
      <div
        class={css`
          color: #ff0;
          font-size: 2rem;
        `}
      >
        {props.children}
      </div>
    </Show>
  )
}

export default Text
