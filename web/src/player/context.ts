import { createContext } from "react"

export const StreamingContext = createContext({ streaming: false, setStreaming: (v: boolean) => {} })
