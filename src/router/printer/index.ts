import express from "express";
import { asyncHandler } from "../../utils";
import PrinterService from "../../services/printer.service";

const router = express.Router();

router.get("/", asyncHandler(PrinterService.getAllPrinter()))

export default router;