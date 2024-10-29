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
const initDatabase_1 = __importDefault(require("../dbs/initDatabase"));
const errorRespone_1 = require("../helper/errorRespone");
class PrintingJobModel {
    static getAllFile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileResult = yield initDatabase_1.default.query("SELECT * FROM file WHERE userid = $1", [userId]);
            return fileResult.rows;
        });
    }
    static checkFileBelongToUser(userId, fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileResult = yield initDatabase_1.default.query("SELECT * FROM file WHERE userid = $1 AND id = $2", [userId, fileId]);
            return (fileResult.rows.length != 0);
        });
    }
    static savePrintJob(cfgJSON) {
        return __awaiter(this, void 0, void 0, function* () {
            let cfg = JSON.parse(cfgJSON);
            const File = yield initDatabase_1.default.query("SELECT * FROM file WHERE id = $1", [cfg.fileid]);
            if (File.rows.length == 0) {
                throw new errorRespone_1.NotFoundError("File is not exist");
            }
            const DeleteExistPrintJob = yield initDatabase_1.default.query("DELETE FROM printingjob WHERE fileid = $1 AND status = 'created'", [cfg.fileid]);
            const newPrintjob = yield initDatabase_1.default.query("INSERT INTO printingjob (printerid, userid, fileid, papersize, numpage, numside, numcopy, \
            pagepersheet, colortype, orientation, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [
                cfg.printerid,
                cfg.userid,
                cfg.fileid,
                cfg.papersize,
                cfg.numpage,
                cfg.numside,
                cfg.numcopy,
                cfg.pagepersheet,
                cfg.colortype,
                cfg.orientation,
                cfg.status
            ]);
            return newPrintjob.rows[0];
        });
    }
    static getPrintJob(printJobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const printJob = yield initDatabase_1.default.query("SELECT * FROM printingjob WHERE id = $1", [printJobId]);
            if (printJob.rows.length == 0)
                throw new errorRespone_1.NotFoundError("Can not find this printjob!");
            return printJob.rows[0];
        });
    }
    static getPrintJobByUserAndPrinter(userId, printerId, startTime, endTime, status) {
        return __awaiter(this, void 0, void 0, function* () {
            let allPrintJob;
            if (printerId == 'none' && userId == 'none')
                allPrintJob = yield initDatabase_1.default.query("SELECT * FROM printingjob WHERE starttime >= '" + startTime + "' AND starttime <= '" + endTime + "'");
            else if (printerId == 'none')
                allPrintJob = yield initDatabase_1.default.query("SELECT * FROM printingjob WHERE userid = $1 AND starttime >= '" + startTime + "' AND starttime <= '" + endTime + "'", [userId]);
            else if (userId == 'none')
                allPrintJob = yield initDatabase_1.default.query("SELECT * FROM printingjob WHERE printerid = $1 AND starttime >=  '" + startTime + "' AND starttime <= '" + endTime + "'", [printerId]);
            else
                allPrintJob = yield initDatabase_1.default.query("SELECT * FROM printingjob WHERE userid = $1 AND printerid = $2 AND starttime >= '" + startTime + "' AND starttime <= '" + endTime + "'", [userId, printerId]);
            let set = new Set(status);
            let result = [];
            for (let i in allPrintJob.rows) {
                if (set.has(allPrintJob.rows[i].status)) {
                    result.push(allPrintJob.rows[i]);
                }
            }
            return result;
        });
    }
    static deletePrintJob(printJobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const DeleteExistPrintJob = yield initDatabase_1.default.query("DELETE FROM printingjob WHERE id = $1", [printJobId]);
        });
    }
    static deletePrintJobByUserAndPrinter(userId, printerId, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            let allPrintJob = yield PrintingJobModel.getPrintJobByUserAndPrinter(userId, printerId, startTime, endTime, ["success", "unpaid", "fail", "waiting", "created"]);
            for (let i in allPrintJob) {
                PrintingJobModel.deletePrintJob(allPrintJob[i].id);
            }
        });
    }
    static updateStatus(printJobId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const upadte = yield initDatabase_1.default.query("UPDATE printingjob SET status = $1 WHERE id = $2", [newStatus, printJobId]);
        });
    }
    static clonePrintJob(printJobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentPrintJob = yield initDatabase_1.default.query("SELECT * FROM printingjob WHERE id = $1", [printJobId]);
            if (currentPrintJob.rows.length == 0)
                throw new errorRespone_1.NotFoundError('Printjob not found');
            let cfg = currentPrintJob.rows[0];
            const newPrintjob = yield initDatabase_1.default.query("INSERT INTO printingjob (printerid, userid, fileid, papersize, numpage, numside, numcopy, \
            pagepersheet, colortype, orientation, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [
                cfg.printerid,
                cfg.userid,
                cfg.fileid,
                cfg.papersize,
                cfg.numpage,
                cfg.numside,
                cfg.numcopy,
                cfg.pagepersheet,
                cfg.colortype,
                cfg.orientation,
                "created"
            ]);
            return newPrintjob.rows[0];
        });
    }
}
exports.default = PrintingJobModel;
