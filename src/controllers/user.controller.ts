import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import UserService from "../services/user.service";
import { ForbiddenError } from "../helper/errorRespone";

class UserController {
    //router.get("/:userId", asyncHandler(UserController.getUser));
    static async getUser(req: Request, res: Response) {
        console.log("GetUserProfile::", req.params);
        if (req.user.id != req.params.userId) {
            throw new ForbiddenError("You are not allowed to access this resource");
        }
        return new Created({
            message: "Get user profile successfully",
            data: await UserService.getUser(req.params.userId)
        }).send(res);
    }
    // router.patch("/:userId", asyncHandler(UserController.updateUser));
    static async updateUser(req: Request, res: Response) {
        console.log("UpdateUserProfile::", req.params, req.body);
        if (req.user.id != req.params.userId && req.user.role != "admin") {
            throw new ForbiddenError("You are not allowed to update this resource");
        }
        return new OK({
            message: "Update user profile successfully",
            data: await UserService.updateUser(req.params.userId, req.body)
        }).send(res);
    }

    // router.delete("/:userId", asyncHandler(UserController.deleteUser));
    static async deleteUser(req: Request, res: Response) {
        console.log("DeleteUserProfile::", req.params);
        if (req.user.id != req.params.userId && req.user.role != "admin") {
            throw new ForbiddenError("You are not allowed to delete this resource");
        }
        return new OK({
            message: "Delete user profile successfully",
            data: await UserService.deleteUser(req.params.userId)
        }).send(res);
    }
}

export default UserController;
