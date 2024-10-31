"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorRespone_1 = require("../helper/errorRespone");
const printer_model_1 = __importDefault(require("../model/printer.model"));
class PrinterService {
    static getAllPrinter() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield printer_model_1.default.findAllPrinter();
            return result;
        });
    }
    static getPrinterByID(printerID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!printerID) {
                throw new errorRespone_1.BadRequestError("Printer ID is required");
            }
            const result = yield printer_model_1.default.findPrinterByID(printerID);
            if (result === null)
                throw new errorRespone_1.NotFoundError("Cannot find the printer with ID " + printerID);
            return result;
        });
    }
    static addPrinter(printer) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for mandatory attribute
            if (!printer.brand)
                throw new errorRespone_1.BadRequestError("Printer Brand is required");
            if (!printer.model)
                throw new errorRespone_1.BadRequestError("Printer Model is required");
            if (!printer.status)
                throw new errorRespone_1.BadRequestError("Printer Status is required");
            // Check for invalid type
            if (printer.status !== "enabled" && printer.status !== "disabled")
                throw new errorRespone_1.BadRequestError("Printer status must be 'enabled' or 'disabled'");
            const result = yield printer_model_1.default.createPrinter(printer);
            if (result === null)
                throw new errorRespone_1.InternalServerError("Cannot create the printer");
            return result;
        });
    }
    static removePrinter(printerID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!printerID)
                throw new errorRespone_1.BadRequestError("Printer ID is required");
            const result = yield printer_model_1.default.deletePrinter(printerID);
            if (result === null)
                throw new errorRespone_1.NotFoundError("Cannot found the printer to delete");
            return result;
        });
    }
    static updatePrinter(printerID, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.status && data.status !== "enabled" && data.status != "disabled")
                throw new errorRespone_1.BadRequestError("Printer status must be 'enabled' or 'disabled'");
            const result = yield printer_model_1.default.updatePrinter(printerID, data);
            if (result === null)
                throw new errorRespone_1.NotFoundError("Not found the printer with ID " + printerID);
            return result;
        });
    }
}
exports.default = PrinterService;
