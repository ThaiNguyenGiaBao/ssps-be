import { query } from "express";
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

export interface Location {
  id: string;             
  campusName: string;     
  buildingName: string;  
  roomNumber: number;      
}

export default class PrinterModel {
  static async findAllPrinter(): Promise<Printer[]> {
    const result = await db.query(`SELECT * FROM PRINTER`);
    return result.rows; 
  }

  static async findPrinterByID(printerID: string): Promise<Printer | null> {
    const result = await db.query(`
      SELECT * FROM PRINTER 
      WHERE ID=$1`, [printerID]);
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
      throw new Error("No fields provided to update");
    }
    const setClauses = fields.map((field, index) => `${field} = $${index+1}`).join(', ');

    console.log(setClauses)
    const result = await db.query(`
      UPDATE PRINTER
      SET ${setClauses}
      WHERE ID = $2
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