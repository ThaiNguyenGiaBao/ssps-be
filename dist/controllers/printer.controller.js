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
const successResponse_1 = require("../helper/successResponse");
const printer_service_1 = __importDefault(require("../services/printer.service"));
class PrinterController {
    static getPrinterByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield printer_service_1.default.getPrinterByID(req.params.id);
            return new successResponse_1.OK({
                data: result,
                message: "Get printer successfully"
            }).send(res);
        });
    }
    static getAllPrinter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield printer_service_1.default.getAllPrinter();
            return new successResponse_1.OK({
                data: result,
                message: result.length === 0 ? "No printer found" :
                    "Get all printers successfully"
            }).send(res);
        });
    }
    static addPrinter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const printer = {
                id: "dummy",
                brand: req.body.brand,
                model: req.body.model,
                status: req.body.status,
                locationId: req.body.locationId,
                shortDescription: req.body.shortDescription
            };
            const result = yield printer_service_1.default.addPrinter(printer);
            return new successResponse_1.Created({
                message: "Printer added succeessfully",
                data: result
            }).send(res);
        });
    }
    static removePrinter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield printer_service_1.default.removePrinter(req.params.id);
            return new successResponse_1.OK({
                message: "Delete successfully",
                data: result
            }).send(res);
        });
    }
    static updatePrinter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield printer_service_1.default.updatePrinter(req.params.id, req.body);
            return new successResponse_1.OK({
                message: "Update successfully",
                data: result
            }).send(res);
        });
    }
}
exports.default = PrinterController;
