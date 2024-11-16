import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import db from "../dbs/initDatabase";
import bcrypt from "bcrypt";
import { checkUUID } from "../utils";
import UserModel from "../model/user.model";
import { User } from "discord.js";

class UserService {
    static async getUser(userId: string) {
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid input syntax for type uuid");
        }
        const user = await UserModel.findUserById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    }

    static async getAllUsers({ page, limit }: { page: number; limit: number }) {
        const users = await UserModel.getAllUsers({page, limit});
        return users;
    }

    // // router.patch("/:userId", asyncHandler(UserController.updateUser));

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
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid input syntax for type uuid");
        }

        const user = await UserModel.findUserById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid input syntax for type uuid");
        }

        // Prepare update query parts
        const updates: string[] = [];
        const values: (string | number | null)[] = [];

        const updatedUser = await UserModel.updateUser(userId, {
            email,
            username,
            password,
            avatarUrl,
            coinBalance
        });
        console.log("Updated user", updatedUser);
        return updatedUser;
    }

    // // router.delete("/:userId", asyncHandler(UserController.deleteUser));

    static async deleteUser(userId: string) {
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }
        if (!checkUUID(userId)) {
            throw new BadRequestError("Invalid input syntax for type uuid");
        }

        const user = await UserModel.findUserById(userId);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const deletedUser = await UserModel.deleteUser(userId);
        return deletedUser;
    }

    static async getUserBalance(userId: string) {
        const user = await UserModel.findUserById(userId);
        if (!user) throw new NotFoundError("User not found");
        return user.coinbalance;
    }

    static async updateUserBalance(userId: string, value: number) {
        const user = await UserModel.updateUser(userId, { coinBalance: value });
        return user;
    }
}

export default UserService;
