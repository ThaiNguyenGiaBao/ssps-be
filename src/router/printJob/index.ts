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

router.get("/totalPage/all", asyncHandler(PrintingController.getTotalPageOfAll));
router.get("/totalPage/:userId", asyncHandler(PrintingController.getTotalPage));
router.get("/totalUser", asyncHandler(PrintingController.getTotalUser));

router.get("/:printjobId", asyncHandler(PrintingController.getPrintJob));

export default router;



