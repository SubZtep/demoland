import { createSignal, onMount, batch } from "solid-js"
import Hammer from "hammerjs"
import { lngLatSignal } from "../store"
import "./Joystick.css"
import { io } from "socket.io-client"
import debounce from "lodash/debounce"

delete Hammer.defaults.cssProps.userSelect

export default function () {
  const [verticalAxis, setVerticalAxis] = createSignal(0)
  const [horizontalAxis, setHorizontalAxis] = createSignal(0)
  const [startX, setStartX] = createSignal(0)
  const [startY, setStartY] = createSignal(0)
  const [hammerev, setHammerev] = createSignal("")
  const [, setLngLat] = lngLatSignal

  const setStartPos = () => {
    const { x, y } = startPos()
    batch(() => {
      setStartX(x)
      setStartY(y)
    })
  }

  onMount(() => {
    const socket = io()

    socket.on("connect_error", ev => {
      throw new Error(ev.message)
    })

    socket.on("joystick", ev => {
      console.log("from server", ev)
    })

    setStartPos()
    window.addEventListener("resize", debounce(setStartPos, 100))

    // var screen = document.querySelector(".device-screen")
    const el = document.querySelector("#hitarea")

    // const norm = v => {
    //   const size = Math.min(screen.offsetWidth, screen.offsetHeight)
    //   return +((v / size) * 2).toFixed(4)
    // }

    // var START_X = Math.round((screen.offsetWidth - el.offsetWidth) / 2)
    // var START_Y = Math.round((screen.offsetHeight - el.offsetHeight) / 2)

    var ticking = false
    var transform
    var timer

    var mc = new Hammer.Manager(el)

    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }))

    mc.add(new Hammer.Swipe()).recognizeWith(mc.get("pan"))
    mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get("pan"))
    mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get("pan"), mc.get("rotate")])

    mc.add(new Hammer.Tap({ event: "doubletap", taps: 2 }))
    mc.add(new Hammer.Tap())

    mc.on("panstart panmove", onPan)
    mc.on("rotatestart rotatemove", onRotate)
    mc.on("pinchstart pinchmove", onPinch)
    mc.on("swipe", onSwipe)
    mc.on("tap", onTap)
    mc.on("doubletap", onDoubleTap)

    mc.on("hammer.input", function (ev) {
      if (ev.isFinal) {
        resetElement()
        batch(() => {
          setHorizontalAxis(0)
          setVerticalAxis(0)
        })
      } else {
        socket.emit("joystick", `${ev.deltaX},${ev.deltaY}`)
        const x = norm(ev.deltaX)
        const y = -norm(ev.deltaY)
        batch(() => {
          setHorizontalAxis(x)
          setVerticalAxis(y)
          setLngLat([x * 10, y * 10])
        })
      }
      setHammerev(JSON.stringify(ev, null, 2))
    })

    function logEvent(ev) {
      //el.innerText = ev.type;
    }

    function resetElement() {
      el.className = "animate"
      transform = {
        translate: { x: startX(), y: startY() },
        scale: 1,
        angle: 0,
        rx: 0,
        ry: 0,
        rz: 0
      }
      requestElementUpdate()
    }

    function updateElementTransform() {
      var value = [
        "translate3d(" + transform.translate.x + "px, " + transform.translate.y + "px, 0)",
        "scale(" + transform.scale + ", " + transform.scale + ")",
        "rotate3d(" + transform.rx + "," + transform.ry + "," + transform.rz + "," + transform.angle + "deg)"
      ]

      value = value.join(" ")
      el.style.webkitTransform = value
      el.style.mozTransform = value
      el.style.transform = value
      ticking = false
    }

    function requestElementUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateElementTransform)
        ticking = true
      }
    }

    function onPan(ev) {
      el.className = ""
      transform.translate = {
        x: startX() + ev.deltaX,
        y: startY() + ev.deltaY
      }

      logEvent(ev)
      requestElementUpdate()
    }

    var initScale = 1
    function onPinch(ev) {
      if (ev.type == "pinchstart") {
        initScale = transform.scale || 1
      }

      el.className = ""
      transform.scale = initScale * ev.scale

      logEvent(ev)
      requestElementUpdate()
    }

    var initAngle = 0
    function onRotate(ev) {
      if (ev.type == "rotatestart") {
        initAngle = transform.angle || 0
      }

      el.className = ""
      transform.rz = 1
      transform.angle = initAngle + ev.rotation

      logEvent(ev)
      requestElementUpdate()
    }

    function onSwipe(ev) {
      var angle = 50
      transform.ry = ev.direction & Hammer.DIRECTION_HORIZONTAL ? 1 : 0
      transform.rx = ev.direction & Hammer.DIRECTION_VERTICAL ? 1 : 0
      transform.angle = ev.direction & (Hammer.DIRECTION_RIGHT | Hammer.DIRECTION_UP) ? angle : -angle

      clearTimeout(timer)
      timer = setTimeout(function () {
        resetElement()
      }, 300)

      logEvent(ev)
      requestElementUpdate()
    }

    function onTap(ev) {
      transform.rx = 1
      transform.angle = 25

      clearTimeout(timer)
      timer = setTimeout(function () {
        resetElement()
      }, 200)

      logEvent(ev)
      requestElementUpdate()
    }

    function onDoubleTap(ev) {
      transform.rx = 1
      transform.angle = 80

      clearTimeout(timer)
      timer = setTimeout(function () {
        resetElement()
      }, 500)

      logEvent(ev)
      requestElementUpdate()
    }

    resetElement()
  })

  return (
    <>
      <div class="device-wrapper">
        <div class="device">
          <div class="device-screen">
            <div id="hitarea"></div>
          </div>
        </div>
      </div>
      <div class="debug">
        <big>
          axis: {horizontalAxis} x {verticalAxis}
        </big>
        <pre>{hammerev}</pre>
      </div>
    </>
  )
}

function startPos() {
  const screen = document.querySelector<HTMLElement>(".device-screen")
  const el = document.querySelector<HTMLElement>("#hitarea")
  let x = 0
  let y = 0
  if (screen && el) {
    x = Math.round((screen.offsetWidth - el.offsetWidth) / 2)
    y = Math.round((screen.offsetHeight - el.offsetHeight) / 2)
  }
  return { x, y }
}

function norm(v: number) {
  const screen = document.querySelector<HTMLElement>(".device-screen")
  const size = screen ? Math.min(screen.offsetWidth, screen.offsetHeight) : 800
  return +((v / size) * 2).toFixed(4)
}
