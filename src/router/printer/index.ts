import express from "express";
import { asyncHandler } from "../../utils";
import PrinterController from "../../controllers/printer.controller";

const router = express.Router();


// router.get("/:id?", asyncHandler(PrinterController.getPrinterById));
// router.get("/", asyncHandler(PrinterController.getAllPrinters));


router.get("/:id?", asyncHandler(PrinterController.getPrinter));
router.post("/", asyncHandler(PrinterController.addPrinter));

// Use authentication middleware 
//router.use(asyncHandler(authenticateToken));


router.delete("/:id", asyncHandler(PrinterController.removePrinter));
router.patch("/:id", asyncHandler(PrinterController.updatePrinter));

export default router;