import db from "../dbs/initDatabase";

export interface Payment {
  id: string,
  user_id: string,
  amount: number,
  timestamp: string,
}

class PaymentModel {
  static async getAllPayment ({ offset, limit }: {offset: number, limit: number}): Promise<Payment[]> {
    const result = await db.query(`
      SELECT * FROM PAYMENT
      LIMIT $1 OFFSET $2;`, [limit, offset]);
    return result.rows;
  }
  static async insertPayment(user_id: string, amount: number): Promise<Payment | null> {
    const result = await db.query(`
      INSERT INTO payment(user_id, amount)
      VALUES ($1, $2)
      RETURNING *;`, [user_id, amount]);
    return result.rows[0] || null;
  }
  static async getPaymentByUserID (user_id: string, { offset, limit }: {offset: number, limit: number}) {
    const result = await db.query(`
      SELECT *
      FROM PAYMENT 
      WHERE user_id=$1
      LIMIT $2 OFFSET $3;`, [user_id, limit, offset]);
    return result.rows;
  }
}

export default PaymentModel;