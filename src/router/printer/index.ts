import express from "express";
import { asyncHandler } from "../../utils";
import PrinterController from "../../controllers/printer.controller";

const router = express.Router();

router.get("/:id?", asyncHandler(PrinterController.getPrinter));
router.post("/", asyncHandler(PrinterController.addPrinter));
router.delete("/:id", asyncHandler(PrinterController.removePrinter));
router.patch("/:id", asyncHandler(PrinterController.updatePrinter));

export default router;