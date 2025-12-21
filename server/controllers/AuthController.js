import { AuthService } from '../services/AuthService.js'

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */
export class AuthController {
  constructor(pool) {
    this.authService = new AuthService(pool)
  }

  /**
   * Admin login
   */
  adminLogin = async (req, res) => {
    try {
      const { username, password } = req.body
      const result = await this.authService.login(username, password)
      res.json(result)
    } catch (error) {
      console.error('Login error:', error)
      res.status(401).json({ message: error.message || 'Login failed' })
    }
  }
}

