import db from "../dbs/initDatabase";
import { BadRequestError } from "../helper/errorRespone";

export interface Config {
  defaultNumPage: number,
  dateGivenPage: number
}

export default class ConfigModel {
  static async getPageConfig(): Promise<Config | null> {
    const result = await db.query("SELECT defaultNumPage, dateGivenPage FROM configuration;");
    return result.rows[0] || null;
  }
  static async updatePageConfig({ defaultNumPage , dateGivenPage }: Partial<Config>): Promise<Config | null> {
    // Initialize an array to store the SQL set clauses and the values
    const setClauses: string[] = [];
    const values: (number | string)[] = [];
    
    // Check each parameter, and if provided, add it to the set clauses and values array
    if (defaultNumPage !== undefined) {
      setClauses.push(`defaultNumPage = $${setClauses.length + 1}`);
      values.push(defaultNumPage);
    }
    if (dateGivenPage !== undefined) {
      setClauses.push(`dateGivenPage = $${setClauses.length + 1}`);
      values.push(dateGivenPage);
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