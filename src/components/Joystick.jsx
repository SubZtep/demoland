// @ts-nocheck
import { createSignal, onMount } from "solid-js"
import Hammer from "hammerjs"
import "./Joystick.css"

delete Hammer.defaults.cssProps.userSelect

export default function () {
  const [verticalAxis, setVerticalAxis] = createSignal(0)
  const [horizontalAxis, setHorizontalAxis] = createSignal(0)
  const [hammerev, setHammerev] = createSignal("")

  onMount(() => {
    const socket = io()

    socket.on("connect", () => {
      console.log("connected", socket.connected) // true
    })

    socket.on("connect_error", ev => {
      console.log("connect_error", ev.message)
    })

    socket.on("disconnect", () => {
      console.log("disconnected", socket.connected) // false
    })

    socket.on("hammer", ev => {
      console.log("server hammer", ev)
    })

    var screen = document.querySelector(".device-screen")
    var el = document.querySelector("#hitarea")

    var START_X = Math.round((screen.offsetWidth - el.offsetWidth) / 2)
    var START_Y = Math.round((screen.offsetHeight - el.offsetHeight) / 2)

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
        setHorizontalAxis(0)
        setVerticalAxis(0)
      } else {
        socket.emit("hammer", `${ev.deltaX},${ev.deltaY}`)
        setHorizontalAxis(ev.deltaX)
        setVerticalAxis(ev.deltaY)
      }
      setHammerev(JSON.stringify(ev, null, 2))
    })

    function logEvent(ev) {
      //el.innerText = ev.type;
    }

    function resetElement() {
      el.className = "animate"
      transform = {
        translate: { x: START_X, y: START_Y },
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
        x: START_X + ev.deltaX,
        y: START_Y + ev.deltaY
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
    <div class="row splash">
      <div class="column">
        <div class="text-center">
          Hello, {verticalAxis} {horizontalAxis}!
        </div>

        <div class="try">
          <div class="device">
            <div class="device-screen-wrapper">
              <div class="device-screen">
                <div id="hitarea"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <pre class="joydebug">{hammerev}</pre>
    </div>
  )
}
