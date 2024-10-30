"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorRespone_1 = require("../helper/errorRespone");
const initDatabase_1 = __importDefault(require("../dbs/initDatabase"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    static getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new errorRespone_1.BadRequestError("User Id is required");
            }
            const userResult = yield initDatabase_1.default.query("SELECT * FROM users WHERE id = $1", [userId]);
            const user = userResult.rows[0];
            if (!user) {
                throw new errorRespone_1.NotFoundError("User not found");
            }
            return user;
        });
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
    static updateUser(userId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (userId, { email, username, password, avatarUrl, coinBalance }) {
            console.log("UpdateUserProfile::", userId, email, username, password, avatarUrl, coinBalance);
            if (!userId) {
                throw new errorRespone_1.BadRequestError("User Id is required");
            }
            const userResult = yield initDatabase_1.default.query("SELECT * FROM users WHERE id = $1", [userId]);
            const user = userResult.rows[0];
            if (!user) {
                throw new errorRespone_1.NotFoundError("User not found");
            }
            // Prepare update query parts
            const updates = [];
            const values = [];
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
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
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
            const updatedUserResult = yield initDatabase_1.default.query(updateQuery, values);
            const updatedUser = updatedUserResult.rows[0];
            console.log("Updated user", updatedUser);
            return updatedUser;
        });
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
    static deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new errorRespone_1.BadRequestError("User Id is required");
            }
            const userResult = yield initDatabase_1.default.query("SELECT * FROM users WHERE id = $1", [userId]);
            const user = userResult.rows[0];
            if (!user) {
                throw new errorRespone_1.NotFoundError("User not found");
            }
            const deleteQuery = "DELETE FROM users WHERE id = $1 RETURNING *";
            const deletedUserResult = yield initDatabase_1.default.query(deleteQuery, [userId]);
            const deletedUser = deletedUserResult.rows[0];
            return deletedUser;
        });
    }
    static getUserBalance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield initDatabase_1.default.query("SELECT * FROM users WHERE id = $1", [userId]);
            if (user.rows.length == 0)
                throw new errorRespone_1.NotFoundError("User not found");
            return user.rows[0].coinbalance;
        });
    }
    static updateUserBalance(userId, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const upadte = yield initDatabase_1.default.query("UPDATE users SET coinbalance = $1 WHERE id = $2", [value, userId]);
        });
    }
}
exports.default = UserService;
