import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { ForbiddenError } from "../helper/errorRespone";

class FileController {
    static async uploadFile(req: Request, res: Response) {
        console.log("FileController::uploadFile", req.body);

        if (req.user.id != req.body.userId) {
            throw new ForbiddenError("Permission denied on uploading file");
        }

        return new Created({
            message: "File uploaded successfully",
            data: {}
        }).send(res);
    }
    static async deleteFile(req: Request, res: Response) {
        console.log("FileController::deleteFile", req.body);

        if (req.user.id != req.body.userId && req.user.role != "admin") {
            throw new ForbiddenError("Permission denied on deleting file");
        }

        return new OK({
            message: "File deleted successfully",
            data: {}
        }).send(res);
    }
}

export default FileController;
