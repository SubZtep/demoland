import { createSignal, onMount, batch } from "solid-js"
import Hammer from "hammerjs"
import debounce from "lodash/debounce"
import throttle from "lodash/throttle"
import { lngLatSignal } from "../store"
import "./Joystick.css"

// @ts-expect-error
delete Hammer.defaults.cssProps.userSelect

let eventsEl: HTMLElement

export default function () {
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
    eventsEl = document.querySelector("socket-events")!
    const joyEl = document.querySelector<HTMLElement>("#hitarea")!
    setStartPos()
    window.addEventListener("resize", debounce(setStartPos, 100))

    // hammerweb from here
    let ticking = false
    let transform: CSSRuleList | any
    let timer: NodeJS.Timeout

    const hammer = new Hammer.Manager(joyEl)

    hammer.add(new Hammer.Pan({ threshold: 0, pointers: 0 }))

    hammer.add(new Hammer.Swipe()).recognizeWith(hammer.get("pan"))
    hammer.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(hammer.get("pan"))
    hammer.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([hammer.get("pan"), hammer.get("rotate")])

    hammer.add(new Hammer.Tap({ event: "doubletap", taps: 2 }))
    hammer.add(new Hammer.Tap())

    hammer.on("panstart panmove", onPan)
    hammer.on("rotatestart rotatemove", onRotate)
    hammer.on("pinchstart pinchmove", onPinch)
    hammer.on("swipe", onSwipe)
    hammer.on("tap", onTap)
    hammer.on("doubletap", onDoubleTap)

    hammer.on(
      "hammer.input",
      throttle(ev => {
        // console.log("HAMMER INPUT")
        if (ev.isFinal) {
          resetElement()
        } else {
          const x = norm(ev.deltaX) * 10
          const y = -norm(ev.deltaY) * 10
          eventsEl.setAttribute("position", `${x},${y}`)
        }
        setHammerev(JSON.stringify(ev, null, 2))
      }, 1_000 / 30)
    )

    function logEvent(ev) {
      // console.log("hammer event", ev)
      //el.innerText = ev.type;
    }

    function resetElement() {
      joyEl.className = "animate"
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
      let value: any = [
        "translate3d(" + transform.translate.x + "px, " + transform.translate.y + "px, 0)",
        "scale(" + transform.scale + ", " + transform.scale + ")",
        "rotate3d(" + transform.rx + "," + transform.ry + "," + transform.rz + "," + transform.angle + "deg)"
      ]

      value = value.join(" ")
      joyEl.style.webkitTransform = value
      joyEl.style.mozTransform = value
      joyEl.style.transform = value
      ticking = false
    }

    function requestElementUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateElementTransform)
        ticking = true
      }
    }

    function onPan(ev) {
      joyEl.className = ""
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

      joyEl.className = ""
      transform.scale = initScale * ev.scale

      logEvent(ev)
      requestElementUpdate()
    }

    var initAngle = 0
    function onRotate(ev) {
      if (ev.type == "rotatestart") {
        initAngle = transform.angle || 0
      }

      joyEl.className = ""
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
      <pre class="debug">{hammerev}</pre>
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
  return +((v / size) * 2) // .toFixed(5)
}
