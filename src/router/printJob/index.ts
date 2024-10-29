import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import PrintingController from "../../controllers/printJob.controller";

const router = express.Router();

router.use(asyncHandler(authenticateToken));

router.post("/createPrintJob", asyncHandler(PrintingController.CreatePrintJob));
router.post("/startPrintJob", asyncHandler(PrintingController.StartPrintJob));

router.get("/all", asyncHandler(PrintingController.getAllPrintingHistory));
router.get("/user/:userId", asyncHandler(PrintingController.getPrintingHistoryByUser));
router.get("/printer/:printerId", asyncHandler(PrintingController.getPrintingHistoryByPrinter));
router.get("/user/:userId/printer/:printerId", asyncHandler(PrintingController.getPrintingHistoryByUserAndPrinter));

router.get("/totalPage/:userId", asyncHandler(PrintingController.getTotalPage));
router.get("/totalUser", asyncHandler(PrintingController.getTotalUser));

export default router;



