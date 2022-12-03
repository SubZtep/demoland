const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/socket.html")
})

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg)
  })
})

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`)
})

// const { json } = require("express")
// const express = require("express")
// const app = express()
// const http = require("http")
// const server = http.createServer(app)
// const { Server } = require("socket.io")
// const io = new Server(server)

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/socket.html")
// })

// io.on("connection", (socket) => {
//   console.log("a user connected")
// })

// server.listen(3000, () => {
//   console.log("listening on *:3000")
// })

// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg)
//   })
// })

// http.listen(port, () => {
//   console.log(`Socket.IO server running at http://localhost:${port}/`)
// })

// // const colors = [
// //   "#E40303",
// //   "#FF8C00",
// //   "#FFED00",
// //   "#008026",
// //   "#24408E",
// //   "#732982",
// // ]
// // const url = "https://evilinsult.com/generate_insult.php?lang=en&type=json"
// // const timeout = 13_000
// // let controller
// // let signal

// // setInterval(() => {
// //   controller?.abort()
// //   controller = new AbortController()
// //   signal = controller.signal

// //   fetch(url, { options: { timeout, signal } })
// //     .then((res) => Promise.all([res.status, res.json()]))
// //     .then(([status, { insult }]) => {
// //       if (status === 200) {
// //         io.emit("evilinsult", insult)
// //         console.log(``)
// //       }
// //     })
// // }, timeout)
