import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import PrintingController from "../../controllers/printing.controller";

const router = express.Router();

router.use(asyncHandler(authenticateToken));
router.post("/get-all-user-file", asyncHandler(PrintingController.ShowFile));
router.post("/print", asyncHandler(PrintingController.Print));
router.post("/request-printing", asyncHandler(PrintingController.StartPrintJob));
router.post("/get-history", asyncHandler(PrintingController.getPrintingHistory));
router.post("/get-number-of-page", asyncHandler(PrintingController.getNumberOfPage));
router.post("/get-number-of-user-print", asyncHandler(PrintingController.getNumberOfUserPrint));

export default router;



