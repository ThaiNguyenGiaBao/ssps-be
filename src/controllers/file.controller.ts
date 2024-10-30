import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";
import { ForbiddenError, BadRequestError } from "../helper/errorRespone";
import FileService from "../services/file.service";

class FileController {
    static async uploadFile(req: Request, res: Response) {
        console.log("FileController::uploadFile", req.body);

        if (!req.file) {
            throw new BadRequestError("File is required");
        }

        return new Created({
            message: "File uploaded successfully",
            data: await FileService.uploadFile(req.user.id, {
                originalname: req.file.originalname,
                buffer: req.file.buffer,
                mimetype: req.file.mimetype
            })
        }).send(res);
    }
    static async deleteFile(req: Request, res: Response) {
        console.log("FileController::deleteFile", req.body);

        if (!req.user.id && req.user.role != "admin") {
            throw new ForbiddenError("Permission denied on deleting file");
        }

        return new OK({
            message: "File deleted successfully",
            data: await FileService.deleteFile({ userId: req.user.id, fileId: req.body.fileId })
        }).send(res);
    }

    //router.get("/", asyncHandler(FileController.getAllFiles));
    static async getAllFiles(req: Request, res: Response) {
        console.log("FileController::getAllFiles");

        if (req.user.role != "admin") {
            throw new ForbiddenError("Permission denied on getting all files");
        }

        return new OK({
            message: "Get all files successfully",
            data: await FileService.getAllFiles()
        }).send(res);
    }

    // router.get("/:userId", asyncHandler(FileController.getFile));
    static async getFile(req: Request, res: Response) {
        console.log("FileController::getFile", req.params.userId);

        if (req.user.id != req.params.userId && req.user.role != "admin") {
            throw new ForbiddenError("Permission denied on getting file");
        }

        return new OK({
            message: "Get file successfully",
            data: await FileService.getFileByUserId(req.params.userId)
        }).send(res);
    }
}

export default FileController;
