import { pool } from '../../config/database.js';

class SessionService {
  static async recordLoginAttempt(attemptData) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO login_attempt (email, ip_address, user_agent, status, failure_reason, id_user) VALUES (?, ?, ?, ?, ?, ?)',
        [
          attemptData.email,
          attemptData.ip_address,
          attemptData.user_agent,
          attemptData.status,
          attemptData.failure_reason,
          attemptData.id_user
        ]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async createSession(sessionData) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO session (id_user, ip_address, user_agent, status) VALUES (?, ?, ?, "active")',
        [sessionData.id_user, sessionData.ip_address, sessionData.user_agent]
      );
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  static async closeSession(sessionId) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'UPDATE session SET date_end = CURRENT_TIMESTAMP, status = "closed" WHERE id_session = ?',
        [sessionId]
      );
      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async getActiveSessions(userId) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM session WHERE id_user = ? AND status = "active"',
        [userId]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async hasTooManyActiveSessions(userId, maxSessions = 3) {
    const activeSessions = await this.getActiveSessions(userId);
    return activeSessions.length >= maxSessions;
  }
}

export default SessionService;
