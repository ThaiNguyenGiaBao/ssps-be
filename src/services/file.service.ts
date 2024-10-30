import { BadRequestError, ForbiddenError, NotFoundError } from "../helper/errorRespone";
import db from "../dbs/initDatabase";
import uploadFile from "../utils/uploadFile";
import { FileObject } from "../utils/uploadFile";
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

        // Save into database
        const newFile = await db.query("INSERT INTO file (filename, url, userId, type) VALUES ($1,$2, $3, $4) RETURNING *", [
            uniqueFilename,
            downloadURL,
            userId,
            file.mimetype
        ]);
        return newFile.rows[0];
    }
    //router.get("/", asyncHandler(FileController.getAllFiles));
    static async getAllFiles() {
        const files = await db.query("SELECT * FROM file");
        return files.rows;
    }

    // router.get("/:userId", asyncHandler(FileController.getFile));
    static async getFileByUserId(userId: string) {
        const file = await db.query("SELECT * FROM file WHERE userId = $1", [userId]);
        return file.rows;
    }

    // router.delete("/delete", asyncHandler(FileController.deleteFile));
    static async deleteFile({ userId, fileId }: { userId: string; fileId: string }) {
        if (!fileId) {
            throw new BadRequestError("File Id is required");
        }

        const file = await db.query("DELETE FROM file WHERE id = $1 and userId = $2 RETURNING *", [fileId, userId]);
        if (file.rows.length === 0) {
            throw new NotFoundError("File not found");
        }
        return file.rows[0];
    }
}

export default FileService;
