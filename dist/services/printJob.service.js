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
const printJob_model_1 = __importDefault(require("../model/printJob.model"));
const user_service_1 = __importDefault(require("../services/user.service"));
const initDatabase_1 = __importDefault(require("../dbs/initDatabase"));
const errorRespone_1 = require("../helper/errorRespone");
class PrintingJobService {
    static getPrintJob(printJobId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (printJobId == null)
                throw new errorRespone_1.BadRequestError("printJobId is null");
            return yield printJob_model_1.default.getPrintJob(printJobId);
        });
    }
    static updateStatus(_a) {
        return __awaiter(this, arguments, void 0, function* ({ printJobId, newStatus }) {
            if (printJobId == null)
                throw new errorRespone_1.BadRequestError("printJobId is null");
            let acceptStatus = new Set(["created", "waiting", "success", "fail", "unpaid"]);
            if (!acceptStatus.has(newStatus))
                throw new errorRespone_1.BadRequestError("Status is not valid");
            yield printJob_model_1.default.updateStatus(printJobId, newStatus);
        });
    }
    static getPrintingHistoryByUserAndPrinter(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, printerId, startDate, endDate, PageNum, itemPerPage }) {
            if (userId == null)
                throw new errorRespone_1.BadRequestError("userId is null");
            if (printerId == null)
                throw new errorRespone_1.BadRequestError("printerId is null");
            if (startDate != null && endDate != null) {
                let checkStartDate = isNaN(Date.parse(startDate));
                let checkEndDate = isNaN(Date.parse(endDate));
                if (checkStartDate || checkEndDate)
                    throw new errorRespone_1.BadRequestError("Date format is wrong");
            }
            if (!Number.isInteger(PageNum) || PageNum < 0)
                throw new errorRespone_1.BadRequestError("Pagination: displayPage is invalid");
            if (!Number.isInteger(itemPerPage) || itemPerPage < 0)
                throw new errorRespone_1.BadRequestError("Pagination: itemPerPage is invalid");
            let result;
            if (userId != "none")
                yield user_service_1.default.getUser(userId); // Check if user's exist
            if (userId != "none" && printerId != "none") {
                result = yield printJob_model_1.default.getPrintJobByUserAndPrinter({
                    userId: userId,
                    printerId: printerId,
                    startDate: startDate,
                    endDate: endDate,
                    PageNum: PageNum,
                    itemPerPage: itemPerPage
                });
            }
            else if (userId != "none") {
                result = yield printJob_model_1.default.getPrintJobByUser({
                    userId: userId,
                    startDate: startDate,
                    endDate: endDate,
                    PageNum: PageNum,
                    itemPerPage: itemPerPage
                });
            }
            else if (printerId != "none") {
                result = yield printJob_model_1.default.getPrintJobByPrinter({
                    printerId: printerId,
                    startDate: startDate,
                    endDate: endDate,
                    PageNum: PageNum,
                    itemPerPage: itemPerPage
                });
            }
            else {
                result = yield printJob_model_1.default.getPrintJobByDuration({
                    startDate: startDate,
                    endDate: endDate,
                    PageNum: PageNum,
                    itemPerPage: itemPerPage
                });
            }
            let numItem = result.length;
            let totalPage = 0;
            let prices = [];
            for (let i in result) {
                let printJob = result[i];
                prices.push(yield PrintingJobService.CalculatePrice({
                    papersize: printJob.papersize,
                    colortype: printJob.colortype,
                    numpage: printJob.numpage,
                    numside: printJob.numside,
                    pagepersheet: printJob.pagepersheet,
                    numcopy: printJob.numcopy
                }));
                if (printJob.status != "success")
                    continue;
                totalPage += Math.ceil(printJob.numpage / (printJob.numside * printJob.pagepersheet)) * printJob.numcopy;
            }
            return {
                printjob: result,
                totalItem: numItem,
                totalPage: totalPage,
                prices: prices
            };
        });
    }
    static savePrintJob(_a) {
        return __awaiter(this, arguments, void 0, function* ({ printerid, userid, fileid, papersize, numpage, numside, numcopy, pagepersheet, colortype, orientation, status }) {
            if (printerid == null || printerid == null || fileid == null ||
                papersize == null || numpage <= 0 || numpage == null || (numside != 1 && numside != 2) ||
                numcopy <= 0 || numcopy == null || pagepersheet <= 0 || pagepersheet == null ||
                colortype == null || orientation == null || status == null)
                throw new errorRespone_1.BadRequestError("Invalid parameter for saving printJob");
            const File = yield initDatabase_1.default.query("SELECT * FROM file WHERE id::text = $1", [fileid]);
            if (File.rows.length == 0) {
                throw new errorRespone_1.NotFoundError("File is not exist");
            }
            yield user_service_1.default.getUser(userid); // Check if user's exist
            // TO-DO check if printer is not exist -> wait for printer service
            const DeleteExistPrintJob = yield initDatabase_1.default.query("DELETE FROM printingjob WHERE fileid::text = $1 AND status = 'created'", [fileid]);
            const newPrintjob = yield initDatabase_1.default.query("INSERT INTO printingjob (printerid, userid, fileid, papersize, numpage, numside, numcopy, \
            pagepersheet, colortype, orientation, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [
                printerid,
                userid,
                fileid,
                papersize,
                numpage,
                numside,
                numcopy,
                pagepersheet,
                colortype,
                orientation,
                status
            ]);
            return newPrintjob.rows[0];
        });
    }
    static CalculatePrice(_a) {
        return __awaiter(this, arguments, void 0, function* ({ papersize, colortype, numpage, numside, pagepersheet, numcopy }) {
            if (papersize == null || numpage <= 0 || numpage == null || (numside != 1 && numside != 2) ||
                numcopy <= 0 || numcopy == null || pagepersheet <= 0 || pagepersheet == null ||
                colortype == null)
                throw new errorRespone_1.BadRequestError("Invalid parameter for CalculatePrice");
            let base_coin = 1;
            if (papersize == "A5")
                base_coin = 1;
            else if (papersize == "A4")
                base_coin = 2;
            else if (papersize == "A3")
                base_coin = 4;
            else if (papersize == "A2")
                base_coin = 8;
            else if (papersize == "A1")
                base_coin = 16;
            else
                throw new errorRespone_1.BadRequestError("Invalid paper size (A1-A5 only)!");
            let color_price = 1;
            if (colortype.toLowerCase() != "grayscale")
                color_price = 2;
            return Math.ceil(numpage / (numside * pagepersheet)) * numcopy * base_coin * color_price;
        });
    }
    static CalculateTotalPage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, paperSize, startDate, endDate }) {
            if (userId == null)
                throw new errorRespone_1.BadRequestError("Invalid parameter for CalculateTotalPage");
            if (startDate != null && endDate != null) {
                let checkStartDate = isNaN(Date.parse(startDate));
                let checkEndDate = isNaN(Date.parse(endDate));
                if (checkStartDate || checkEndDate)
                    throw new errorRespone_1.BadRequestError("Date format is wrong");
            }
            yield user_service_1.default.getUser(userId); // Check if user's exist
            let allPrintjob = yield printJob_model_1.default.getPrintJobByUser({
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                PageNum: 0,
                itemPerPage: 10
            });
            let total_page = 0;
            for (let i in allPrintjob) {
                let printJob = allPrintjob[i];
                if (printJob.status != "success")
                    continue;
                if (printJob.papersize != paperSize && paperSize != null)
                    continue;
                total_page += Math.ceil(printJob.numpage / (printJob.numside * printJob.pagepersheet)) * printJob.numcopy;
            }
            return total_page;
        });
    }
    static CalculateTotalUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate }) {
            if (startDate != null && endDate != null) {
                let checkStartDate = isNaN(Date.parse(startDate));
                let checkEndDate = isNaN(Date.parse(endDate));
                if (checkStartDate || checkEndDate)
                    throw new errorRespone_1.BadRequestError("Date format is wrong");
            }
            let allPrintjob = yield printJob_model_1.default.getPrintJobByDuration({
                startDate: startDate,
                endDate: endDate,
                PageNum: 0,
                itemPerPage: 100
            });
            let user = new Set();
            for (let i in allPrintjob)
                user.add(allPrintjob[i].userid);
            return user.size;
        });
    }
}
exports.default = PrintingJobService;
