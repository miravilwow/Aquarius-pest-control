import express from 'express'
import { pool } from '../config/db.js'
import { AuthController } from '../controllers/AuthController.js'

const router = express.Router()
const authController = new AuthController(pool)

// Admin login
router.post('/admin/login', authController.adminLogin)

// Note: User authentication routes (register, login, OTP) are not yet implemented
// Uncomment and implement when needed:
// router.post('/user/register', authController.userRegister)
// router.post('/user/login', authController.userLogin)
// router.post('/user/send-otp', authController.sendOTP)
// router.post('/user/verify-otp', authController.verifyOTP)

export default router
