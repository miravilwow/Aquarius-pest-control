import express from 'express'
import { pool } from '../config/db.js'
import { AuthController } from '../controllers/AuthController.js'

const router = express.Router()
const authController = new AuthController(pool)

// Admin login
router.post('/admin/login', authController.adminLogin)

export default router
