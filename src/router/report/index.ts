import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import ReportController from "../../controllers/report.controller";

const router = express.Router();

router.use(asyncHandler(authenticateToken));

router.post("/generateMonthlyReport", asyncHandler(ReportController.generateMonthlyReport));
router.post("/generateYearlyReport", asyncHandler(ReportController.generateYearlyReport)); 
router.post("/addEvent", asyncHandler(ReportController.addEvent)); // Not really necessary

router.get("/", asyncHandler(ReportController.getAllReport)); 
// router.get("/event", asyncHandler(ReportController.getReportById));
// router.get("/event/:eventId", asyncHandler(ReportController.getReportById));
router.get("/:reportId", asyncHandler(ReportController.getReportById));

// router.delete("/event/:eventId", asyncHandler(ReportController.deleteEvent));
router.delete("/:reportId", asyncHandler(ReportController.deleteReport));

// router.patch("/event/:eventId", asyncHandler(ReportController.updateEvent));
router.patch("/:reportId", asyncHandler(ReportController.updateReport));

export default router;



