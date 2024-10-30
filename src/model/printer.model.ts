import { query } from "express";
import db from "../dbs/initDatabase";

export interface Printer {
  id: string,
  brand: string,
  model: string,
  shortDescription: string,
  status: "enabled" | "disabled",
  locationId: string
}

export interface Location {
  id: string;             
  campusName: string;     
  buildingName: string;  
  roomNumber: number;      
}

export default class PrinterModel {
  static async findAllPrinter(): Promise<Printer[]> {
    try {
      const result = await db.query(`SELECT * FROM PRINTER`);
      return result.rows; 
    } catch(err) {
      console.error("[ERROR] Cannot find all printers", err);
      throw(err);
    }
  }
  static async findPrinterByID(printerID: string): Promise<Printer | null> {
    try {
      const result = await db.query(`
        SELECT * FROM PRINTER 
        WHERE ID=$1`, [printerID]);
      return result.rows[0] || null;
    } catch(err) {
      console.error(`[ERROR FROM] SELECT * FROM PRINTER WHERE PRINTERID=${printerID}`);
      throw(err);
    }
  }
  static async createPrinter(printer: Printer): Promise<Printer> {
    try {
      const result = await db.query(`
        INSERT INTO PRINTER 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [printer.id, printer.brand, printer.model, printer.shortDescription, printer.status, printer.locationId]);
      return result.rows[0];
    } catch(err) {
      console.error("[ERROR] Fail to insert printer", err);
      throw(err);
    }
  }
  static async updatePrinter(printerID: string, data: Partial<Printer>): Promise<Printer | null> {
    try {
      const fields = Object.keys(data);
      const values = Object.values(data);
      // Return early if no fields to update
      if (fields.length === 0) {
        throw new Error("No fields provided to update");
      }
      const setClauses = fields.map((field, index) => `${field} = ${values[index]}`).join(', ');

      const result = await db.query(`
        UPDATE PRINTER
        SET ${setClauses}
        WHERE ID = ${printerID}
        RETURNING *`); 
      return result.rows[0] || null;
    } catch(err) {
      console.error(err);
      throw(err);
    }
  }
  static async deletePrinter(printerID: string): Promise<Printer | null> {
    try {
      const result = await db.query(`
        DELETE FROM PRINTER
        WHERE ID = ${printerID}`);
      return result.rows[0] || null;
    } catch(err) {
      console.error("[ERROR] Delete printer failed!", err);
      throw err;
    }
  }
}