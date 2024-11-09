import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import db from "../dbs/initDatabase";
import uploadFile from "../utils/uploadFile";
import { FileObject } from "../utils/uploadFile";
import FileModel from "../model/file.model";
class FileService {
    // router.post("/upload", upload.single("file"), asyncHandler(FileController.uploadFile));
    static async uploadFile(userId: string, file: FileObject) {
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.originalname}`;

        const downloadURL = await uploadFile({
            originalname: uniqueFilename,
            buffer: file.buffer,
            mimetype: file.mimetype
        });

        const newFile = await FileModel.createFile({
            uniqueFilename,
            downloadURL,
            userId,
            file
        });
        return newFile;
    }
    //router.get("/", asyncHandler(FileController.getAllFiles));
    static async getAllFiles({ page, limit }: { page: number; limit: number }) {
        return await FileModel.getAllFiles({ page, limit });
    }

    static async getFileById(userId: string, fileId: string) {
        if (!fileId) {
            throw new BadRequestError("File Id is required");
        }
        const file = await FileModel.getFileById(fileId);

        if (!file) {
            throw new NotFoundError("File not found");
        }
        return file;
    }

    // router.get("/:userId", asyncHandler(FileController.getFile));
    static async getFileByUserId(userId: string) {
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }
        const file = await FileModel.getFileByUserId(userId);

        if (file.length === 0) {
            throw new NotFoundError("File not found");
        }
        return file;
    }

    // router.delete("/delete", asyncHandler(FileController.deleteFile));
    static async deleteFile({ userId, fileId }: { userId: string; fileId: string }) {
        if (!userId) {
            throw new BadRequestError("User Id is required");
        }
        if (!fileId) {
            throw new BadRequestError("File Id is required");
        }

        const file = await FileModel.getFileById(fileId);

        if (!file) {
            throw new NotFoundError("File not found");
        }

        return await FileModel.deleteFile(fileId);
    }
}

export default FileService;
