import ThreeScene from "./ThreeScene"

interface Props {
  message: any
}

export default function Viewer({ message }: Props) {
  return <>
    <ThreeScene width={320} height={240} />
    <pre>{JSON.stringify(message, null, 2)}</pre>
  </>
}
