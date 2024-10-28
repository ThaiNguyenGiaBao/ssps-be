import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import FileController from "../../controllers/file.controller";
import upload from "../../configs/multer";
import uploadFile from "../../utils/uploadFile";
const router = express.Router();

router.use(asyncHandler(authenticateToken));
router.get("/", asyncHandler(FileController.getAllFiles));
router.get("/:userId", asyncHandler(FileController.getFile));
router.post("/upload", upload.single("file"), asyncHandler(FileController.uploadFile));
router.delete("/delete", asyncHandler(FileController.deleteFile));

export default router;
