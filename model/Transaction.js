const db = require('../config/database'); // your pg pool

class Transaction {
  static async create(transactionData) {
    const { user_id, amount, transaction_date, description, category_id, category_type, category } = transactionData;

    const query = `
      INSERT INTO expense_transactions
        (user_id, amount, transaction_date, description, category_id, category_type, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await db.query(query, [
      user_id,
      amount,
      transaction_date,
      description,
      category_id,
      category_type,
      category
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT
        t.transaction_id,
        t.user_id,
        t.category_id,
        t.amount,
        t.transaction_date,
        t.description,
        t.created_at,
        t.updated_at,
        t.category_type,
        t.category,
        c.name AS category_name
      FROM expense_transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;
    const params = [userId];
    let idx = 1;

    if (filters.startDate) {
      idx++;
      query += ` AND t.transaction_date >= $${idx}`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      idx++;
      query += ` AND t.transaction_date <= $${idx}`;
      params.push(filters.endDate);
    }
    if (filters.categoryId) {
      idx++;
      query += ` AND t.category_id = $${idx}`;
      params.push(filters.categoryId);
    }

    query += ' ORDER BY t.transaction_date DESC, t.created_at DESC';
    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(transaction_id, userId) {
    const query = `
      SELECT
        t.transaction_id,
        t.user_id,
        t.category_id,
        t.amount,
        t.transaction_date,
        t.description,
        t.created_at,
        t.updated_at,
        t.category_type,
        t.category,
        c.name AS category_name
      FROM expense_transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.transaction_id = $1 AND t.user_id = $2
    `;
    const result = await db.query(query, [transaction_id, userId]);
    return result.rows[0];
  }

  static async update(transaction_id, userId, data) {
    const { amount, transaction_date, description, category_id, category_type, category } = data;
    const query = `
      UPDATE expense_transactions
      SET amount=$1,
          transaction_date=$2,
          description=$3,
          category_id=$4,
          category_type=$5,
          category=$6,
          updated_at=CURRENT_TIMESTAMP
      WHERE transaction_id=$7 AND user_id=$8
      RETURNING *
    `;
    const result = await db.query(query, [
      amount, transaction_date, description, category_id, category_type, category, transaction_id, userId
    ]);
    return result.rows[0];
  }

  static async delete(transaction_id, userId) {
    const query = `
      DELETE FROM expense_transactions
      WHERE transaction_id=$1 AND user_id=$2
      RETURNING *
    `;
    const result = await db.query(query, [transaction_id, userId]);
    return result.rows[0];
  }

  static async getMonthlySummary(userId, year, month) {
    const query = `
      SELECT
        COALESCE(c.name, t.category) AS category_name,
        SUM(t.amount) AS total_amount,
        COUNT(*) AS transaction_count
      FROM expense_transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id=$1
        AND EXTRACT(YEAR FROM t.transaction_date)=$2
        AND EXTRACT(MONTH FROM t.transaction_date)=$3
      GROUP BY c.name, t.category
      ORDER BY total_amount DESC
    `;
    const result = await db.query(query, [userId, year, month]);
    return result.rows;
  }

  static async getCategorySummary(userId, startDate, endDate) {
    let query = `
      SELECT
        t.category_id,
        COALESCE(c.name, t.category) AS category_name,
        SUM(t.amount) AS total_amount,
        COUNT(*) AS transaction_count
      FROM expense_transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id=$1
    `;
    const params = [userId];

    if (startDate) {
      params.push(startDate);
      query += ` AND t.transaction_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND t.transaction_date <= $${params.length}`;
    }

    query += ` GROUP BY t.category_id, c.name, t.category ORDER BY total_amount DESC`;
    const result = await db.query(query, params);
    return result.rows;
  }
}

module.exports = Transaction;
