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
const printJob_service_1 = __importDefault(require("../services/printJob.service"));
const printJob_model_1 = __importDefault(require("../model/printJob.model"));
const user_service_1 = __importDefault(require("../services/user.service"));
const successResponse_1 = require("../helper/successResponse");
const errorRespone_1 = require("../helper/errorRespone");
// Controller vs Service
// CreatePrintJob (save config to db, calc price,  return {printJob, price})
// StartPrintJob (send req to printer (fake API), update status, return {printJob})
class PrintingController {
    // Controller must to return { message: string, data: any }
    // Anything else must write in service
    // Create print job (store in db), calculate price, return print job and price
    static CreatePrintJob(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role == "admin")
                throw new errorRespone_1.ForbiddenError("Only accept user");
            req.body.status = "created";
            req.body.userid = req.user.id;
            let printJob = yield printJob_model_1.default.savePrintJob(JSON.stringify(req.body));
            return new successResponse_1.Created({
                message: "Print job created",
                data: printJob
            });
        });
    }
    // Print file (call Fake API), update print job status, return message
    static Print(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role == "admin")
                throw new errorRespone_1.ForbiddenError("Only accept user");
            if (!(yield printJob_model_1.default.checkFileBelongToUser(req.user.id, req.body.fileid))) {
                throw new errorRespone_1.BadRequestError("User doesn't have this file!");
            }
            //const printJob = await PrintingService.CreatePrintJob({});
            const price = yield printJob_service_1.default.CalculatePrice(JSON.stringify(req.body));
            return new successResponse_1.OK({
                message: "Ready for printing!",
                data: {
                    //printJob: printJob,
                    price: price
                }
            }).send(res);
        });
    }
    static StartPrintJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user.role == "admin")
                throw new errorRespone_1.ForbiddenError("Only accept user");
            let printJob = yield printJob_model_1.default.getPrintJob(req.body.printJobId);
            if (printJob.status == "success") {
                printJob = yield printJob_model_1.default.clonePrintJob(req.body.printJobId);
                req.body.printJobId = printJob.id;
            }
            // Send request to printer
            // NOT DONE TASK: CHECK PERMITTED FILE HERE //
            let userBalance = yield user_service_1.default.getUserBalance(req.user.id);
            let price = yield printJob_service_1.default.CalculatePrice(JSON.stringify(printJob));
            if (price > userBalance) {
                yield printJob_model_1.default.updateStatus(req.body.printJobId, "unpaid");
                throw new errorRespone_1.PaymentRequired("User does not have enough coin!");
            }
            yield user_service_1.default.updateUserBalance(req.user.id, userBalance - price);
            yield printJob_model_1.default.updateStatus(req.body.printJobId, "waiting");
            // send printing request and done task
            //PrinterService.printFile(req.body.printJobId);
            return new successResponse_1.OK({
                message: "Accept printing request",
                data: "OK" // Return PringJob
            }).send(res);
        });
    }
    // Should separate to two function: getPrintJobByUserId and getPrintJobByPrinterId; add function getAllPrintJobs
    static getPrintingHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userid = req.body.userId;
            if (req.user.role == "user")
                userid = req.user.id;
            return new successResponse_1.OK({
                message: "All history printjob",
                data: yield printJob_model_1.default.getPrintJobByUserAndPrinter(userid, req.body.printerId, req.body.startDate, req.body.endDate, req.body.status)
            }).send(res);
        });
    }
    static getNumberOfPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userid = req.body.userId;
            if (req.user.role == "user")
                userid = req.user.id;
            return new successResponse_1.OK({
                message: "Total page",
                data: yield printJob_service_1.default.CalculateNumPage(userid, req.body.paperSize, req.body.startDate, req.body.endDate)
            }).send(res);
        });
    }
    static getNumberOfUserPrint(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.role == "user")
                throw new errorRespone_1.ForbiddenError("Only accept admin");
            return new successResponse_1.OK({
                message: "Total user use printing service",
                data: yield printJob_service_1.default.CalculateNumUserPrint(req.body.startDate, req.body.endDate)
            }).send(res);
        });
    }
}
exports.default = PrintingController;
