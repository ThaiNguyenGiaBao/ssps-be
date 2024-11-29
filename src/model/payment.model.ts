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
  static async getPaymentByTime (startTime: string | null, endTime: string | null, { offset, limit } : {offset: number, limit: number}) {
    if (!startTime && !endTime)
      return this.getAllPayment({ offset, limit });
    
    let result = null;
    if (!endTime)
      result = await db.query(`
        SELECT * 
        FROM public.payment 
        WHERE timestamp >= $1 
        ORDER BY timestamp;
      `, [startTime]);
    else if (!startTime)
      result = await db.query(`
        SELECT * 
        FROM public.payment 
        WHERE timestamp <= $1 
        ORDER BY timestamp;
      `, [endTime]);
    else
      result = await db.query(`
        SELECT * 
        FROM payment 
        WHERE timestamp BETWEEN $1 AND $2 
        ORDER BY timestamp;
      `, [startTime, endTime]);
    return result.rows;
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