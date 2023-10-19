
const logEl = document.getElementById("log")!

export const log = (message: string) => {
  logEl.innerText = message
}
