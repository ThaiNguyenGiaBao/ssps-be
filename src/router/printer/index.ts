import express from "express";
import { asyncHandler } from "../../utils";
import PrinterController from "../../controllers/printer.controller";
import { authenticateToken } from "../../middlewares/auth.middlewares";

const router = express.Router();

router.get("/", asyncHandler(PrinterController.getAllPrinter));
router.get("/:id", asyncHandler(PrinterController.getPrinterByID));
router.post("/", asyncHandler(PrinterController.addPrinter));

router.use(asyncHandler(authenticateToken));

router.delete("/:id", asyncHandler(PrinterController.removePrinter));
router.patch("/:id", asyncHandler(PrinterController.updatePrinter));

export default router;