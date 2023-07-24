function useViewer() {
  return {
    async isChannelExists(channel: string) {
      const response = await fetch(`/api/channel/${channel}/exists`)
      const { exists } = await response.json()
      return exists
    },
  }
}

export default useViewer
