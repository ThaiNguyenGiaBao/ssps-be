import db from "../dbs/initDatabase";

class AccessModel {
    static async findUserByEmail(email: string) {
        return db.query("SELECT * FROM users WHERE email = $1", [email])
    }
}

export default AccessModel;