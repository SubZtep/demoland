import { useState, type RefObject, useEffect, useRef } from "react"

export default function useDimensions(elementRef: RefObject<HTMLElement>) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const resizer = useRef<ResizeObserver>()

  useEffect(() => {
    resizer.current = new ResizeObserver(() => {
      setWidth(elementRef.current?.clientWidth ?? 0)
      setHeight(elementRef.current?.clientHeight ?? 0)
    })
    resizer.current.observe(elementRef.current!)

    return () => {
      resizer.current?.disconnect()
    }
  }, [])

  return { width, height }
}
