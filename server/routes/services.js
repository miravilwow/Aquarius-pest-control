import express from 'express'
import { pool } from '../config/db.js'
import { ServiceController } from '../controllers/ServiceController.js'

const router = express.Router()
const serviceController = new ServiceController(pool)

// Public routes
router.get('/', serviceController.getAll)
router.get('/:id', serviceController.getById)

export default router
