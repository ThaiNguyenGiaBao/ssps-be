import db from "../dbs/initDatabase";
import { BadRequestError } from "../helper/errorRespone";

export interface Printer {
  id: string,
  brand: string,
  model: string,
  shortDescription?: string,
  status: "enabled" | "disabled",
  locationId?: string
}

export default class PrinterModel {
  static async findAllPrinter({ offset, limit }: { offset: number, limit: number}) {
    const result = await db.query(`
      SELECT * FROM PRINTER
      LIMIT $1 OFFSET $2;`, [limit, offset]);
    
    const countQuery = await db.query(`SELECT COUNT(*) AS total FROM printer`);
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

  static async findPrinterByID(printerID: string): Promise<Printer | null> {
    const result = await db.query(`
      SELECT * FROM PRINTER 
      WHERE ID=$1;`, [printerID]);
    return result.rows[0] || null;
  }

  static async createPrinter(printer: Printer): Promise<Printer> {
    const result = await db.query(`
      INSERT INTO PRINTER (brand, model, shortdescription, status, locationid)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [printer.brand, printer.model, printer.shortDescription || null, printer.status, printer.locationId || null]);
    return result.rows[0] || null;
  }

  static async updatePrinter(printerID: string, data: Partial<Printer>): Promise<Printer | null> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    // Return early if no fields to update
    if (fields.length === 0) {
      throw new BadRequestError("No fields provided to update");
    }
    const setClauses = fields.map((field, index) => `${field} = $${index+1}`).join(', ');

    const result = await db.query(`
      UPDATE PRINTER
      SET ${setClauses}
      WHERE ID = $${fields.length+1}
      RETURNING *`, [...values, printerID]); 
    return result.rows[0] || null;
  }

  static async deletePrinter(printerID: string): Promise<Printer | null> {
    const result = await db.query(`
      DELETE FROM PRINTER
      WHERE ID = $1
      RETURNING *`, [printerID]);
    return result.rows[0] || null;
  }
}