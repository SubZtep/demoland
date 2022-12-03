import Joystick from "./components/Joystick.jsx"
import styles from "./App.module.css"
import logo from "./logo.svg"

function App() {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <Joystick />
      </header>
    </div>
  )
}

export default App
