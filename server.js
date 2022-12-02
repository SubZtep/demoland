const { json } = require("express")
const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

io.on("connection", socket => {
  console.log("a user connected")
})

server.listen(6669, () => {
  console.log("listening on *:6669")
})

const colors = ["#E40303", "#FF8C00", "#FFED00", "#008026", "#24408E", "#732982"]
const url = "https://evilinsult.com/generate_insult.php?lang=en&type=json"
const timeout = 13_000
let controller
let signal

setInterval(() => {
  controller?.abort()
  controller = new AbortController()
  signal = controller.signal

  fetch(url, { options: { timeout, signal } })
    .then(res => Promise.all([res.status, res.json()]))
    .then(([status, { insult }]) => {
      if (status === 200) {
        io.emit("evilinsult", insult)
        console.log(``)
      }
    })
}, timeout)
