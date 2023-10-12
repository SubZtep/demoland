import { createContext } from "react"

export const OptionsContext = createContext({ options: {} as Options, setOptions: (v: Options) => {} })
