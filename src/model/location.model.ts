import db from "../dbs/initDatabase";
import { BadRequestError } from "../helper/errorRespone";

export interface Location {
  id: string,
  campusname: string,
  buildingname: string,
  roomnumber: number,
}

class LocationModel {
  static async getAllLocation({offset, limit}: {offset: number, limit: number}): Promise<Location[]> {
    const result = await db.query(`
      SELECT * 
      FROM LOCATION
      LIMIT $1 OFFSET $2;`, [limit, offset]);
    return result.rows;
  }
  
  static async getLocation(data: Partial<Location>, {offset, limit}: {offset: number, limit: number}): Promise<Location[]> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    if (fields.length === 0) {
      throw new BadRequestError("No fields provided to find locations.");
    } 
    const setClauses = fields.map((field, index) => `${field} = $${index+1}`).join(', ');
    const result = await db.query(`
      SELECT *
      FROM LOCATION
      WHERE ${setClauses}
      LIMIT $${fields.length+1} OFFSET $${fields.length+2};`, [...values, limit, offset]); 
    return result.rows;
  }

  static async insertLocation(campusname: string, buildingname: string, roomnumber: number): Promise<Location | null> {
    const result = await db.query(`
      INSERT INTO LOCATION(campusname, buildingname, roomnumber) 
      VALUES ($1, $2, $3)
      RETURNING *;`, [campusname, buildingname, roomnumber]
    );
    return result.rows[0] || null;
  }
  static async deleteLocation(id: string): Promise<Location | null> {
    const result = await db.query(`
      DELETE FROM LOCATION 
      WHERE id=$1
      RETURNING *;`, [id]
    );
    return result.rows[0] || null;
  }
  static async updateLocation(id: string, data: Partial<Location>): Promise<Location | null> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    // Return early if no fields to update
    if (fields.length === 0) {
      throw new BadRequestError("No fields provided to update");
    }
    const setClauses = fields.map((field, index) => `${field} = $${index+1}`).join(', ');
    const result = await db.query(`
      UPDATE LOCATION
      SET ${setClauses}
      WHERE ID = $${fields.length+1}
      RETURNING *`, [...values, id]); 
    return result.rows[0] || null;
  } 

}

export default LocationModel;