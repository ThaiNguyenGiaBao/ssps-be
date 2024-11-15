import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import db from "../dbs/initDatabase";
import uploadFile from "../utils/uploadFile";
import { FileObject } from "../utils/uploadFile";
import FileModel from "../model/file.model";
import pdfParse from "pdf-parse";

class FileService {
    static async getPdfPageCount(file: FileObject): Promise<number | null> {
        if (file.mimetype === "application/pdf") {
            try {
                const pdfData = await pdfParse(file.buffer);
                return pdfData.numpages;
            } catch (error) {
                console.error("Error parsing PDF:", error);
                return null;
            }
        }
        return null; // Return null if the file is not a PDF
    }

    // router.post("/upload", upload.single("file"), asyncHandler(FileController.uploadFile));
    static async uploadFile(userId: string, file: FileObject) {
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.originalname}`;
        let pageCount = await this.getPdfPageCount(file);
        const downloadURL = await uploadFile({
            originalname: uniqueFilename,
            buffer: file.buffer,
            mimetype: file.mimetype
        });
        pageCount = pageCount == null ? 1 : pageCount;
        const newFile = await FileModel.createFile({
            uniqueFilename,
            downloadURL,
            userId,
            file,
            numpage: pageCount
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
        return await FileModel.softDeleteFile(fileId);

        //return await FileModel.deleteFile(fileId);
    }
}

export default FileService;
