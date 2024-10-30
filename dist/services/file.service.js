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
const uploadFile_1 = __importDefault(require("../utils/uploadFile"));
class FileService {
    // router.post("/upload", upload.single("file"), asyncHandler(FileController.uploadFile));
    static uploadFile(userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Date.now();
            const uniqueFilename = `${timestamp}-${file.originalname}`;
            const downloadURL = yield (0, uploadFile_1.default)({
                originalname: uniqueFilename,
                buffer: file.buffer,
                mimetype: file.mimetype
            });
            // Save into database
            const newFile = yield initDatabase_1.default.query("INSERT INTO file (filename, url, userId, type) VALUES ($1,$2, $3, $4) RETURNING *", [
                uniqueFilename,
                downloadURL,
                userId,
                file.mimetype
            ]);
            return newFile.rows[0];
        });
    }
    //router.get("/", asyncHandler(FileController.getAllFiles));
    static getAllFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield initDatabase_1.default.query("SELECT * FROM file");
            return files.rows;
        });
    }
    // router.get("/:userId", asyncHandler(FileController.getFile));
    static getFileByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield initDatabase_1.default.query("SELECT * FROM file WHERE userId = $1", [userId]);
            return file.rows;
        });
    }
    // router.delete("/delete", asyncHandler(FileController.deleteFile));
    static deleteFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, fileId }) {
            if (!fileId) {
                throw new errorRespone_1.BadRequestError("File Id is required");
            }
            const file = yield initDatabase_1.default.query("DELETE FROM file WHERE id = $1 and userId = $2 RETURNING *", [fileId, userId]);
            if (file.rows.length === 0) {
                throw new errorRespone_1.NotFoundError("File not found");
            }
            return file.rows[0];
        });
    }
}
exports.default = FileService;
