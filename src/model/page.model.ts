import db from "../dbs/initDatabase";
import { BadRequestError } from "../helper/errorRespone";

export interface Config {
  defaultnumpage: number,
  dategivenpage: string
}

export default class ConfigModel {
  static async getPageConfig(): Promise<Config | null> {
    const result = await db.query("SELECT defaultnumpage, dategivenpage FROM configuration;");
    return result.rows[0] || null;
  }
  static async updatePageConfig({ defaultnumpage , dategivenpage }: Partial<Config>): Promise<Config | null> {
    // Initialize an array to store the SQL set clauses and the values
    const setClauses: string[] = [];
    const values: (number | string)[] = [];
    
    // Check each parameter, and if provided, add it to the set clauses and values array
    if (defaultnumpage !== undefined) {
      setClauses.push(`defaultnumpage = $${setClauses.length + 1}`);
      values.push(defaultnumpage);
    }
    if (dategivenpage !== undefined) {
      setClauses.push(`dategivenpage = $${setClauses.length + 1}`);
      values.push(dategivenpage);
    }

    // If no parameters are provided, return null or throw an error as there's nothing to update
    if (setClauses.length === 0) {
      throw new BadRequestError("No configuration arguments for updating");
    }

    const result = await db.query(`
      UPDATE configuration
      SET ${setClauses}
      WHERE id = 1
      RETURNING *;`, [...values]);
    return result.rows[0] || null;
  }
}