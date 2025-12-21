import { BaseModel } from './BaseModel.js'

/**
 * Admin Model
 * Handles all database operations for admins
 */
export class AdminModel extends BaseModel {
  constructor(pool) {
    super(pool, 'admins')
  }

  /**
   * Find admin by username
   * @param {string} username - Admin username
   * @returns {Promise<Object|null>} Admin or null
   */
  async findByUsername(username) {
    const result = await this.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    )
    return result.length > 0 ? result[0] : null
  }
}

