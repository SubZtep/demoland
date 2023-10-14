
interface Props {
  message: any
}

export default function Viewer({ message }: Props) {
  return <>
    <pre>{JSON.stringify(message, null, 2)}</pre>
  </>
}
