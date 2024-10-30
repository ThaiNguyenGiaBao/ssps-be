import db from "../dbs/initDatabase";

class AccessModel {
    static async findUserByEmail(email: string) {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        //console.log(user);
        return user.rows[0];
    }
    static async createUser({
        email,
        username,
        hashedPassword,
        avatarUrl
    }: {
        email: string;
        username: string;
        hashedPassword: string;
        avatarUrl: string;
    }) {
        const newUserResult = await db.query(
            `INSERT INTO users (email, name, password, avatarUrl) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [email, username, hashedPassword, avatarUrl]
        );
        return newUserResult.rows[0];
    }
}

export default AccessModel;
