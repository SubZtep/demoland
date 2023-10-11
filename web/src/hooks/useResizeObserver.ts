import { type Ref, useEffect, useRef } from "react"

function useResizeObserver(el: Ref<HTMLElement>, callback: (width: number, height: number) => void) {
  const resizer = useRef<ResizeObserver>()

  useEffect(() => {
    resizer.current = new ResizeObserver(() => {
      callback(el?.clientWidth ?? 0, el?.clientHeight ?? 0)
    })

    resizer.current.observe(el)

    return () => {
      resizer?.disconnect()
    }
  }, [])

  return resizer
}

export default useResizeObserver
