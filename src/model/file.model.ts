import db from "../dbs/initDatabase";
import { FileObject } from "../utils/uploadFile";
class FileModel {
    static async createFile({
        uniqueFilename,
        downloadURL,
        userId,
        file,
        numpage
    }: {
        uniqueFilename: string;
        downloadURL: string;
        userId: string;
        file: FileObject;
        numpage: number;
    }) {
        const newFile = await db.query("INSERT INTO file (filename, url, userId, type, numpage) VALUES ($1,$2, $3, $4, $5) RETURNING *", [
            uniqueFilename,
            downloadURL,
            userId,
            file.mimetype,
            numpage
        ]);
        return newFile.rows[0];
    }

    static async getAllFiles({ page, limit }: { page: number; limit: number }) {
        const files = await db.query("SELECT * FROM file LIMIT $1 OFFSET $2", [limit, (page - 1) * limit]);
        return files.rows;
    }

    static async getFileByUserId(userId: string) {
        const file = await db.query("SELECT * FROM file WHERE userId = $1", [userId]);
        return file.rows;
    }

    static async deleteFile(fileId: string) {
        const file = await db.query("DELETE FROM file WHERE id = $1 RETURNING *", [fileId]);
        return file.rows[0];
    }

    static async softDeleteFile(fileId: string) {
        const file = await db.query("UPDATE file SET isDeleted = true WHERE id = $1 RETURNING *", [fileId]);
        return file.rows[0];
    }

    static async getFileById(fileId: string) {
        const file = await db.query("SELECT * FROM file WHERE id = $1", [fileId]);
        return file.rows[0];
    }
}

export default FileModel;
