import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import PrintingController from "../../controllers/printing.controller";

const router = express.Router();

//router.use(asyncHandler(authenticateToken));
router.post("/print", asyncHandler(PrintingController.printFile));

export default router;



