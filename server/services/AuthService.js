import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AdminModel } from '../models/AdminModel.js'

/**
 * Auth Service
 * Handles authentication logic
 */
export class AuthService {
  constructor(pool) {
    this.adminModel = new AdminModel(pool)
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
  }

  /**
   * Login admin
   * @param {string} username - Admin username
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Token and admin info
   */
  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required')
    }

    const admin = await this.adminModel.findByUsername(username)
    
    if (!admin) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      this.jwtSecret,
      { expiresIn: '24h' }
    )

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Decoded token
   */
  async verifyToken(token) {
    return jwt.verify(token, this.jwtSecret)
  }
}

