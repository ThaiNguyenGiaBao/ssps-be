import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import PrintingController from "../../controllers/printing.controller";

const router = express.Router();

router.use(asyncHandler(authenticateToken));
router.post("/get-file", asyncHandler(PrintingController.ShowFile));
router.post("/print", asyncHandler(PrintingController.Print));
router.post("/request-printing", asyncHandler(PrintingController.StartPrintJob));

export default router;



