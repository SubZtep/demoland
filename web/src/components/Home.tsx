import * as THREE from "three"
import { state } from "../app/state"
import ThreeScene from "./ThreeScene"
import HandEnvironment from "./3d/HandEnvironment"
import HandSkeleton from "./3d/HandSkeleton"

const App = () => {
  return (
    <>
      <ThreeScene
        colour="#009900"
        background={new THREE.Color(0x00cd00)}
        lookAt={[0, 1.2, 0, 0, 0, 0]}
        class="bg-colour"
        border={state.isDesktop}
      >
        {({ scene }) => (
          <>
            <HandEnvironment scene={scene} />
            <HandSkeleton scene={scene} landmarks={state.player.landmarks!} scale={-4} />
          </>
        )}
      </ThreeScene>
      <ThreeScene colour={state.player.colour} class="bg-colour" border={state.isDesktop} rotate alpha>
        {({ scene }) => (
          <>
            <HandEnvironment scene={scene} />
            <HandSkeleton scene={scene} landmarks={state.player.landmarks!} scale={-4} />
          </>
        )}
      </ThreeScene>
      <ThreeScene
        colour="#000099"
        background={new THREE.Color(0x0000cd)}
        lookAt={[0, 0, 1.2, 0, 0, 0]}
        class="bg-colour"
        border={state.isDesktop}
      >
        {({ scene }) => (
          <>
            <HandEnvironment scene={scene} />
            <HandSkeleton scene={scene} landmarks={state.player.landmarks!} scale={-4} />
          </>
        )}
      </ThreeScene>
      <ThreeScene
        colour="#990000"
        background={new THREE.Color(0xcd0000)}
        lookAt={[-1.2, 0, 0, 0, 0, 0]}
        class="bg-colour"
        border={state.isDesktop}
      >
        {({ scene }) => (
          <>
            <HandEnvironment scene={scene} />
            <HandSkeleton scene={scene} landmarks={state.player.landmarks!} scale={-4} />
          </>
        )}
      </ThreeScene>
    </>
  )
}

export default App
