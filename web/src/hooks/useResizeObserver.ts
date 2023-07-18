import { onCleanup, onMount } from "solid-js"

function useResizeObserver(el: HTMLElement | undefined, callback: (width: number, height: number) => void) {
  const resizer = new ResizeObserver(() => {
    callback(el?.clientWidth ?? 0, el?.clientHeight ?? 0)
  })
  onMount(() => {
    if (el) {
      resizer.observe(el)
    }
  })

  onCleanup(() => {
    resizer?.disconnect()
  })

  return resizer
}

export default useResizeObserver
