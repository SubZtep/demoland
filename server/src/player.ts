import { type WebSocket } from "ws"

// export const players = new Map<WebSocket, Player>()

export const playerHandler = {
  // get (target: Player, prop: keyof Player) {
  //   // @ts-ignore
  //   // eslint-disable-next-line prefer-rest-params
  //   return Reflect.get(...arguments)
  // },

  set(obj: Player, prop: keyof Player, value: any) {
    console.log(".")
    obj[prop] = value
    return true
  },
}

// const player = new Proxy<Player>({
//   id: "",

// }, playerHandler)

export const initPlayer = (player: Player) => {}
