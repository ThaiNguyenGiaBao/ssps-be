import db from "../dbs/initDatabase";

export interface Payment {
  id: string,
  user_id: string,
  amount: number,
  timestamp: string,
}

class PaymentModel {
  static async getAllPayment ({ offset, limit }: {offset: number, limit: number}) {
    const result = await db.query(`
      SELECT * FROM PAYMENT
      LIMIT $1 OFFSET $2;`, [limit, offset]);

    const countQuery = await db.query(`SELECT COUNT(*) AS total FROM payment;`);
    const totalItems = countQuery.rows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: result.rows,
      meta: {
        totalPages,
        totalItems,
        currentPage: offset/limit + 1,
        perPage: limit
      }
    }; 
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
    let countQuery = null;
    if (!endTime) {
      result = await db.query(`
        SELECT * 
        FROM public.payment 
        WHERE timestamp >= $1 
        ORDER BY timestamp
        LIMIT $2 OFFSET $3;
      `, [startTime, limit, offset]);

      countQuery = await db.query(`
        SELECT COUNT(*) as total
        FROM public.payment 
        WHERE timestamp >= $1
      `, [startTime]);
    }
    else if (!startTime) {
      result = await db.query(`
        SELECT * 
        FROM public.payment 
        WHERE timestamp <= $1 
        ORDER BY timestamp
        LIMIT $2 OFFSET $3;
      `, [endTime, limit, offset]);

      countQuery = await db.query(`
        SELECT COUNT(*) as total
        FROM public.payment 
        WHERE timestamp <= $1 
      `, [endTime]);
    }
      
    else {
      result = await db.query(`
        SELECT * 
        FROM payment 
        WHERE timestamp BETWEEN $1 AND $2 
        ORDER BY timestamp
        LIMIT $3 OFFSET $4;
      `, [startTime, endTime, limit, offset]);

      countQuery = await db.query(`
        SELECT COUNT(*) as total
        FROM payment 
        WHERE timestamp BETWEEN $1 AND $2;
      `, [startTime, endTime]);
    }
      
    const totalItems = countQuery.rows[0].total;
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: result.rows,
      meta: {
        totalPages,
        totalItems,
        currentPage: offset/limit + 1,
        perPage: limit
      }
    }; 
  }
  static async getPaymentByUserID (user_id: string, { offset, limit }: {offset: number, limit: number}) {
    const result = await db.query(`
      SELECT *
      FROM PAYMENT 
      WHERE user_id=$1
      LIMIT $2 OFFSET $3;`, [user_id, limit, offset]);

      const countQuery = await db.query(`
        SELECT COUNT(*) AS total 
        FROM payment 
        WHERE user_id=$1;
      `, [user_id]);
      const totalItems = countQuery.rows[0].total;
      const totalPages = Math.ceil(totalItems / limit);
  
      return {
        data: result.rows,
        meta: {
          totalPages,
          totalItems,
          currentPage: offset/limit + 1,
          perPage: limit
        }
      }; 
  }
}

export default PaymentModel;