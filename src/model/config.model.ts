import db from "../dbs/initDatabase";
import { BadRequestError } from "../helper/errorRespone";

export interface Config {
  defaultNumPage: number,
  dateGivenPage: string
}

export default class ConfigModel {
  static async getConfig(): Promise<Config | null> {
    const result = await db.query("SELECT defaultNumPage, dateGivenPage FROM configuration;");
    return result.rows[0] || null;
  }
  static async updateConfig({ defaultNumPage , dateGivenPage }: Partial<Config>): Promise<Config | null> {
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
      SET defaultNumPage = $1, dateGivenPage = $2
      WHERE id = 1
      RETURNING *;`, [defaultNumPage, dateGivenPage]);
    return result.rows[0] || null;
  }
}