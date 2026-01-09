import express from 'express'
import { ContactController } from '../controllers/ContactController.js'
import { pool } from '../config/db.js'

const router = express.Router()
const contactController = new ContactController(pool)

router.post('/send', contactController.sendMessage)

export default router












