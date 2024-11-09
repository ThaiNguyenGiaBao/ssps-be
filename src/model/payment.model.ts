import db from "../dbs/initDatabase";

export interface Payment {
  id: string,
  user_id: string,
  amount: number,
  timestamp: string,
}

class PaymentModel {
  static async getAllPayment (): Promise<Payment[]> {
    const result = await db.query(`SELECT * FROM PAYMENT;`);
    return result.rows;
  }
  static async insertPayment(user_id: string, amount: number): Promise<Payment | null> {
    const result = await db.query(`
      INSERT INTO payment(user_id, amount)
      VALUES ($1, $2)
      RETURNING *;`, [user_id, amount]);
    return result.rows[0] || null;
  }
}

export default PaymentModel;