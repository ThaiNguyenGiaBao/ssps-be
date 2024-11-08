import db from "../dbs/initDatabase";
import { FileObject } from "../utils/uploadFile";
class FileModel {
    static async createFile({
        uniqueFilename,
        downloadURL,
        userId,
        file
    }: {
        uniqueFilename: string;
        downloadURL: string;
        userId: string;
        file: FileObject;
    }) {
        const newFile = await db.query("INSERT INTO file (filename, url, userId, type) VALUES ($1,$2, $3, $4) RETURNING *", [
            uniqueFilename,
            downloadURL,
            userId,
            file.mimetype
        ]);
        return newFile.rows[0];
    }

    static async getAllFiles() {
        const files = await db.query("SELECT * FROM file");
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

    static async getFileById(fileId: string) {
        const file = await db.query("SELECT * FROM file WHERE id = $1", [fileId]);
        return file.rows[0];
    }

    
}

export default FileModel;
