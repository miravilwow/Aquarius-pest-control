import { BaseModel } from './BaseModel.js'

/**
 * User Model
 * Handles all database operations for users
 */
export class UserModel extends BaseModel {
  constructor(pool) {
    super(pool, 'users')
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User or null
   */
  async findByEmail(email) {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} WHERE email = $1`,
      [email]
    )
    return result.length > 0 ? result[0] : null
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    const { name, email, phone, password_hash } = userData
    
    if (!name || !email || !phone || !password_hash) {
      throw new Error('Name, email, phone, and password are required')
    }

    return await super.create({
      name,
      email,
      phone,
      password_hash
    })
  }
}

