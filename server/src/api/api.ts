import { Router } from "express"
import { channels } from "../channels.js"

const router: Router = Router()

router.get("/api", (_req, res) => {
  res.json({ say: "hi" })
})

router.get("/api/channel/:channel?", (req, res) => {
  if (!req.params.channel) {
    res.json({ error: "Channel name is missing" })
    return
  }
  res.json({ exists: channels.has(req.params.channel) })
})

export default router
