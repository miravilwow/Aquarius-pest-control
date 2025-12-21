/**
 * Base Model Class
 * Provides common database operations for all models
 */
export class BaseModel {
  constructor(pool, tableName) {
    this.pool = pool
    this.tableName = tableName
  }

  /**
   * Execute a query
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise} Query result
   */
  async query(query, params = []) {
    try {
      const result = await this.pool.query(query, params)
      return result.rows
    } catch (error) {
      console.error(`Error in ${this.tableName} query:`, error)
      throw error
    }
  }

  /**
   * Find all records
   * @param {Object} options - Query options (orderBy, limit, etc.)
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    let query = `SELECT * FROM ${this.tableName}`
    
    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy}`
    }
    
    if (options.limit) {
      query += ` LIMIT ${options.limit}`
    }
    
    return await this.query(query)
  }

  /**
   * Find record by ID
   * @param {number} id - Record ID
   * @returns {Promise<Object|null>} Record or null
   */
  async findById(id) {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    )
    return result.length > 0 ? result[0] : null
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record
   */
  async create(data) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')
    
    const query = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `
    
    const result = await this.query(query, values)
    return result[0]
  }

  /**
   * Update a record
   * @param {number} id - Record ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object|null>} Updated record or null
   */
  async update(id, data) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ')
    
    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `
    
    const result = await this.query(query, [...values, id])
    return result.length > 0 ? result[0] : null
  }

  /**
   * Delete a record
   * @param {number} id - Record ID
   * @returns {Promise<boolean>} True if deleted
   */
  async delete(id) {
    const result = await this.query(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id]
    )
    return result.length > 0
  }
}

