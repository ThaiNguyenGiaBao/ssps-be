import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import FileController from "../../controllers/file.controller";

const router = express.Router();

router.use(asyncHandler(authenticateToken));
router.post("/upload", asyncHandler(FileController.uploadFile));
router.delete("/delete/:fileId", asyncHandler(FileController.deleteFile));

export default router;
