import { Pane } from "tweakpane"

const html = `<div class="gui-container"></div>`

const css = `
  .device-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
  }
`

class DevGui extends HTMLElement {
  #pane: Pane

  static get observedAttributes() {
    return ["tilt"]
  }

  constructor() {
    super()
    const style = document.createElement("style")
    style.textContent = css
    const wrapper = document.createElement("div")
    wrapper.classList.add("device-wrapper")
    wrapper.innerHTML = html
    this.attachShadow({ mode: "open" }).append(style, wrapper)
  }

  connectedCallback() {
    const shadowRoot = this.shadowRoot!
    this.#pane = new Pane({
      container: shadowRoot.querySelector<HTMLElement>(".gui-container")!,
      title: "START"
    })
  }

  attributeChangedCallback(_name, _old, value) {
    // this.turbulence.setAttributeNS(null, "baseFrequency", this.freq(+value))
  }
}

customElements.define("dev-gui", DevGui)

export {}
