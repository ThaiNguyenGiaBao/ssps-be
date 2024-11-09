import db from "../dbs/initDatabase";
import bcrypt from "bcrypt";
class AccessModel {
    static async findUserByEmail(email: string) {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
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
    static async findUserById(userId: string) {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
        return user.rows[0];
    }

    static async getAllUsers({ page, limit }: { page: number; limit: number }) {
        const users = await db.query("SELECT * FROM users LIMIT $1 OFFSET $2", [limit, (page - 1) * limit]);
        return users.rows;
    }

    static async updateUser(
        userId: string,
        data: Partial<{ email: string; username: string; password: string; avatarUrl: string; coinBalance: number }>
    ) {
        const updates: string[] = [];
        const values: (string | number | null)[] = [];
        const { email, username, password, avatarUrl, coinBalance } = data;
        if (email !== undefined) {
            updates.push(`email = $${updates.length + 1}`);
            values.push(email);
        }
        if (username !== undefined) {
            updates.push(`name = $${updates.length + 1}`);
            values.push(username);
        }
        if (password !== undefined) {
            updates.push(`password = $${updates.length + 1}`);
            const hashedPassword = await bcrypt.hash(password, 10);
            values.push(hashedPassword);
        }
        if (avatarUrl !== undefined) {
            updates.push(`avatarUrl = $${updates.length + 1}`);
            values.push(avatarUrl);
        }
        if (coinBalance !== undefined) {
            updates.push(`coinBalance = $${updates.length + 1}`);
            values.push(coinBalance);
        }

        const updateQuery = `
            UPDATE users
            SET ${updates.join(", ")}
            WHERE id = $${updates.length + 1} RETURNING *
        `;
        values.push(userId);
        const updatedUserResult = await db.query(updateQuery, values);
        const updatedUser = updatedUserResult.rows[0];
        console.log("Updated user", updatedUser);
        return updatedUser;
    }
    static async deleteUser(userId: string) {
        const deleteQuery = "DELETE FROM users WHERE id = $1 RETURNING *";
        const deletedUserResult = await db.query(deleteQuery, [userId]);
        const deletedUser = deletedUserResult.rows[0];
        return deletedUser;
    }
}

export default AccessModel;
