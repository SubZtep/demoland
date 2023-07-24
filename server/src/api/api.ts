import { Router } from "express"
import { channels } from "../channels.js"

const router: Router = Router()

router.get("/api", (_req, res) => {
  res.json({ say: "hi" })
})

router.get("/api/channel/:channel/exists", (req, res) => {
  res.json({ exists: channels.has(req.params.channel) })
})

export default router
