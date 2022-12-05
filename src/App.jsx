import { createSignal } from "solid-js"
import Joystick from "./components/Joystick"
import Map from "./components/map"

function App() {
  const [showJoystick, setShowJoystick] = createSignal(false)

  return (
    <>
      <Map onGeolocate={() => setShowJoystick(true)} />
      {showJoystick() && <Joystick />}
    </>
  )
}

export default App
