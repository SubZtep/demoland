import { createContext } from "react"

export const Context = createContext({
  /** Active tab */
  tab: "Images" as any,
  setTab(tab: any) {
    this.tab = tab
  },
})
