import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import db from "../dbs/initDatabase";
import bcrypt from "bcrypt";

class UserService {
    static async getUser(userId: string) {
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }

        const userResult = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
        const user = userResult.rows[0];

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    }

    // // router.patch("/:userId", asyncHandler(UserController.updateUser));
    // static async updateUser(req: Request, res: Response) {
    //     console.log("UpdateUserProfile::", req.params, req.body);
    //     if (req.user.id != req.params.userId || req.user.role != "admin") {
    //         throw new ForbiddenError("You are not allowed to update this resource");
    //     }
    //     return new OK({
    //         message: "Update user profile successfully",
    //         data: await UserService.updateUser(req.params.userId, req.body)
    //     }).send(res);
    // }

    static async updateUser(
        userId: string,
        {
            email,
            username,
            password,
            avatarUrl,
            coinBalance
        }: { email?: string; username?: string; password?: string; avatarUrl?: string; coinBalance?: number }
    ) {
        console.log("UpdateUserProfile::", userId, email, username, password, avatarUrl, coinBalance);
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }

        const userResult = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
        const user = userResult.rows[0];

        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Prepare update query parts
        const updates: string[] = [];
        const values: (string | number | null)[] = [];

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

        // If no updates, return the user as is
        if (updates.length === 0) {
            return user;
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

    // // router.delete("/:userId", asyncHandler(UserController.deleteUser));
    // static async deleteUser(req: Request, res: Response) {
    //     console.log("DeleteUserProfile::", req.params);
    //     if (req.user.role != "admin") {
    //         throw new ForbiddenError("You are not allowed to delete this resource");
    //     }
    //     return new OK({
    //         message: "Delete user profile successfully",
    //         data: await UserService.deleteUser(req.params.userId)
    //     }).send(res);
    // }

    static async deleteUser(userId: string) {
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }

        const userResult = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
        const user = userResult.rows[0];

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const deleteQuery = "DELETE FROM users WHERE id = $1 RETURNING *";
        const deletedUserResult = await db.query(deleteQuery, [userId]);
        const deletedUser = deletedUserResult.rows[0];

        return deletedUser;
    }

    static async getUserBalance(userId: string) {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
        if(user.rows.length == 0) throw new NotFoundError("User not found");
        return user.rows[0].coinbalance;
    }

    static async updateUserBalance(userId: string, value: number) {
        const upadte = await db.query("UPDATE users SET coinbalance = $1 WHERE id = $2", [value, userId])
    }
}

export default UserService;
